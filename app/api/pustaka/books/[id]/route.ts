import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createApiRouteHandler } from "@/lib/api-helpers";

type PustakaBookDetail = {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    detailUrl: string;
    publisher: string | null;
    year: string | null;
    isbn: string | null;
    language: string | null;
    synopsis: string | null;
};

const BASE_URL = "https://pustaka.pondokrejo.id";

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

function parseField(html: string, label: string): string | null {
    const re = new RegExp(`<span[^>]*>\\s*${label}\\s*:<\\/span>\\s*([^<]+)`, "i");
    return matchFirst(html, re);
}

function stripTags(html: string): string {
    return html.replace(/<[^>]*>/g, " ");
}

function parseSynopsis(html: string): string | null {
    const byHeading =
        html.match(/<h2[^>]*>\s*(Sinopsis|Deskripsi)\s*<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[2] ?? null;
    if (byHeading) {
        const t = normalizeText(stripTags(byHeading));
        return t.length ? t : null;
    }

    const fallback = html.match(/<div[^>]*class="[^"]*prose[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? null;
    if (!fallback) return null;
    const t = normalizeText(stripTags(fallback));
    return t.length ? t : null;
}

function parseDetail(html: string, id: string): PustakaBookDetail | null {
    const title = matchFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (!title) return null;

    const author = matchFirst(html, /oleh\s*<span[^>]*>([^<]+)<\/span>/i) ?? "";

    const coverSrc =
        matchFirst(html, /<img[^>]*src="((?:\/)?uploads\/covers\/[^"]+)"/i) ??
        matchFirst(html, /<img[^>]*src="([^"]*\/uploads\/covers\/[^"]+)"/i) ??
        matchFirst(html, /<img[^>]*src="((?:\/)?uploads\/[^"]+)"/i) ??
        matchFirst(html, /<img[^>]*src="([^"]*\/uploads\/[^"]+)"/i);
    const coverUrl = coverSrc ? toAbsoluteUrl(coverSrc) : null;

    return {
        id,
        title,
        author,
        coverUrl,
        detailUrl: toAbsoluteUrl(`detail.php?id=${id}`),
        publisher: parseField(html, "Penerbit"),
        year: parseField(html, "Tahun"),
        isbn: parseField(html, "ISBN"),
        language: parseField(html, "Bahasa"),
        synopsis: parseSynopsis(html),
    };
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest, context?: unknown) => {
    const ctxId = (context as { params?: { id?: string } } | undefined)?.params?.id;
    const pathId = request.nextUrl.pathname.split("/").pop();
    const id = String(ctxId || pathId || "").trim();
    if (!id) {
        return NextResponse.json({ success: false, error: "ID buku tidak valid" }, { status: 400 });
    }
    if (!/^\d+$/.test(id)) {
        return NextResponse.json({ success: false, error: "ID buku tidak valid" }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}/detail.php?id=${encodeURIComponent(id)}`, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        next: { revalidate: 60 * 60, tags: ["pustaka-detail", `pustaka-detail-${id}`] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json(
            { success: false, error: `Gagal mengambil detail pustaka: HTTP ${res.status}` },
            { status: res.status }
        );
    }

    const html = await res.text();
    const detail = parseDetail(html, id);
    if (!detail) {
        return NextResponse.json({ success: false, error: "Detail buku tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: detail });
});
