import { NextRequest, NextResponse } from "next/server";
import { fetchSDGSDetail, createApiRouteHandler } from "@/lib/api-helpers";

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest, context?: unknown) => {
    const ctxGoal = (context as { params?: { goal?: string } } | undefined)?.params?.goal;
    const pathGoal = request.nextUrl.pathname.split("/").filter(Boolean).slice(-2, -1)[0]; // falls back if needed
    const goalId = ctxGoal || pathGoal || "";

    const { searchParams } = new URL(request.url);
    const locationCode = searchParams.get("location_code") || "3404140004";

    // Validate goal ID
    if (!goalId || isNaN(parseInt(goalId)) || parseInt(goalId) < 1 || parseInt(goalId) > 18) {
        return NextResponse.json({ error: "Invalid goal ID. Must be between 1 and 18." }, { status: 400 });
    }

    // Validate location code
    if (!/^\d+$/.test(locationCode)) {
        return NextResponse.json({ error: "Parameter location_code tidak valid. Gunakan digit saja." }, { status: 400 });
    }

    let response;
    try {
        response = await fetchSDGSDetail(goalId, locationCode);
    } catch (err) {
        console.error('[sdgs] error:', err);
        return NextResponse.json({ error: 'Terjadi kesalahan internal. Coba lagi nanti.' }, { status: 500 });
    }

    if (!response.success) {
        return NextResponse.json(
            {
                error: "Failed to fetch SDGS detail data",
                message: response.message,
            },
            { status: response.status || 500 }
        );
    }

    return NextResponse.json(response.data);
});

