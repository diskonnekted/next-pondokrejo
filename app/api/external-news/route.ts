import { NextRequest, NextResponse } from "next/server";
import { fetchOpenSIDArsip, createApiRouteHandler } from "@/lib/api-helpers";

// Type definitions for OpenSID article structure
interface OpenSIDAuthor {
    nama: string;
}

interface OpenSIDCategory {
    id: string;
    kategori: string;
    slug: string;
}

interface OpenSIDAttributes {
    judul: string;
    slug?: string;
    url_slug?: string;
    isi: string;
    gambar: string | null;
    author?: OpenSIDAuthor;
    category?: OpenSIDCategory;
    tgl_upload: string;
    hit?: number;
}

interface OpenSIDArticle {
    id: string;
    attributes: OpenSIDAttributes;
}

// Calculate reading time based on content
function calculateReadingTime(content: string): number {
    // Strip HTML tags
    const plainText = content.replace(/<[^>]*>/g, "");

    // Count words (Indonesian and English)
    const words = plainText
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
    const wordCount = words.length;

    // Average reading speed: 200-250 words per minute
    const wordsPerMinute = 220;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    // Minimum 1 minute
    return Math.max(1, readingTime);
}

// Decode HTML entities like &nbsp;, &amp;, &hellip;, etc.
function decodeHtmlEntities(text: string): string {
    const entityMap: { [key: string]: string } = {
        // Common punctuation and symbols
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&apos;": "'",

        // Extended punctuation
        "&hellip;": "…",
        "&mdash;": "—",
        "&ndash;": "–",
        "&lsquo;": "\u2018",
        "&rsquo;": "\u2019",
        "&ldquo;": "\u201c",
        "&rdquo;": "\u201d",
        "&sbquo;": "‚",
        "&bdquo;": "„",
        "&lsaquo;": "‹",
        "&rsaquo;": "›",
        "&laquo;": "«",
        "&raquo;": "»",
        "&prime;": "′",
        "&Prime;": "″",

        // Common special characters
        "&copy;": "©",
        "&reg;": "®",
        "&trade;": "™",
        "&euro;": "€",
        "&pound;": "£",
        "&yen;": "¥",
        "&cent;": "¢",

        // Accented characters (common ones)
        "&aacute;": "á",
        "&Aacute;": "Á",
        "&eacute;": "é",
        "&Eacute;": "É",
        "&iacute;": "í",
        "&Iacute;": "Í",
        "&oacute;": "ó",
        "&Oacute;": "Ó",
        "&uacute;": "ú",
        "&Uacute;": "Ú",
        "&ntilde;": "ñ",
        "&Ntilde;": "Ñ",
        "&uuml;": "ü",
        "&Uuml;": "Ü",

        // Mathematical symbols
        "&times;": "×",
        "&divide;": "÷",
        "&plusmn;": "±",
        "&deg;": "°",
        "&micro;": "µ",

        // Other common entities
        "&bull;": "•",
        "&middot;": "·",
        "&not;": "¬",
        "&shy;": "",
        "&circ;": "ˆ",
        "&tilde;": "˜",
        "&dagger;": "†",
        "&Dagger;": "‡",

        // Numeric entities (common ones)
        "&#34;": '"',
        "&#160;": " ",
        "&#161;": "¡",
        "&#162;": "¢",
        "&#163;": "£",
        "&#164;": "¤",
        "&#165;": "¥",
        "&#166;": "¦",
        "&#167;": "§",
        "&#168;": "¨",
        "&#169;": "©",
        "&#170;": "ª",
        "&#171;": "«",
        "&#172;": "¬",
        "&#173;": "",
        "&#174;": "®",
        "&#175;": "¯",
        "&#176;": "°",
        "&#177;": "±",
        "&#178;": "²",
        "&#179;": "³",
        "&#180;": "´",
        "&#185;": "¹",
        "&#186;": "º",
        "&#187;": "»",
        "&#188;": "¼",
        "&#189;": "½",
        "&#190;": "¾",
        "&#191;": "¿",
        "&#192;": "À",
        "&#193;": "Á",
        "&#194;": "Â",
        "&#195;": "Ã",
        "&#196;": "Ä",
        "&#197;": "Å",
        "&#198;": "Æ",
        "&#199;": "Ç",
        "&#200;": "È",
        "&#201;": "É",
        "&#202;": "Ê",
        "&#203;": "Ë",
        "&#204;": "Ì",
        "&#205;": "Í",
        "&#206;": "Î",
        "&#207;": "Ï",
        "&#208;": "Ð",
        "&#209;": "Ñ",
        "&#210;": "Ò",
        "&#211;": "Ó",
        "&#212;": "Ô",
        "&#213;": "Õ",
        "&#214;": "Ö",
        "&#215;": "×",
        "&#216;": "Ø",
        "&#217;": "Ù",
        "&#218;": "Ú",
        "&#219;": "Û",
        "&#220;": "Ü",
        "&#221;": "Ý",
        "&#222;": "Þ",
        "&#223;": "ß",
        "&#224;": "à",
        "&#225;": "á",
        "&#226;": "â",
        "&#227;": "ã",
        "&#228;": "ä",
        "&#229;": "å",
        "&#230;": "æ",
        "&#231;": "ç",
        "&#232;": "è",
        "&#233;": "é",
        "&#234;": "ê",
        "&#235;": "ë",
        "&#236;": "ì",
        "&#237;": "í",
        "&#238;": "î",
        "&#239;": "ï",
        "&#240;": "ð",
        "&#241;": "ñ",
        "&#242;": "ò",
        "&#243;": "ó",
        "&#244;": "ô",
        "&#245;": "õ",
        "&#246;": "ö",
        "&#247;": "÷",
        "&#248;": "ø",
        "&#249;": "ù",
        "&#250;": "ú",
        "&#251;": "û",
        "&#252;": "ü",
        "&#253;": "ý",
        "&#254;": "þ",
        "&#255;": "ÿ",
        "&#8230;": "…",
        "&#8211;": "–",
        "&#8212;": "—",
        "&#8216;": "\u2018",
        "&#8217;": "\u2019",
        "&#8220;": "\u201c",
        "&#8221;": "\u201d",
        "&#8249;": "‹",
        "&#8250;": "›",
        "&#8242;": "′",
        "&#8243;": "″",
    };

    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
        return entityMap[entity] || entity;
    });
}

