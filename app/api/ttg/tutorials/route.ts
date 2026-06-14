import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

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

const BASE_URL = "https://ttg.pondokrejo.id";

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit") || "12") || 12));
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    const categoryIdRaw = (searchParams.get("categoryId") || searchParams.get("category") || "").trim();
    const categoryId = categoryIdRaw && /^\d+$/.test(categoryIdRaw) ? categoryIdRaw : "";

    let targetUrl = `${BASE_URL}/index.php?page=${page}`;
    if (categoryId) {
        targetUrl = `${BASE_URL}/category.php?id=${categoryId}&page=${page}`;
    }

    const res = await fetch(targetUrl, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        next: { revalidate: 60 * 15, tags: ["ttg-tutorials", categoryId ? `ttg-cat-${categoryId}` : "ttg-all"] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json({ success: false, error: `Gagal mengambil konten TTG: HTTP ${res.status}` }, { status: res.status });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const tutorials: TtgTutorial[] = [];

    $('a[href^="tutorial.php?id="]').each((_, el) => {
        const href = $(el).attr("href") || "";
        const idMatch = href.match(/id=(\d+)/);
        
        if (idMatch) {
            const id = idMatch[1];
            const title = $(el).find("h3, h4").text().trim() || `Tutorial ${id}`;
            let imageUrl = $(el).find("img.object-cover").attr("src") || null;
            if (imageUrl && !imageUrl.startsWith("http")) {
                imageUrl = `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }
            
            const dateText = $(el).find("p.text-gray-400").text().trim() || null;

            // Only add if not already in list (prevent duplicates on page)
            if (!tutorials.find(t => t.id === id)) {
                tutorials.push({
                    id,
                    slug: id,
                    title,
                    excerpt: "",
                    imageUrl,
                    dateText,
                    difficulty: null,
                    url: `${BASE_URL}/tutorial.php?id=${id}`,
                });
            }
        }
    });

    // In a scraped site without proper total pages indicator, we might just mock it or infer it.
    // Let's assume if we got items, there might be a next page, else not.
    // Check if there is a pagination link for page + 1
    const hasNextPage = $(`a[href*="page=${page + 1}"]`).length > 0;
    const totalPages = hasNextPage ? page + 1 : page;
    const total = tutorials.length + (page - 1) * limit; // Rough estimate

    return NextResponse.json({
        success: true,
        data: tutorials,
        meta: { pagination: { total, per_page: limit, current_page: page, total_pages: totalPages } },
    });
});
