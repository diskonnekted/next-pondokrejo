import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createApiRouteHandler } from "@/lib/api-helpers";

type KomunitasPopular = {
    name: string;
    category: string;
    description: string;
    url: string;
};

type KomunitasEvent = {
    title: string;
    community: string;
    description: string;
    dateTimeText: string;
    location: string;
    url: string;
};

type Payload = {
    popular: KomunitasPopular[];
    events: KomunitasEvent[];
    fetchedAt: string;
};

const BASE_URL = "https://komunitas.pondokrejo.id";

function toAbsoluteUrl(url: string): string {
    return new URL(url, BASE_URL).toString();
}

function decodeHtml(text: string): string {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ");
}

function normalizeText(text: string): string {
    return decodeHtml(text).replace(/<!--\s*-->/g, " ").replace(/\s+/g, " ").trim();
}

function extractSection(html: string, startToken: string, endToken: string): string | null {
    const start = html.indexOf(startToken);
    if (start < 0) return null;
    const end = html.indexOf(endToken, start + startToken.length);
    if (end < 0) return html.slice(start);
    return html.slice(start, end);
}

function parsePopularCommunities(sectionHtml: string): KomunitasPopular[] {
    const results: KomunitasPopular[] = [];
    const re =
        /data-slot="card-title"[^>]*>([^<]+)<\/div>[\s\S]*?data-slot="badge"[^>]*>([^<]+)<\/span>[\s\S]*?data-slot="card-description"[^>]*>([^<]+)<\/div>[\s\S]*?href="(\/komunitas\/[^"]+)"/gi;

    let m: RegExpExecArray | null;
    while ((m = re.exec(sectionHtml))) {
        const name = normalizeText(m[1] ?? "");
        const category = normalizeText(m[2] ?? "");
        const description = normalizeText(m[3] ?? "");
        const href = m[4] ?? "";
        if (!name || !href) continue;
        results.push({
            name,
            category,
            description,
            url: toAbsoluteUrl(href),
        });
    }

    return results;
}

function parseUpcomingEvents(sectionHtml: string): KomunitasEvent[] {
    const results: KomunitasEvent[] = [];
    const re =
        /data-slot="card-title"[^>]*>([^<]+)<\/div>[\s\S]*?data-slot="badge"[^>]*>([^<]+)<\/span>[\s\S]*?data-slot="card-description"[^>]*>([^<]+)<\/div>[\s\S]*?lucide-calendar-days[\s\S]*?<\/svg>([\s\S]*?)<\/div>[\s\S]*?lucide-map-pin[\s\S]*?<\/svg>([\s\S]*?)<\/div>/gi;

    let m: RegExpExecArray | null;
    while ((m = re.exec(sectionHtml))) {
        const title = normalizeText(m[1] ?? "");
        const community = normalizeText(m[2] ?? "");
        const description = normalizeText(m[3] ?? "");
        const dateTimeText = normalizeText(m[4] ?? "");
        const location = normalizeText(m[5] ?? "");
        if (!title) continue;
        results.push({
            title,
            community,
            description,
            dateTimeText,
            location,
            url: toAbsoluteUrl("/kegiatan"),
        });
    }

    return results;
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    void request;

    const res = await fetch(`${BASE_URL}/`, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        next: { revalidate: 60 * 30, tags: ["komunitas-home"] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json(
            { success: false, error: `Gagal mengambil konten Komunitas: HTTP ${res.status}` },
            { status: res.status }
        );
    }

    const html = await res.text();

    const popularSection =
        extractSection(html, "Komunitas Populer</h2>", "Kegiatan Terdekat</h2>") ??
        extractSection(html, "Komunitas Populer", "Kegiatan Terdekat") ??
        "";
    const eventsSection = extractSection(html, "Kegiatan Terdekat</h2>", "Bergabunglah") ?? "";

    const payload: Payload = {
        popular: parsePopularCommunities(popularSection).slice(0, 8),
        events: parseUpcomingEvents(eventsSection).slice(0, 6),
        fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: payload });
});

