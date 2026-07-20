import { NextResponse } from "next/server";

// API configuration interfaces
export interface ApiConfig {
    baseUrl?: string;
    timeout?: number;
    headers?: Record<string, string>;
    cache?: {
        revalidate?: number;
        tags?: string[];
    };
    retries?: number;
    retryDelay?: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp?: string;
    status?: number;
}

// Default configuration
const DEFAULT_CONFIG: Required<Omit<ApiConfig, "baseUrl" | "cache">> = {
    timeout: 30000,
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json",
        "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    },
    retries: 2,
    retryDelay: 1000,
};

// Common CORS headers
export const CORS_HEADERS = {
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || "https://devoneclickpondokrejo.slemankab.go.id",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validates and normalizes URL
 */
function normalizeUrl(url: string, baseUrl?: string): string {
    if (!url) throw new Error("URL is required");

    // If URL is already absolute, return as-is
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // If baseUrl is provided, combine with relative URL
    if (baseUrl) {
        const trimmedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const trimmedUrl = url.startsWith("/") ? url : `/${url}`;
        return `${trimmedBaseUrl}${trimmedUrl}`;
    }

    throw new Error("Invalid URL: must be absolute or provide baseUrl");
}

function stripLinksRecursively(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(stripLinksRecursively);
    }
    if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            if (key === 'links') {
                continue;
            }
            result[key] = stripLinksRecursively(obj[key]);
        }
        return result;
    }
    return obj;
}

/**
 * Main API Service class for external API requests
 */
export class ApiService {
    private config: ApiConfig;

    constructor(config: ApiConfig = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Makes an HTTP request with retry logic and standardized error handling
     */
    async request<T = unknown>(
        endpoint: string,
        options: RequestInit & { config?: Partial<ApiConfig> } = {}
    ): Promise<ApiResponse<T>> {
        const { config: requestConfig = {}, ...requestInitOptions } = options;

        // Merge configurations
        const mergedConfig = { ...this.config, ...requestConfig };
        const {
            baseUrl,
            timeout = DEFAULT_CONFIG.timeout,
            headers = {},
            cache,
            retries = DEFAULT_CONFIG.retries,
            retryDelay = DEFAULT_CONFIG.retryDelay,
        } = mergedConfig;

        // Normalize URL
        const url = normalizeUrl(endpoint, baseUrl);

        // Merge headers
        const mergedHeaders = {
            ...DEFAULT_CONFIG.headers,
            ...headers,
        };

        let lastError: Error | null = null;

        // Retry logic
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const fetchOptions: RequestInit = {
                    ...requestInitOptions,
                    headers: mergedHeaders,
                    signal: controller.signal,
                };

                // Add Next.js caching options if provided
                if (cache) {
                    (fetchOptions as { next?: { revalidate?: number; tags?: string[] } }).next = {
                        revalidate: cache.revalidate,
                        tags: cache.tags,
                    };
                }

                const response = await fetch(url, fetchOptions);
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const rawData = await response.json();
                const data = stripLinksRecursively(rawData);

                return {
                    success: true,
                    data,
                    timestamp: new Date().toISOString(),
                };
            } catch (error) {
                lastError = error instanceof Error ? error : new Error("Unknown error");

                console.error(`API Request failed (attempt ${attempt + 1}/${retries + 1}):`, {
                    url,
                    error: lastError.message,
                });

                // Don't retry on certain error types
                if (lastError.name === "AbortError" && attempt < retries) {
                    await sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
                    continue;
                }

                // Break on non-timeout errors or if we've exhausted retries
                if (lastError.name !== "AbortError" || attempt === retries) {
                    break;
                }
            }
        }

        // Return error response if all attempts failed
        return {
            success: false,
            error: "Failed to fetch data",
            message: lastError?.message || "Unknown error",
            timestamp: new Date().toISOString(),
            status: 500,
        };
    }

    /**
     * GET request helper
     */
    async get<T = unknown>(endpoint: string, config?: Partial<ApiConfig>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "GET", config });
    }

    /**
     * POST request helper
     */
    async post<T = unknown>(endpoint: string, data?: unknown, config?: Partial<ApiConfig>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: data ? JSON.stringify(data) : undefined,
            config,
        });
    }

    /**
     * PUT request helper
     */
    async put<T = unknown>(endpoint: string, data?: unknown, config?: Partial<ApiConfig>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: data ? JSON.stringify(data) : undefined,
            config,
        });
    }

    /**
     * DELETE request helper
     */
    async delete<T = unknown>(endpoint: string, config?: Partial<ApiConfig>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "DELETE", config });
    }
}

// Pre-configured API services for common use cases

/**
 * OpenSID API service
 */
export const opensidApi = new ApiService({
    baseUrl: process.env.OPENSID_API_URL || "https://pondokrejo.sleman-desa.id",
    timeout: 30000,
    cache: {
        revalidate: 3600, // 1 hour
    },
});

/**
 * SDGS API service
 */
export const sdgsApi = new ApiService({
    baseUrl: process.env.SDGS_API_URL || "https://sid.kemendesa.go.id",
    timeout: 10000,
    cache: {
        revalidate: 60 * 60 * 24 * 30, // 30 days
    },
});

/**
 * External CDN API service (for holidays, etc.)
 */
export const externalApi = new ApiService({
    timeout: 30000,
    cache: {
        revalidate: 60 * 60 * 24 * 30, // 30 days
    },
});

/**
 * Local API service (for internal API calls)
 */
const LOCAL_BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    (process.env.NODE_ENV === "development" ? "http://localhost:5091" : "https://devoneclickpondokrejo.slemankab.go.id");

export const localApi = new ApiService({
    baseUrl: LOCAL_BASE_URL,
    timeout: 10000,
    cache: {
        revalidate: 3600, // 1 hour
    },
});

/**
 * Helper function to create NextResponse with CORS headers
 */
export function createApiNextResponse<T>(
    apiResponse: ApiResponse<T>,
    options: { addCorsHeaders?: boolean } = {}
): NextResponse {
    const { addCorsHeaders = true } = options;

    const headers = addCorsHeaders ? CORS_HEADERS : {};
    const status = apiResponse.status || (apiResponse.success ? 200 : 500);

    return NextResponse.json(apiResponse, {
        status,
        headers,
    });
}

/**
 * Helper function to handle OPTIONS requests for CORS
 */
export function createCorsNextResponse(): NextResponse {
    return new NextResponse(null, {
        status: 200,
        headers: CORS_HEADERS,
    });
}

/**
 * Error boundary wrapper for API routes
 */
export function withErrorHandling(
    handler: () => Promise<NextResponse>,
    errorMessage = "Internal server error"
): Promise<NextResponse> {
    return handler().catch((error) => {
        console.error("API Route Error:", error);
        return createApiNextResponse({
            success: false,
            error: errorMessage,
            message: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
            status: 500,
        });
    });
}
