import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createApiRouteHandler } from "@/lib/api-helpers";

type LapakProduct = {
    id: string;
    name: string;
    description: string;
    unit: string | null;
    price: number | null;
    discountPrice: number | null;
    photos: string[];
    category: string | null;
    sellerName: string | null;
    waUrl: string | null;
    sourceUrl: string;
};

type LapakPagination = {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
};

type UpstreamResponse = {
    data: Array<{
        id: string;
        attributes: {
            nama: string;
            deskripsi?: string | null;
            satuan?: string | null;
            harga?: number | null;
            harga_diskon?: number | null;
            foto?: string[] | null;
            pesan_wa?: string | null;
            kategori?: { kategori?: string | null } | null;
            pelapak?: { penduduk?: { nama?: string | null } | null } | null;
        };
    }>;
    meta?: { pagination?: LapakPagination };
};

const BASE_URL = "https://www.pondokrejo.sleman-desa.id";

function mapItem(item: UpstreamResponse["data"][number]): LapakProduct {
    const a = item.attributes;
    const photos = Array.isArray(a.foto) ? a.foto.filter(Boolean) : [];

    return {
        id: String(item.id),
        name: String(a.nama || "").trim(),
        description: String(a.deskripsi || "").trim(),
        unit: a.satuan ?? null,
        price: typeof a.harga === "number" ? a.harga : null,
        discountPrice: typeof a.harga_diskon === "number" ? a.harga_diskon : null,
        photos,
        category: a.kategori?.kategori ?? null,
        sellerName: a.pelapak?.penduduk?.nama ?? null,
        waUrl: a.pesan_wa ?? null,
        sourceUrl: `${BASE_URL}/index.php/lapak`,
    };
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest, context?: unknown) => {
    void request;
    const ctxId = (context as { params?: { id?: string } } | undefined)?.params?.id;
    const pathId = request.nextUrl.pathname.split("/").pop();
    const id = String(ctxId || pathId || "").trim();
    if (!id) return NextResponse.json({ success: false, error: "ID produk tidak valid" }, { status: 400 });
    if (!/^\d+$/.test(id)) return NextResponse.json({ success: false, error: "ID produk tidak valid" }, { status: 400 });

    let page = 1;
    const pageSize = 60;
    let totalPages = 1;

    while (page <= totalPages && page <= 10) {
        const url = new URL(`${BASE_URL}/internal_api/lapak/produk`);
        url.searchParams.set("page[number]", String(page));
        url.searchParams.set("page[size]", String(pageSize));

        const res = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                Accept: "application/json",
            },
            next: { revalidate: 60 * 10, tags: ["lapak-produk", `lapak-produk-${page}`] },
            signal: AbortSignal.timeout(30000),
        });

        if (!res.ok) {
            return NextResponse.json(
                { success: false, error: `Gagal mengambil data Lapak: HTTP ${res.status}` },
                { status: res.status }
            );
        }

        const json = (await res.json()) as UpstreamResponse;
        const pagination = json.meta?.pagination;
        if (pagination?.total_pages) totalPages = pagination.total_pages;

        const found = (json.data || []).find((x) => String(x.id) === id);
        if (found) {
            return NextResponse.json({ success: true, data: mapItem(found) });
        }

        page++;
    }

    return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
});
