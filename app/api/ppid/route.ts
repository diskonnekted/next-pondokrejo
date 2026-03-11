import { NextRequest, NextResponse } from "next/server";
import { fetchOpenSIDPPID, extractQueryParams, createApiRouteHandler } from "@/lib/api-helpers";

export const { GET } = createApiRouteHandler(async (request: NextRequest) => {
    extractQueryParams(request);
    const response = await fetchOpenSIDPPID();
    if (!response.success) {
        return NextResponse.json(
            { error: "Failed to fetch PPID data", message: response.message, data: [] },
            { status: 500 }
        );
    }
    return NextResponse.json(response.data);
});
