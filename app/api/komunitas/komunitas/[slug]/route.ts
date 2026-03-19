import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createApiRouteHandler } from "@/lib/api-helpers";

type KomunitasDetail = {
    slug: string;
    name: string;
    category: string | null;
    description: string | null;
    membersActive: number | null;
    url: string;
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
    return decodeHtml(text).replace(/\s+/g, " ").trim();
}

function matchFirst(input: string, re: RegExp): string | null {
    const m = input.match(re);
    return m?.[1] ? normalizeText(m[1]) : null;
}

function parseDetail(html: string, slug: string): KomunitasDetail | null {
    const name = matchFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (!name) return null;

    const category = matchFirst(html, /<span[^>]*data-slot="badge"[^>]*>([\s\S]*?)<\/span>/i);
    const description = matchFirst(html, /<p[^>]*class="text-lg[^"]*"[^>]*>([\s\S]*?)<\/p>/i);

    const membersText = html.match(/(\d+)\s*<!--\s*-->\s*anggota\s+aktif/i)?.[1] ?? null;
    const membersActive = membersText ? Number(membersText) : null;

    return {
        slug,
        name,
        category,
        description,
        membersActive: Number.isFinite(membersActive) ? membersActive : null,
        url: toAbsoluteUrl(`/komunitas/${slug}`),
    };
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest, context?: unknown) => {
    void request;
    const ctxSlug = (context as { params?: { slug?: string } } | undefined)?.params?.slug;
    const pathSlug = request.nextUrl.pathname.split("/").pop();
    const slug = String(ctxSlug || pathSlug || "").trim();
    if (!slug) return NextResponse.json({ success: false, error: "Slug komunitas tidak valid" }, { status: 400 });

    const res = await fetch(`${BASE_URL}/komunitas/${encodeURIComponent(slug)}`, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        next: { revalidate: 60 * 30, tags: ["komunitas-detail", `komunitas-${slug}`] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json(
            { success: false, error: `Gagal mengambil detail komunitas: HTTP ${res.status}` },
            { status: res.status }
        );
    }

    const html = await res.text();
    const detail = parseDetail(html, slug);
    if (!detail) return NextResponse.json({ success: false, error: "Detail komunitas tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ success: true, data: detail });
});
