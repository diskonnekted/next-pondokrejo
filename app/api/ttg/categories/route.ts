import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createApiRouteHandler } from "@/lib/api-helpers";

type TtgCategory = {
    id: string;
    name: string;
    slug: string;
    count: number;
    url: string;
};

type WpCategory = {
    id: number;
    name: string;
    slug: string;
    count: number;
};

const BASE_URL = "https://ttg.web.id";

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    void request;

    const res = await fetch(`${BASE_URL}/wp-json/wp/v2/categories?per_page=100&hide_empty=true`, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "application/json",
        },
        next: { revalidate: 60 * 60, tags: ["ttg-webid", "ttg-categories"] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json({ success: false, error: `Gagal mengambil kategori TTG: HTTP ${res.status}` }, { status: res.status });
    }

    const json = (await res.json()) as WpCategory[];

    const categories: TtgCategory[] = (json || [])
        .filter((c) => c && typeof c.id === "number" && c.name && c.slug)
        .map((c) => ({
            id: String(c.id),
            name: c.name,
            slug: c.slug,
            count: typeof c.count === "number" ? c.count : 0,
            url: `${BASE_URL}/category/${c.slug}/`,
        }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, data: categories, total: categories.length });
});
