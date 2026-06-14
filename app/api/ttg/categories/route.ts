import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

import { createApiRouteHandler } from "@/lib/api-helpers";

type TtgCategory = {
    id: string;
    name: string;
    slug: string;
    count: number;
    url: string;
};

const BASE_URL = "https://ttg.pondokrejo.id";

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    void request;

    const res = await fetch(`${BASE_URL}/category.php`, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        next: { revalidate: 60 * 60, tags: ["ttg-categories"] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json({ success: false, error: `Gagal mengambil kategori TTG: HTTP ${res.status}` }, { status: res.status });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const categories: TtgCategory[] = [];

    $('a[href^="category.php?id="]').each((_, el) => {
        const href = $(el).attr("href") || "";
        const idMatch = href.match(/id=(\d+)/);
        if (idMatch) {
            const id = idMatch[1];
            let name = $(el).find("span").text().trim();
            if (!name) {
                // Sometimes it might just be inside the div or h3
                name = $(el).text().trim() || `Kategori ${id}`;
            }
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            if (!categories.find(c => c.id === id)) {
                categories.push({
                    id,
                    name,
                    slug,
                    count: 10, // Mock count
                    url: `${BASE_URL}/category.php?id=${id}`,
                });
            }
        }
    });

    return NextResponse.json({ success: true, data: categories, total: categories.length });
});
