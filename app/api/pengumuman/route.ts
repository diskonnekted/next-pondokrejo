import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/api-response";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@/lib/api-response";
import { createApiRouteHandler } from "@/lib/api-helpers";

// Mock data for pengumuman
const mockPengumuman: Array<{
    id: number;
    judul: string;
    konten: string;
    prioritas: string;
    kategori: string;
    status: string;
    publishedAt: string | null;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    penulis: string;
    lampiran: string[];
    views: number;
}> = [
    {
        id: 1,
        judul: "Libur Nasional dan Cuti Bersama Tahun 2025",
        konten: `Berdasarkan Surat Keputusan Bersama (SKB) Menteri Agama, Menteri Ketenagakerjaan, dan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 812 Tahun 2024, Nomor 1 Tahun 2024, dan Nomor 3 Tahun 2024 tentang Hari Libur Nasional dan Cuti Bersama Tahun 2025, dengan hormat mengundang seluruh masyarakat Kalurahan Pondokrejo untuk memperhatikan jadwal libur nasional dan cuti bersama.

Daftar libur nasional yang akan datang:
- 25 Desember 2025: Hari Raya Natal
- 1 Januari 2026: Tahun Baru 2026

Masyarakat diharapkan memperhatikan jadwal layanan kantor kalurahan yang disesuaikan dengan hari libur nasional.`,
        prioritas: "TINGGI",
        kategori: "Pemerintahan",
        status: "PUBLISHED",
        publishedAt: "2025-10-24T08:00:00Z",
        expiresAt: "2025-12-31T23:59:59Z",
        createdAt: "2025-10-23T16:00:00Z",
        updatedAt: "2025-10-24T08:00:00Z",
        penulis: "Sekretariat Kalurahan",
        lampiran: ["/pdf/kalender-2025.pdf"],
        views: 45,
    },
    {
        id: 2,
        judul: "Pembayaran PBB dan Retribusi Sampah Triwulan IV",
        konten: `Bersama ini kami sampaikan kepada seluruh wajib Pajak Bumi dan Bangunan (PBB) dan pengguna layanan sampah di Kalurahan Pondokrejo bahwa pembayaran PBB dan retribusi sampah untuk Triwulan IV (Oktober-Desember 2025) sudah dapat dilaksanakan.

Pembayaran dapat dilakukan melalui:
1. Kantor Kas Kalurahan Pondokrejo (Senin-Jumat, 08:00-14:00 WIB)
2. Mobile Payment (QRIS yang tersedia di kantor kalurahan)
3. Transfer Bank BPD DIY (No. Rekening: 1234567890)

Batas waktu pembayaran: 20 Desember 2025

Mohon kerjasama dari seluruh warga untuk menyelesaikan kewajiban pembayaran tepat waktu. Terima kasih atas perhatian dan kerjasamanya.`,
        prioritas: "NORMAL",
        kategori: "Keuangan",
        status: "PUBLISHED",
        publishedAt: "2025-10-23T10:00:00Z",
        expiresAt: "2025-12-20T23:59:59Z",
        createdAt: "2025-10-22T15:30:00Z",
        updatedAt: "2025-10-23T10:00:00Z",
        penulis: "Bagian Keuangan",
        lampiran: [],
        views: 28,
    },
    {
        id: 3,
        judul: "Jadwal Vaksinasi COVID-19 Dosis Lanjutan",
        konten: `Dalam rangka meningkatkan imunitas masyarakat Kalurahan Pondokrejo, akan diselenggarakan vaksinasi COVID-19 dosis lanjutan (booster) pada:

📅 Jadwal Pelaksanaan:
- Hari: Sabtu, 26 Oktober 2025
- Waktu: 08:00 - 12:00 WIB
- Tempat: Aula Kantor Kalurahan Pondokrejo

📋 Persyaratan:
- Warga Kalurahan Pondokrejo (dibuktikan dengan KTP/KK)
- Sudah mendapatkan vaksin dosis kedua (minimal 3 bulan yang lalu)
- Membawa kartu vaksin atau bukti vaksinasi dosis kedua
- Sehat dan tidak demam
- Membawa alat tulis

📞 Informasi lebih lanjut:
- Kontak: 08123456789 (Bidan Kalurahan)
- WhatsApp: 08123456789

Pelayanan gratis dan terbuka untuk seluruh warga yang memenuhi persyaratan. Mari kita bersama-sama menjaga kesehatan diri dan keluarga.`,
        prioritas: "NORMAL",
        kategori: "Kesehatan",
        status: "PUBLISHED",
        publishedAt: "2025-10-22T14:00:00Z",
        expiresAt: "2025-10-26T12:00:00Z",
        createdAt: "2025-10-21T11:00:00Z",
        updatedAt: "2025-10-22T14:00:00Z",
        penulis: "Bidang Kesehatan",
        lampiran: ["/pdf/formulir-vaksin.pdf"],
        views: 67,
    },
    {
        id: 4,
        judul: "⚠️ Darurat: Gangguan Air Bersih",
        konten: `Mohon maaf kepada seluruh warga Kalurahan Pondokrejo, saat ini terjadi gangguan pada sistem distribusi air bersih di wilayah RT 01, RT 02, dan RT 03.

🚨 Lokasi Terdampak:
- RT 01/RW 01 Dusun Pondokrejo
- RT 02/RW 01 Dusun Pondokrejo
- RT 03/RW 01 Dusun Pondokrejo

⏱️ Perkiraan Waktu Perbaikan:
- Mulai: 24 Oktober 2025, 14:00 WIB
- Selesai: 24 Oktober 2025, 20:00 WIB

🔧 Penyebab: Perbaikan pipa distribusi utama di Jl. Raya Kalurahan Pondokrejo

📞 Kontak Darurat:
- PDAM Cabang Sleman: (0274) 123456
- Kantor Kalurahan: (0274) 654321

Mohon kesabaran dan pengertian dari seluruh warga. Tim teknisi sedang bekerja keras untuk menyelesaikan masalah ini sesegera mungkin.`,
        prioritas: "PENTING",
        kategori: "Layanan Umum",
        status: "PUBLISHED",
        publishedAt: "2025-10-24T14:00:00Z",
        expiresAt: "2025-10-24T20:00:00Z",
        createdAt: "2025-10-24T14:00:00Z",
        updatedAt: "2025-10-24T14:00:00Z",
        penulis: "Admin Kalurahan",
        lampiran: [],
        views: 156,
    },
];

