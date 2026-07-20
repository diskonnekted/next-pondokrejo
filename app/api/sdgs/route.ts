import { NextRequest, NextResponse } from "next/server";
import { fetchSDGSData, createApiRouteHandler } from "@/lib/api-helpers";

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const locationCode = searchParams.get("location_code") || "3404140004";

    if (!/^\d+$/.test(locationCode)) {
        return NextResponse.json({ error: "Parameter location_code tidak valid. Gunakan digit saja." }, { status: 400 });
    }

    const response = await fetchSDGSData(locationCode);
    return NextResponse.json(response.success ? response.data : response);
});