// Convert OpenSID date format (DD-MM-YYYY HH:mm:ss) to ISO
function parseOpenSIDDate(dateStr: string): string {
    // Split date and time
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("-");
    const [hour, minute, second] = (timePart || "00:00:00").split(":");

    // Create ISO date string
    return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
    ).toISOString();
}

export const { GET, OPTIONS } = createApiRouteHandler(async (request: NextRequest) => {
    try {
        // Access searchParams to force dynamic evaluation at runtime
        const _dynamicTrigger = request.nextUrl.searchParams.get("_t");
        const firstPageResponse = await fetchOpenSIDArsip(1);

        if (!firstPageResponse.success || !firstPageResponse.data) {
            throw new Error(firstPageResponse.message || "Gagal mengambil data OpenSID");
        }

        const rawFirstPage = firstPageResponse.data as { data?: OpenSIDArticle[]; meta?: any };
        let articles = rawFirstPage.data ?? [];

        // Check if there are more pages and fetch them in parallel
        const totalPages = rawFirstPage.meta?.pagination?.total_pages || 1;
        if (totalPages > 1) {
            const pagePromises = [];
            for (let p = 2; p <= totalPages; p++) {
                pagePromises.push(fetchOpenSIDArsip(p));
            }
            const pageResponses = await Promise.all(pagePromises);
            for (const pageRes of pageResponses) {
                if (pageRes.success && pageRes.data) {
                    const rawPage = pageRes.data as { data?: OpenSIDArticle[] };
                    if (rawPage.data) {
                        articles = articles.concat(rawPage.data);
                    }
                }
            }
        }

        const siteBaseUrl = "https://pondokrejo.sleman-desa.id";

        const toAbsoluteImageUrl = (imageUrl: string | null): string | null => {
            if (!imageUrl) return null;
            if (!imageUrl.includes("/")) {
                return `${siteBaseUrl}/desa/upload/artikel/sedang_${imageUrl}`;
            }
            if (imageUrl.startsWith("/")) {
                return `${siteBaseUrl}${imageUrl}`.replace(/^http:\/\//i, "https://");
            }
            return imageUrl.replace(/^http:\/\//i, "https://");
        };

        // Transform OpenSID data to match expected format for homepage
        const transformedPosts = articles.map((article: OpenSIDArticle) => {
            const attributes = article.attributes;
            const derivedSlug = attributes.slug || (attributes.url_slug ? attributes.url_slug.split("/").pop() || attributes.url_slug : "");

            return {
                id: article.id,
                title: decodeHtmlEntities(attributes.judul),
                slug: derivedSlug,
                excerpt: `${decodeHtmlEntities(attributes.isi.replace(/<[^>]*>/g, "")).substring(0, 200)}...`,
                content: attributes.isi,
                featuredImage: toAbsoluteImageUrl(attributes.gambar),
                readingTime: calculateReadingTime(attributes.isi),
                author: {
                    name: attributes.author?.nama ?? "Admin Kalurahan",
                    avatar: "/images/default-avatar.png",
                },
                category: attributes.category?.kategori ?? "Umum",
                categories: attributes.category
                    ? [
                          {
                              id: parseInt(attributes.category.id),
                              name: attributes.category.kategori ?? "Umum",
                              slug: attributes.category.slug ?? "uncategorized",
                          },
                      ]
                    : [],
                tags: [],
                publishedAt: parseOpenSIDDate(attributes.tgl_upload),
                updatedAt: parseOpenSIDDate(attributes.tgl_upload),
                link: `/berita/${derivedSlug}`,
                readTime: Math.max(1, Math.ceil(attributes.isi.split(" ").length / 200)),
                isBreaking: false,
                isFeatured: false,
                isPinned: false,
                viewCount: attributes.hit || 0,
                likeCount: Math.floor(Math.random() * 100) + 10,
                commentCount: Math.floor(Math.random() * 50) + 5,
                shareCount: Math.floor(Math.random() * 30) + 5,
                isBookmarked: false,
            };
        });

        // Sort by date (newest first) and take the top 20
        const sortedPosts = transformedPosts
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .slice(0, 20);

        return NextResponse.json({
            success: true,
            data: sortedPosts,
            total: sortedPosts.length,
        });
    } catch (error) {
        console.error("Error fetching OpenSID news:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch news from OpenSID",
                data: [],
            },
            { status: 500 }
        );
    }
});
