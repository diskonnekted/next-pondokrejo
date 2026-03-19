import { NextRequest, NextResponse } from "next/server";
import {
    opensidApi,
    externalApi,
    localApi,
    sdgsApi,
    createApiNextResponse,
    createCorsNextResponse,
    withErrorHandling,
    CORS_HEADERS,
} from "./api-service";

/**
 * Common query parameter extraction
 */
export function extractQueryParams(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    return {
        page: parseInt(searchParams.get("halaman") || searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || undefined,
        category: searchParams.get("kategori") || searchParams.get("category") || undefined,
        year: searchParams.get("year") || undefined,
        locationCode: searchParams.get("location_code") || undefined,
        allParams: Object.fromEntries(searchParams.entries()),
    };
}

/**
 * OpenSID statistik API helper
 */
export async function fetchOpenSIDStatistik(endpoint: string, config?: { cacheTags?: string[]; fallbackData?: unknown }) {
    const response = await opensidApi.get(endpoint, {
        cache: {
            revalidate: 3600,
            tags: config?.cacheTags,
        },
    });

    // Return fallback data if request fails
    if (!response.success && config?.fallbackData) {
        console.warn(`OpenSID API failed for ${endpoint}, using fallback data`);
        return {
            ...response,
            success: true,
            data: config.fallbackData,
        };
    }

    return response;
}

/**
 * OpenSID statistik by ID helper (for statistik/{id} endpoints)
 */
export async function fetchOpenSIDStatistikById(
    statistikId: string | number,
    dataType: string,
    config?: { fallbackData?: unknown }
) {
    const endpoint = `/internal_api/statistik/${statistikId}`;
    return fetchOpenSIDStatistik(endpoint, {
        cacheTags: [`opensid-data-${dataType}`],
        fallbackData: config?.fallbackData || [],
    });
}

/**
 * OpenSID arsip/berita API helper
 */
export async function fetchOpenSIDArsip() {
    return opensidApi.get("/internal_api/arsip", {
        cache: {
            revalidate: 60 * 60, // 1 hour
            tags: ["opensid-data-proxy"],
        },
    });
}

/**
 * SDGS API helper with location code
 */
export async function fetchSDGSData(locationCode = "3404140004") {
    return sdgsApi.get(`/sdgs/searching/score-sdgs?location_code=${locationCode}`, {
        cache: {
            revalidate: 60 * 60 * 24 * 30, // 30 days
            tags: ["sdgs-data"],
        },
    });
}

/**
 * SDGS detail API helper with goal and location code
 */
export async function fetchSDGSDetail(goalId: string, locationCode = "3404140004") {
    return sdgsApi.get(`/sdgs/searching/score-sdgs-detail?goal=${goalId}&location_code=${locationCode}`, {
        cache: {
            revalidate: 60 * 60 * 24 * 30, // 30 days
            tags: ["sdgs-data-detail"],
        },
    });
}

/**
 * IDM API helper with year parameter
 */
export async function fetchIDMData(year = "2024") {
    return opensidApi.get(`/internal_api/idm/${year}`, {
        cache: {
            revalidate: 60 * 60 * 24 * 30, // 30 days
            tags: ["idm-data"],
        },
    });
}

/**
 * Holidays API helper
 */
export async function fetchHolidays(limit = 100) {
    const response = await externalApi.get("https://cdn.silirdev.com/widgets/events.json", {
        cache: {
            revalidate: 60 * 60 * 24 * 30, // 30 days
            tags: ["opensid-data-hari-libur"],
        },
    });

    if (!response.success || !response.data) {
        return response;
    }

    // Filter and sort holidays
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingHolidays = (response.data as { tanggal: string }[])
        .filter((holiday: { tanggal: string }) => {
            const holidayDate = new Date(holiday.tanggal);
            holidayDate.setHours(0, 0, 0, 0);
            return holidayDate >= today;
        })
        .sort((a: { tanggal: string }, b: { tanggal: string }) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
        .slice(0, limit);

    return {
        ...response,
        data: upcomingHolidays,
    };
}

/**
 * Local API helper for internal calls
 */
export async function fetchLocalAPI(endpoint: string, config?: { cacheTags?: string[] }) {
    return localApi.get(endpoint, {
        cache: {
            revalidate: 3600,
            tags: config?.cacheTags,
        },
    });
}

/**
 * OpenSID APBDES (keuangan) API helper
 */
export async function fetchOpenSIDKeuangan(tahun: string) {
    return opensidApi.get(`/internal_api/apbdes?tahun=${tahun}`, {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-keuangan"],
        },
    });
}

/**
 * OpenSID government API helper
 */
export async function fetchOpenSIDPemerintah() {
    return opensidApi.get("/internal_api/pemerintah", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-pemerintah"],
        },
    });
}

/**
 * OpenSID pembangunan API helper
 */
