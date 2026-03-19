import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createApiRouteHandler } from "@/lib/api-helpers";

type TtgTutorial = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    imageUrl: string | null;
    dateText: string | null;
    difficulty: string | null;
    url: string;
};

type WpPost = {
    id: number;
    slug: string;
    link: string;
    date: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    _embedded?: {
        "wp:featuredmedia"?: Array<{ source_url?: string }>;
    };
};

const BASE_URL = "https://ttg.web.id";

function decodeHtml(text: string): string {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&hellip;/g, "…")
        .replace(/&ndash;/g, "–")
        .replace(/&mdash;/g, "—")
        .replace(/&rsquo;/g, "’")
        .replace(/&lsquo;/g, "‘")
        .replace(/&ldquo;/g, "“")
        .replace(/&rdquo;/g, "”")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/Â/g, "")
        .replace(/â€¦/g, "…")
        .replace(/â€“/g, "–")
        .replace(/â€”/g, "—")
        .replace(/â€™/g, "’")
        .replace(/â€œ/g, "“")
        .replace(/â€�/g, "”");
}

function stripTags(html: string): string {
    return html.replace(/<[^>]*>/g, " ");
}

function normalizeText(text: string): string {
    return decodeHtml(text).replace(/\s+/g, " ").trim();
}

function formatDateId(dateIso: string): string | null {
    const d = new Date(dateIso);
    if (!Number.isFinite(d.getTime())) return null;
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit") || "12") || 12));
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    const categoryIdRaw = (searchParams.get("categoryId") || searchParams.get("category") || "").trim();
    const categoryId = categoryIdRaw && /^\d+$/.test(categoryIdRaw) ? categoryIdRaw : "";

    const url = new URL(`${BASE_URL}/wp-json/wp/v2/posts`);
    url.searchParams.set("per_page", String(limit));
    url.searchParams.set("page", String(page));
    url.searchParams.set("_embed", "1");
    if (categoryId) url.searchParams.set("categories", categoryId);

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "application/json",
        },
        next: { revalidate: 60 * 15, tags: ["ttg-webid", categoryId ? `ttg-webid-cat-${categoryId}` : "ttg-webid-all"] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json({ success: false, error: `Gagal mengambil konten TTG: HTTP ${res.status}` }, { status: res.status });
    }

    const total = Number(res.headers.get("x-wp-total") || "0") || 0;
    const totalPages = Number(res.headers.get("x-wp-totalpages") || "1") || 1;

    const json = (await res.json()) as WpPost[];

    const tutorials: TtgTutorial[] = (json || []).map((post) => {
        const title = normalizeText(stripTags(post.title?.rendered || ""));
        const excerpt = normalizeText(stripTags(post.excerpt?.rendered || ""));
        const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
        return {
            id: String(post.id),
            slug: String(post.slug || ""),
            title,
            excerpt,
            imageUrl,
            dateText: formatDateId(post.date),
            difficulty: null,
            url: post.link,
        };
    });

    return NextResponse.json({
        success: true,
        data: tutorials,
        meta: { pagination: { total, per_page: limit, current_page: page, total_pages: totalPages } },
    });
});
