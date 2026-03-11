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
    if (!pathname.startsWith("/api")) return NextResponse.next();

    const ip = getIp(req);
    const key = `${ip}:api`;

    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return NextResponse.next();
    }

    if (entry.count >= max) {
        return new NextResponse(JSON.stringify({ success: false, error: "Too many requests" }), {
            status: 429,
            headers: { "Content-Type": "application/json" },
        });
    }

    entry.count += 1;
    store.set(key, entry);
    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};
