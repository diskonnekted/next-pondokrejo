import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createApiRouteHandler } from "@/lib/api-helpers";

type TtgTutorialDetail = {
    id: string;
    slug: string;
    title: string;
    category: string | null;
    author: string | null;
    readTime: string | null;
    heroImageUrl: string | null;
    dateText: string | null;
    excerptHtml: string | null;
    contentHtml: string | null;
    url: string;
};

type WpPostDetail = {
    id: number;
    slug: string;
    link: string;
    date: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    content: { rendered: string };
    _embedded?: {
        author?: Array<{ name?: string }>;
        "wp:featuredmedia"?: Array<{ source_url?: string }>;
        "wp:term"?: Array<Array<{ taxonomy?: string; name?: string }>>;
    };
};

const BASE_URL = "https://ttg.web.id";

function toAbsoluteUrl(url: string): string {
    return new URL(url, BASE_URL).toString();
}

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

function normalizeText(text: string): string {
    return decodeHtml(text).replace(/\s+/g, " ").trim();
}

function stripTags(html: string): string {
    return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ");
}

function estimateReadTimeMinutes(html: string): string | null {
    const text = normalizeText(stripTags(html));
    if (!text) return null;
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min`;
}

function formatDateId(dateIso: string): string | null {
    const d = new Date(dateIso);
    if (!Number.isFinite(d.getTime())) return null;
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest, context?: unknown) => {
    void request;
    const ctxId = (context as { params?: { id?: string } } | undefined)?.params?.id;
    const pathId = request.nextUrl.pathname.split("/").pop();
    const id = String(ctxId || pathId || "").trim();
    if (!id) return NextResponse.json({ success: false, error: "ID tutorial tidak valid" }, { status: 400 });
    if (!/^\d+$/.test(id)) return NextResponse.json({ success: false, error: "ID tutorial tidak valid" }, { status: 400 });

    const res = await fetch(`${BASE_URL}/wp-json/wp/v2/posts/${encodeURIComponent(id)}?_embed=1`, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "application/json",
        },
        next: { revalidate: 60 * 15, tags: ["ttg-webid", "ttg-webid-detail", `ttg-webid-${id}`] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json({ success: false, error: `Gagal mengambil konten TTG: HTTP ${res.status}` }, { status: res.status });
    }

    const post = (await res.json()) as WpPostDetail;

    const title = normalizeText(stripTags(post.title?.rendered || ""));
    if (!title) return NextResponse.json({ success: false, error: "Detail TTG tidak ditemukan" }, { status: 404 });

    const author = post._embedded?.author?.[0]?.name ?? null;
    const heroImageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;

    const category =
        post._embedded?.["wp:term"]
            ?.flat()
            ?.find((t) => t.taxonomy === "category" && t.name)?.name ?? null;

    const contentHtml = post.content?.rendered ?? null;
    const excerptHtml = post.excerpt?.rendered ?? null;

    const detail: TtgTutorialDetail = {
        id: String(post.id),
        slug: String(post.slug || ""),
        title,
        category,
        author,
        readTime: contentHtml ? estimateReadTimeMinutes(contentHtml) : null,
        heroImageUrl,
        dateText: formatDateId(post.date),
        excerptHtml,
        contentHtml,
        url: post.link ? toAbsoluteUrl(post.link) : `${BASE_URL}/`,
    };

    return NextResponse.json({ success: true, data: detail });
});