export async function fetchOpenSIDPembangunan() {
    return opensidApi.get("/internal_api/pembangunan", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-pembangunan"],
        },
    });
}

/**
 * OpenSID peta API helper
 */
export async function fetchOpenSIDPeta() {
    return opensidApi.get("/internal_api/peta", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-peta"],
        },
    });
}

/**
 * OpenSID PPID API helper
 */
export async function fetchOpenSIDPPID() {
    return opensidApi.get("/internal_api/informasi-publik", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-ppid"],
        },
    });
}

/**
 * OpenSID wilayah API helper
 */
export async function fetchOpenSIDWilayah() {
    return opensidApi.get("/internal_api/wilayah/administratif", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-wilayah"],
        },
    });
}

/**
 * OpenSID pengaduan API helper
 */
export async function fetchOpenSIDPengaduan() {
    return opensidApi.get("/internal_api/pengaduan", {
        cache: {
            revalidate: 300, // 5 minutes for complaints
            tags: ["opensid-data-pengaduan"],
        },
    });
}

/**
 * Standard API route handler with CORS support
 */
export function createApiRouteHandler(
    handler: (request: NextRequest, context?: unknown) => Promise<NextResponse>,
    options: { enableCORS?: boolean } = {}
) {
    const { enableCORS = true } = options;

    return {
        async GET(request: NextRequest, context: unknown) {
            return withErrorHandling(async () => {
                const response = await handler(request, context);
                if (enableCORS) {
                    try {
                        response.headers.set("Access-Control-Allow-Origin", CORS_HEADERS["Access-Control-Allow-Origin"]);
                        response.headers.set("Access-Control-Allow-Methods", CORS_HEADERS["Access-Control-Allow-Methods"]);
                        response.headers.set("Access-Control-Allow-Headers", CORS_HEADERS["Access-Control-Allow-Headers"]);
                    } catch {}
                }
                return response;
            });
        },

        async POST(request: NextRequest, context: unknown) {
            return withErrorHandling(async () => {
                const response = await handler(request, context);
                if (enableCORS) {
                    try {
                        response.headers.set("Access-Control-Allow-Origin", CORS_HEADERS["Access-Control-Allow-Origin"]);
                        response.headers.set("Access-Control-Allow-Methods", CORS_HEADERS["Access-Control-Allow-Methods"]);
                        response.headers.set("Access-Control-Allow-Headers", CORS_HEADERS["Access-Control-Allow-Headers"]);
                    } catch {}
                }
                return response;
            });
        },

        async PUT(request: NextRequest, context: unknown) {
            return withErrorHandling(async () => {
                const response = await handler(request, context);
                if (enableCORS) {
                    try {
                        response.headers.set("Access-Control-Allow-Origin", CORS_HEADERS["Access-Control-Allow-Origin"]);
                        response.headers.set("Access-Control-Allow-Methods", CORS_HEADERS["Access-Control-Allow-Methods"]);
                        response.headers.set("Access-Control-Allow-Headers", CORS_HEADERS["Access-Control-Allow-Headers"]);
                    } catch {}
                }
                return response;
            });
        },

        async DELETE(request: NextRequest, context: unknown) {
            return withErrorHandling(async () => {
                const response = await handler(request, context);
                if (enableCORS) {
                    try {
                        response.headers.set("Access-Control-Allow-Origin", CORS_HEADERS["Access-Control-Allow-Origin"]);
                        response.headers.set("Access-Control-Allow-Methods", CORS_HEADERS["Access-Control-Allow-Methods"]);
                        response.headers.set("Access-Control-Allow-Headers", CORS_HEADERS["Access-Control-Allow-Headers"]);
                    } catch {}
                }
                return response;
            });
        },

        ...(enableCORS && {
            async OPTIONS() {
                return createCorsNextResponse();
            },
        }),
    };
}

/**
 * Mock data helper for build-time failures
 */
export function createMockDataFallback<T>(mockData: T, errorMessage = "Service unavailable") {
    return {
        success: true,
        data: mockData,
        status: "partial",
        message: errorMessage,
        timestamp: new Date().toISOString(),
    } as const;
}

/**
 * Pagination helper for array data
 */
export function paginateArray<T>(
    data: T[],
    page: number,
    limit: number
): { items: T[]; total: number; totalPages: number; hasMore: boolean } {
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = data.slice(startIndex, endIndex);
    const hasMore = page < totalPages;

    return {
        items,
        total,
        totalPages,
        hasMore,
    };
}

/**
 * Search filter helper for array data
 */
export function filterBySearch<T>(data: T[], searchFields: (keyof T)[], searchTerm: string): T[] {
    if (!searchTerm) return data;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((item) =>
        searchFields.some((field) => {
            const value = item[field];
            return value && typeof value === "string" && value.toLowerCase().includes(lowerSearchTerm);
        })
    );
}
