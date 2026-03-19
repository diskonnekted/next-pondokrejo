import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createApiRouteHandler } from "@/lib/api-helpers";

type AnalyticsData = {
    total_households: number;
    total_residents: number;
    income_distribution: Record<string, number>;
    job_profile_poor: Record<string, number>;
    education_poor: Record<string, number>;
    income_comparison: Record<string, number>;
    rtlh_count: number;
    no_latrine_count: number;
    no_clean_water_count: number;
    elderly_single_count: number;
    poor_with_toddler_count: number;
};

const SOURCE_URL = "https://peta.pondokrejo.id/analytics";

function unescapeJsStringLiteral(input: string): string {
    let out = "";
    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch !== "\\") {
            out += ch;
            continue;
        }

        const next = input[i + 1] ?? "";
        if (next === "u") {
            const hex = input.slice(i + 2, i + 6);
            if (/^[0-9a-fA-F]{4}$/.test(hex)) {
                out += String.fromCharCode(parseInt(hex, 16));
                i += 5;
                continue;
            }
        }

        if (next === "n") {
            out += "\n";
            i += 1;
            continue;
        }
        if (next === "r") {
            out += "\r";
            i += 1;
            continue;
        }
        if (next === "t") {
            out += "\t";
            i += 1;
            continue;
        }
        if (next === "\\") {
            out += "\\";
            i += 1;
            continue;
        }
        if (next === "/") {
            out += "/";
            i += 1;
            continue;
        }
        if (next === "'") {
            out += "'";
            i += 1;
            continue;
        }
        if (next === "\"") {
            out += "\"";
            i += 1;
            continue;
        }

        if (next) {
            out += next;
            i += 1;
            continue;
        }
        out += ch;
    }
    return out;
}

function parseAnalyticsFromHtml(html: string): AnalyticsData | null {
    const m = html.match(/const\s+analyticsData\s*=\s*JSON\.parse\('([\s\S]*?)'\)\s*;/i);
    if (!m?.[1]) return null;

    const decoded = unescapeJsStringLiteral(m[1]);
    try {
        const json = JSON.parse(decoded) as Partial<AnalyticsData>;
        if (!json || typeof json !== "object") return null;
        if (typeof json.total_households !== "number") return null;
        return json as AnalyticsData;
    } catch {
        return null;
    }
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    void request;
    const res = await fetch(SOURCE_URL, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        next: { revalidate: 60 * 30, tags: ["analitik", "analitik-peta"] },
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
        return NextResponse.json(
            { success: false, error: `Gagal mengambil data analitik: HTTP ${res.status}` },
            { status: res.status }
        );
    }

    const html = await res.text();
    const data = parseAnalyticsFromHtml(html);
    if (!data) {
        return NextResponse.json(
            { success: false, error: "Gagal memproses data analitik dari sumber" },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        data,
        sourceUrl: SOURCE_URL,
        fetchedAt: new Date().toISOString(),
    });
});
