import { NextResponse } from "next/server";
import { fetchOpenSIDKeuangan, createApiRouteHandler } from "@/lib/api-helpers";

export const { GET, OPTIONS } = createApiRouteHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun") || "2025";
    const mockFallbackData = [
        { type: "abpdes", id: "1", attributes: { tahun, pendapatan: [], belanja: [], pelaksanaan: [], laporan: `APBDes ${tahun} (Mock Data)` } },
    ];
    const response = await fetchOpenSIDKeuangan(tahun);
    if (!response.success) {
        console.warn("Keuangan API request failed, using fallback data");
        return NextResponse.json({ status: "partial", message: "Data may be stale or unavailable", data: mockFallbackData });
    }
    return NextResponse.json(response.data);
});
