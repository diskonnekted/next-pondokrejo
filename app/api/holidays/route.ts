import { NextRequest, NextResponse } from "next/server";
import { fetchHolidays, createApiRouteHandler } from "@/lib/api-helpers";

export interface Holiday {
    nama_perayaan: string;
    tanggal: string;
    jenis: string;
    keterangan: string;
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const response = await fetchHolidays(limit);
    return NextResponse.json({ success: response.success, data: response.data || [], message: response.message });
});
