import { NextRequest, NextResponse } from "next/server";
import { fetchOpenSIDPembangunan, extractQueryParams, createApiRouteHandler } from "@/lib/api-helpers";

export const { GET } = createApiRouteHandler(async (request: NextRequest) => {
    extractQueryParams(request);
    const response = await fetchOpenSIDPembangunan();
    if (!response.success) {
        return NextResponse.json(
            { error: "Failed to fetch pembangunan data", message: response.message, data: [] },
            { status: 500 }
        );
    }
    return NextResponse.json(response.data);
});
