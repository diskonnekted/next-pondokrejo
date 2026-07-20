import { NextResponse } from "next/server";
import { fetchOpenSIDPeta, createApiRouteHandler } from "@/lib/api-helpers";

function sanitizePetaData(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(sanitizePetaData);
    }
    if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            // Strip sensitive fields
            if (['nip_kepala_camat', 'nip_kepala_desa', 'nomor_operator', 'email_desa', 'id_kepala'].includes(key)) {
                continue;
            }
            result[key] = sanitizePetaData(obj[key]);
        }
        return result;
    }
    return obj;
}

export const { GET } = createApiRouteHandler(async () => {
    const response = await fetchOpenSIDPeta();
    if (!response.success) {
        return NextResponse.json(
            { error: "Failed to fetch peta data", message: response.message, data: [] },
            { status: 500 }
        );
    }
    
    const sanitizedData = sanitizePetaData(response.data);
    return NextResponse.json(sanitizedData);
});
