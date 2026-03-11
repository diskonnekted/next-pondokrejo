import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// import { fetchOpenSIDArsip } from "@/lib/api-helpers"; // Commented as unused
import { env } from "process";
import { createApiRouteHandler } from "@/lib/api-helpers";

// Type definitions for OpenSID article structure
interface OpenSIDArticle {
    id: string;
    attributes: Record<string, unknown> & {
        url_slug: string;
        isi?: string;
        gambar?: string;
    };
}

// Helper function to force HTTPS on all image URLs in HTML content
function transformToHTTPS(html: string): string {
    if (!html) return html;
    // Replace all http:// with https:// in img src, background-image, etc.
    // Using case-insensitive matching and global flag
    return html.replace(/http:\/\//gi, "https://");
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const kategori = searchParams.get("kategori");

        // Fetch news data from external API
        const response = await fetch(
            `${env.OPENSID_API_URL ?? "http://pondokrejo.sleman-desa.id"}/internal_api/arsip`,
            {
                method: "GET",
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    Accept: "application/json",
                    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
                },
                next: {
                    // Cache the result for 1 hour
                    revalidate: 60 * 60,
                    // Optionally, assign a tag for on-demand revalidation
                    tags: ["opensid-data-proxy"],
                },
                // Add timeout to prevent hanging
                signal: AbortSignal.timeout(30000),
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch from OpenSID API: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data?.data) {
            return NextResponse.json({ data: [], meta: { pagination: { total: 0 } } });
        }

        let articles = data.data;

        // Sort by ID descending (latest posts first - id=25 is newer than id=1)
        articles = articles.sort((a: OpenSIDArticle, b: OpenSIDArticle) => parseInt(b.id) - parseInt(a.id));

        // Filter by category if specified
        if (kategori) {
            articles = articles.filter((article: OpenSIDArticle) => {
                return (article.attributes.category as { id: string })?.id === kategori;
            });
        }

        // Add slug field and transform data
        articles = articles.map((article: OpenSIDArticle) => {
            // Extract slug from url_slug
            const urlSlug = (article.attributes.url_slug as string) || "";
            article.attributes.slug = urlSlug.split("/").pop() || urlSlug;

            // Transform the content HTML
            if (article.attributes.isi) {
                article.attributes.isi = transformToHTTPS(article.attributes.isi as string);
            }
            // Transform image URLs to OpenSID pattern
            if (article.attributes.gambar) {
                let imageUrl = article.attributes.gambar as string;
                // If it's just a filename, add OpenSID path
                if (!imageUrl.includes("/")) {
                    imageUrl = `https://pondokrejo.sleman-desa.id/desa/upload/artikel/sedang_${imageUrl}`;
                } else {
                    // If it's a relative path, add base URL
                    if (imageUrl.startsWith("/")) {
                        imageUrl = `https://pondokrejo.sleman-desa.id${imageUrl}`;
                    }
                    // Force HTTPS
                    imageUrl = imageUrl.replace(/^http:\/\//, "https://");
                }
                article.attributes.gambar = imageUrl;
            }
            return article;
        });

        // Return raw data for client-side transformation
        return NextResponse.json({
            data: articles,
            meta: { total: articles.length },
        });
    } catch (error) {
        return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
    }
});
