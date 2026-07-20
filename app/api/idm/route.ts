import { NextRequest, NextResponse } from "next/server";
import { fetchIDMData, createApiRouteHandler } from "@/lib/api-helpers";

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") || "2024";

    if (!/^\d{4}$/.test(year)) {
        return NextResponse.json({ error: "Parameter year tidak valid. Gunakan format: YYYY" }, { status: 400 });
    }

    const response = await fetchIDMData(year);
    return NextResponse.json(response.success ? response.data : response);
});
