import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const store: Map<string, { count: number; resetAt: number }> = new Map();

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
const max = parseInt(process.env.RATE_LIMIT_MAX || "60", 10);

function getIp(req: NextRequest): string {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) {
        const ip = xff.split(",")[0].trim();
        if (ip) return ip;
    }
    const xri = req.headers.get("x-real-ip");
    if (xri) return xri;
    return "0.0.0.0";
}

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Explicitly block /api/pengaduan to prevent any data exposure (TNG-01)
    if (pathname === "/api/pengaduan" || pathname.startsWith("/api/pengaduan/")) {
        return new NextResponse(JSON.stringify({ success: false, error: "Endpoint /api/pengaduan has been permanently disabled" }), {
            status: 410,
            headers: { 
                "Content-Type": "application/json",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY"
            },
        });
    }

    let res: NextResponse;

    if (pathname.startsWith("/api")) {
        const ip = getIp(req);
        const key = `${ip}:api`;

        const now = Date.now();
        const entry = store.get(key);

        if (!entry || now > entry.resetAt) {
            store.set(key, { count: 1, resetAt: now + windowMs });
            res = NextResponse.next();
            res.headers.set("X-RateLimit-Limit", max.toString());
            res.headers.set("X-RateLimit-Remaining", (max - 1).toString());
            res.headers.set("X-RateLimit-Reset", Math.floor((now + windowMs) / 1000).toString());
        } else if (entry.count >= max) {
            res = new NextResponse(JSON.stringify({ success: false, error: "Too many requests" }), {
                status: 429,
                headers: { 
                    "Content-Type": "application/json",
                    "X-RateLimit-Limit": max.toString(),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": Math.floor(entry.resetAt / 1000).toString()
                },
            });
        } else {
            entry.count += 1;
            store.set(key, entry);
            res = NextResponse.next();
            res.headers.set("X-RateLimit-Limit", max.toString());
            res.headers.set("X-RateLimit-Remaining", (max - entry.count).toString());
            res.headers.set("X-RateLimit-Reset", Math.floor(entry.resetAt / 1000).toString());
        }
    } else {
        res = NextResponse.next();
    }

    // Apply security headers to ALL responses (SED-02)
    res.headers.set(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            process.env.NODE_ENV === "development"
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.openstreetmap.org"
                : "script-src 'self' 'unsafe-inline' cdn.openstreetmap.org",
            "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
            "font-src 'self' fonts.gstatic.com cdn.jsdelivr.net",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https: wss:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join("; ")
    );
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        "/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)",
    ],
};