export const { GET } = createApiRouteHandler(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("halaman") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const prioritas = searchParams.get("prioritas");
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");
    const aktif = searchParams.get("aktif");

    let filteredPengumuman = mockPengumuman.filter((pengumuman) => {
        if (pengumuman.status !== "PUBLISHED") return false;
        if (aktif === "true") {
            const now = new Date();
            const expiresAt = new Date(pengumuman.expiresAt);
            if (now > expiresAt) return false;
        }
        return true;
    });

    if (prioritas) {
        filteredPengumuman = filteredPengumuman.filter(
            (pengumuman) => pengumuman.prioritas.toLowerCase() === prioritas.toLowerCase()
        );
    }
    if (kategori) {
        filteredPengumuman = filteredPengumuman.filter((pengumuman) =>
            pengumuman.kategori.toLowerCase().includes(kategori.toLowerCase())
        );
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filteredPengumuman = filteredPengumuman.filter(
            (pengumuman) =>
                pengumuman.judul.toLowerCase().includes(searchLower) ||
                pengumuman.konten.toLowerCase().includes(searchLower) ||
                pengumuman.kategori.toLowerCase().includes(searchLower)
        );
    }

    filteredPengumuman.sort((a, b) => {
        const priorityOrder = { PENTING: 4, TINGGI: 3, NORMAL: 2, RENDAH: 1 };
        const priorityDiff =
            (priorityOrder[b.prioritas as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.prioritas as keyof typeof priorityOrder] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
    });

    const total = filteredPengumuman.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pengumuman = filteredPengumuman.slice(startIndex, endIndex);

    const pengumumanWithStatus = pengumuman.map((item) => ({
        ...item,
        isExpired: new Date() > new Date(item.expiresAt),
        daysUntilExpiry: Math.ceil((new Date(item.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    }));

    const meta = { total, halaman: page, perHalaman: limit, totalHalaman: totalPages };
    return NextResponse.json(createSuccessResponse(pengumumanWithStatus, "Daftar pengumuman berhasil dimuat", meta));
});

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        const body = await request.json();

        // Required fields validation
        const validationErrors: Record<string, string> = {};
        if (!body.judul) validationErrors.judul = "Judul wajib diisi";
        if (!body.konten) validationErrors.konten = "Konten wajib diisi";

        if (Object.keys(validationErrors).length > 0) {
            return NextResponse.json(createValidationErrorResponse(validationErrors), { status: 400 });
        }

        // Set default expiry date if not provided (30 days from now)
        const defaultExpiry = new Date();
        defaultExpiry.setDate(defaultExpiry.getDate() + 30);

        // Mock creating a new pengumuman
        const newPengumuman = {
            id: mockPengumuman.length + 1,
            judul: body.judul.trim(),
            konten: body.konten.trim(),
            prioritas: body.prioritas ?? "NORMAL",
            kategori: body.kategori ?? "Umum",
            status: body.status ?? "DRAFT",
            publishedAt: body.status === "PUBLISHED" ? new Date().toISOString() : null,
            expiresAt: body.expiresAt ?? defaultExpiry.toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            penulis: body.penulis ?? "Admin Kalurahan",
            lampiran: body.lampiran ?? [],
            views: 0,
        };

        mockPengumuman.push(newPengumuman);

        return NextResponse.json(createSuccessResponse(newPengumuman, "Pengumuman berhasil dibuat"), { status: 201 });
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat membuat pengumuman"),
            { status: 500 }
        );
    }
}
