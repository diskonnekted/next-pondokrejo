import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/api-response";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@/lib/api-response";
import { createApiRouteHandler } from "@/lib/api-helpers";

// Mock data for berita (will be replaced with database queries)
const mockBerita = [
    {
        id: 1,
        judul: "Peluncuran Portal Web Kalurahan Pondokrejo",
        slug: "peluncuran-portal-web-kalurahan-pondokrejo",
        ringkasan: "Portal web resmi Kalurahan Pondokrejo telah diluncurkan untuk meningkatkan pelayanan masyarakat.",
        konten: "Portal web resmi Kalurahan Pondokrejo telah diluncurkan dengan berbagai fitur canggih untuk meningkatkan pelayanan masyarakat...",
        gambar: "/images/berita/portal-launch.jpg",
        kategori: "Teknologi",
        status: "PUBLISHED",
        publishedAt: "2025-10-24T10:00:00Z",
        createdAt: "2025-10-24T09:30:00Z",
        updatedAt: "2025-10-24T10:00:00Z",
        penulis: "Admin Kalurahan",
        views: 150,
    },
    {
        id: 2,
        judul: "Program Pembangunan Infrastruktur Tahun 2025",
        slug: "program-pembangunan-infrastruktur-tahun-2025",
        ringkasan:
            "Pemerintah Kalurahan Pondokrejo mengalokasikan dana untuk pembangunan infrastruktur jalan dan drainase.",
        konten: "Pemerintah Kalurahan Pondokrejo dalam tahun anggaran 2025 mengalokasikan dana pembangunan sebesar Rp 2.5 Miliar...",
        gambar: "/images/berita/infrastruktur.jpg",
        kategori: "Pembangunan",
        status: "PUBLISHED",
        publishedAt: "2025-10-23T14:30:00Z",
        createdAt: "2025-10-23T13:00:00Z",
        updatedAt: "2025-10-23T14:30:00Z",
        penulis: "Bagian Pembangunan",
        views: 89,
    },
    {
        id: 3,
        judul: "Vaksinasi COVID-19 Tahap Lanjutan",
        slug: "vaksinasi-covid-19-tahap-lanjutan",
        ringkasan: "Puskesmas Pembantu Kalurahan Pondokrejo menyelenggarakan vaksinasi COVID-19 tahap lanjutan.",
        konten: "Puskesmas Pembantu Kalurahan Pondokrejo kembali menyelenggarakan vaksinasi COVID-19 tahap lanjutan untuk dosis ketiga...",
        gambar: "/images/berita/vaksinasi.jpg",
        kategori: "Kesehatan",
        status: "PUBLISHED",
        publishedAt: "2025-10-22T08:00:00Z",
        createdAt: "2025-10-21T16:00:00Z",
        updatedAt: "2025-10-22T08:00:00Z",
        penulis: "Bidang Kesehatan",
        views: 234,
    },
];

export const { GET } = createApiRouteHandler(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("halaman") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");

    let filteredBerita = mockBerita.filter((berita) => berita.status === "PUBLISHED");

    if (kategori) {
        filteredBerita = filteredBerita.filter((berita) => berita.kategori.toLowerCase() === kategori.toLowerCase());
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filteredBerita = filteredBerita.filter(
            (berita) =>
                berita.judul.toLowerCase().includes(searchLower) ||
                berita.ringkasan.toLowerCase().includes(searchLower) ||
                berita.konten.toLowerCase().includes(searchLower)
        );
    }

    const total = filteredBerita.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const berita = filteredBerita.slice(startIndex, endIndex);

    const meta = { total, halaman: page, perHalaman: limit, totalHalaman: totalPages };
    return NextResponse.json(createSuccessResponse(berita, "Daftar berita berhasil dimuat", meta));
});

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        const body = await request.json();

        // Basic validation
        const validationErrors: Record<string, string> = {};
        if (!body.judul) validationErrors.judul = "Judul wajib diisi";
        if (!body.konten) validationErrors.konten = "Konten wajib diisi";

        if (Object.keys(validationErrors).length > 0) {
            return NextResponse.json(createValidationErrorResponse(validationErrors), { status: 400 });
        }

        // Mock creating a new berita
        const newBerita = {
            id: mockBerita.length + 1,
            judul: body.judul,
            slug: body.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            ringkasan: body.ringkasan ?? "",
            konten: body.konten,
            gambar: body.gambar ?? null,
            kategori: body.kategori ?? "umum",
            status: body.status ?? "DRAFT",
            publishedAt: body.status === "PUBLISHED" ? new Date().toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            penulis: body.penulis ?? "Admin",
            views: 0,
        };

        return NextResponse.json(createSuccessResponse(newBerita, "Berita berhasil dibuat"), { status: 201 });
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat membuat berita"),
            { status: 500 }
        );
    }
}
