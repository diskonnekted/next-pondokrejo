import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

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

const BASE_URL = "https://ttg.pondokrejo.id";

function estimateReadTimeMinutes(html: string): string | null {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return null;
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min`;
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest, context?: unknown) => {
    void request;
    const ctxId = (context as { params?: { id?: string } } | undefined)?.params?.id;
    const pathId = request.nextUrl.pathname.split("/").pop();
    const id = String(ctxId || pathId || "").trim();
    if (!id) return NextResponse.json({ success: false, error: "ID tutorial tidak valid" }, { status: 400 });
    if (!/^\d+$/.test(id)) return NextResponse.json({ success: false, error: "ID tutorial tidak valid" }, { status: 400 });

    const targetUrl = `${BASE_URL}/tutorial.php?id=${encodeURIComponent(id)}`;
    
    const res = await fetch(targetUrl, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        next: { revalidate: 60 * 15, tags: ["ttg-tutorials-detail", `ttg-${id}`] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json({ success: false, error: `Gagal mengambil konten TTG: HTTP ${res.status}` }, { status: res.status });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("h1").first().text().trim() || `Tutorial ${id}`;
    let heroImageUrl = $(".relative.h-56 img").attr("src") || null;
    if (heroImageUrl && !heroImageUrl.startsWith("http")) {
        heroImageUrl = `${BASE_URL}${heroImageUrl.startsWith("/") ? "" : "/"}${heroImageUrl}`;
    }

    const category = $(".absolute.top-4.right-4 span").text().trim() || null;
    const dateText = $(".absolute.bottom-0.left-0.right-0 p, .absolute.bottom-0.left-0.right-0 span").last().text().trim() || null;
    
    // Some cleaning of article content to make it display nicely
    const contentHtml = $(".article-content").html() || null;

    const detail: TtgTutorialDetail = {
        id,
        slug: id,
        title,
        category,
        author: "Admin TTG",
        readTime: contentHtml ? estimateReadTimeMinutes(contentHtml) : null,
        heroImageUrl,
        dateText,
        excerptHtml: null,
        contentHtml,
        url: targetUrl,
    };

    return NextResponse.json({ success: true, data: detail });
});
