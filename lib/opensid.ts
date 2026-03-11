import { env } from "process";

// OpenSID API Integration Service
interface OpenSIDArticle {
    type: string;
    id: string;
    attributes: {
        config_id: string;
        gambar: string | null;
        gambar1: string | null;
        gambar2: string | null;
        gambar3: string | null;
        dokumen: string | null;
        isi: string;
        enabled: string;
        tgl_upload: string;
        tgl_upload_local: string;
        judul: string;
        url_slug: string;
        slug: string; // Extracted slug for internal use
        author: {
            id: string;
            grup: string;
            nama: string;
            username: string;
        };
        category: {
            id: string;
            slug: string;
            kategori: string;
        } | null; // Can be null
        hit: number; // View count
        comments: unknown[];
    };
}

interface OpenSIDApiResponse {
    data: OpenSIDArticle[];
    meta: {
        pagination: {
            total: number;
            count: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    };
    links: {
        self: string;
        first: string;
        last: string;
    };
}

// Configuration
const OPENSID_CONFIG = {
    baseUrl: `${env.OPENSID_API_URL ?? "https://pondokrejo.sleman-desa.id"}/internal_api/arsip`,
    postsPerPage: 50, // Increased to show more posts per page
    cacheTimeout: 60 * 60 * 1000, // 1 jam cache
};

// Cache untuk menyimpan data sementara
const cache = new Map<string, { data: unknown; timestamp: number }>();

// Helper function untuk cache
function getCachedData(key: string) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < OPENSID_CONFIG.cacheTimeout) {
        return cached.data;
    }
    return null;
}

function setCachedData(key: string, data: unknown) {
    cache.set(key, { data, timestamp: Date.now() });
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

// Decode HTML entities
function decodeHtmlEntities(text: string): string {
    const entityMap: { [key: string]: string } = {
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&apos;": "'",
        "&hellip;": "…",
        "&mdash;": "—",
        "&ndash;": "–",
        "&lsquo;": "\u2018",
        "&rsquo;": "\u2019",
        "&ldquo;": "\u201c",
        "&rdquo;": "\u201d",
    };

    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
        return entityMap[entity] || entity;
    });
}

// Base API function - now uses proxy to avoid CORS issues
async function fetchFromOpenSID(_endpoint: string = "", params: Record<string, string> = {}) {
    // Use proxy API route to avoid CORS issues
    const baseUrl =
        env.NEXTAUTH_URL ||
        env.NEXT_PUBLIC_SITE_URL ||
        // Fallback to local dev
        "http://localhost:5091";
    const url = new URL("/api/opensid-proxy", baseUrl);

    // Add parameters if needed
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    try {
        const response = await fetch(url.toString(), {
            next: { revalidate: OPENSID_CONFIG.cacheTimeout / 1000 },
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept: "application/json",
                "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
            },
        });

        if (!response.ok) {
            throw new Error(`OpenSID Proxy error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`OpenSID API: Fetched ${data?.data?.length || 0} articles via proxy`);
        return data;
    } catch (error) {
        // Log error for debugging
        console.error("OpenSID fetch error:", error);
        console.error("Attempted URL:", url.toString());
        return null;
    }
}

// Transform OpenSID article ke format aplikasi
function transformArticle(article: OpenSIDArticle) {
    const { attributes } = article;

    // Featured image with fallback - OpenSID uses /desa/upload/artikel/sedang_ prefix
    let featuredImage =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%231f2b44'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' fill='%23ffffff' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
    if (attributes.gambar) {
        // OpenSID image pattern: /desa/upload/artikel/sedang_<filename>
        let imageUrl = attributes.gambar;

        // If it's just a filename (no path), add the OpenSID path with sedang_ prefix
        if (!imageUrl.includes("/")) {
            imageUrl = `https://pondokrejo.sleman-desa.id/desa/upload/artikel/sedang_${imageUrl}`;
        } else {
            // If it's a relative path, add base URL
            if (imageUrl.startsWith("/")) {
                imageUrl = `https://pondokrejo.sleman-desa.id${imageUrl}`;
            }
            // Force HTTPS
            imageUrl = imageUrl.replace(/^http:\/\//i, "https://");
        }

        featuredImage = imageUrl;
    }

    // Generate excerpt from content
    const plainContent = attributes.isi.replace(/<[^>]*>/g, "");
    const excerpt = `${plainContent.substring(0, 200)}...`;

    // Convert OpenSID date format (DD-MM-YYYY HH:mm:ss) to ISO
    function parseOpenSIDDate(dateStr: string) {
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

    const derivedSlug = attributes.slug || (attributes.url_slug ? attributes.url_slug.split("/").pop() || attributes.url_slug : "");

    return {
        id: parseInt(article.id),
        title: decodeHtmlEntities(attributes.judul),
        content: attributes.isi, // Keep HTML for detail page rendering
        excerpt,
        slug: derivedSlug,
        date: parseOpenSIDDate(attributes.tgl_upload),
        modified: parseOpenSIDDate(attributes.tgl_upload),
        link: `/berita/${derivedSlug}`, // Internal link format
        status: attributes.enabled === "1" ? "publish" : "draft",
        readingTime: calculateReadingTime(attributes.isi),

        // Author information
        author: {
            id: parseInt(attributes.author.id),
            name: attributes.author.nama,
            avatar: "/images/default-avatar.png",
        },

        // Featured image
        featuredImage,
        featuredImageAlt: attributes.judul,

        // Categories (handle null category)
        categories: attributes.category
            ? [
                  {
                      id: parseInt(attributes.category.id),
                      name: attributes.category.kategori || "Uncategorized",
                      slug: attributes.category.slug || "uncategorized",
                  },
              ]
            : [{ id: 0, name: "Tidak Berkategori", slug: "uncategorized" }],

        // Tags (OpenSID doesn't have tags, so we'll use empty array)
        tags: [],

        // View count from OpenSID 'hit' field
        viewCount: attributes.hit || 0,
    };
}

// API Functions

// Get all articles dengan pagination (server-side pagination with full OpenSID data)
export async function getPosts(
    page: number = 1,
    perPage: number | undefined = OPENSID_CONFIG.postsPerPage,
    category?: number,
    tag?: number
) {
    const cacheKey = `opensid-posts-all`;
    const cached = getCachedData(cacheKey);
    let allArticles;

    if (cached) {
        allArticles = cached;
    } else {
        // Fetch ALL articles from OpenSID without limit
        const response = await fetchFromOpenSID();

        if (!response?.data) {
            console.error("OpenSID: No data received from API");
            return {
                posts: [],
                totalPosts: 0,
                totalPages: 0,
            };
        }

        allArticles = response.data;
        console.log(`OpenSID: Cached ${allArticles.length} total articles`);

        // Cache all articles (without category/tag filters)
        setCachedData(cacheKey, allArticles);
    }

    // Apply filters on the complete dataset
    let filteredArticles = allArticles;

    // Filter by category if specified
    if (category !== undefined) {
        filteredArticles = filteredArticles.filter((article: OpenSIDArticle) => {
            if (category === 0) {
                // Category 0 = uncategorized posts
                return article.attributes.category === null;
            } else {
                // Filter by actual category ID
                return article.attributes.category !== null && parseInt(article.attributes.category.id) === category;
            }
        });
    }

    // Transform all filtered articles
    const transformedArticles = filteredArticles
        .filter((article: OpenSIDArticle | null) => article !== null)
        .map(transformArticle);

    // Apply server-side pagination
    const totalPosts = transformedArticles.length;
    const effectivePerPage = perPage ?? totalPosts; // If no perPage specified, use all data
    const totalPages = Math.ceil(totalPosts / effectivePerPage);
    const startIndex = (page - 1) * effectivePerPage;
    const endIndex = startIndex + effectivePerPage;
    const paginatedArticles = transformedArticles.slice(startIndex, endIndex);

    console.log(
        `OpenSID: Page ${page}, ${effectivePerPage} per page, showing ${paginatedArticles.length} of ${totalPosts} articles`
    );

    const result = {
        posts: paginatedArticles,
        totalPosts,
        totalPages,
    };

    // Cache page-specific results briefly
    const pageCacheKey = `opensid-posts-${page}-${effectivePerPage}-${category ?? "all"}-${tag ?? "all"}`;
    setCachedData(pageCacheKey, result);

    return result;
}

// Get single article by slug (from full OpenSID data)
export async function getPostBySlug(slug: string) {
    const cacheKey = `opensid-post-${slug}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // Get ALL articles from OpenSID to find by slug
    const response = await fetchFromOpenSID();

    if (!response?.data) {
        console.error("OpenSID: No data for post lookup");
        return null;
    }

    // Find article by slug (use attributes.slug if present, otherwise derive from url_slug)
    const article = response.data.find((item: OpenSIDArticle) => {
        const a = item.attributes;
        const derived = a.slug || (a.url_slug ? a.url_slug.split("/").pop() || a.url_slug : "");
        return derived === slug;
    });

    if (!article) {
        console.error(`OpenSID: Post not found for slug "${slug}"`);
        return null;
    }

    console.log(`OpenSID: Found post "${article.attributes.judul}" for slug "${slug}"`);
    const transformedPost = transformArticle(article);
    setCachedData(cacheKey, transformedPost);
    return transformedPost;
}

// Get popular articles (berdasarkan view count dari OpenSID)
export async function getPopularPosts(limit: number = 10) {
    const cacheKey = `opensid-popular-posts-${limit}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // Get ALL articles from OpenSID for proper popularity ranking
    const response = await fetchFromOpenSID();

    if (!response?.data) {
        console.error("OpenSID: No data for popular posts");
        return [];
    }

    console.log(`OpenSID: Getting popular posts from ${response.data.length} total articles`);

    // Sort ALL articles by hit count (popularity) in descending order
    const sortedByPopularity = response.data
        .filter((article: OpenSIDArticle) => article !== null)
        .sort((a: OpenSIDArticle, b: OpenSIDArticle) => {
            const hitA = a.attributes?.hit || 0;
            const hitB = b.attributes?.hit || 0;
            return hitB - hitA; // Sort descending (highest hits first)
        })
        .slice(0, limit) // Take only the top 'limit' articles
        .map((article: OpenSIDArticle) => {
            const post = transformArticle(article);
            return {
                ...post,
                popularity: article.attributes.hit || 0, // Use actual hit count as popularity
            };
        });

    console.log(`OpenSID: Returning top ${sortedByPopularity.length} popular posts`);
    setCachedData(cacheKey, sortedByPopularity);
    return sortedByPopularity;
}

// Get categories (from full OpenSID data)
export async function getCategories() {
    const cacheKey = "opensid-categories";
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // Get ALL articles from OpenSID to count categories accurately
    const response = await fetchFromOpenSID();

    if (!response?.data) {
        console.error("OpenSID: No data for categories");
        return [];
    }

    console.log(`OpenSID: Getting categories from ${response.data.length} articles`);

    // Extract unique categories and count uncategorized posts
    const categoriesMap = new Map<
        string,
        { id: number; name: string; slug: string; description: string; count: number }
    >();

    let uncategorizedCount = 0;

    response.data.forEach((article: OpenSIDArticle) => {
        const category = article.attributes.category;

        if (category && !categoriesMap.has(category.id)) {
            // Add real category
            categoriesMap.set(category.id, {
                id: parseInt(category.id),
                name: category.kategori || "Uncategorized",
                slug: category.slug || "uncategorized",
                description: "",
                count: 0,
            });
        }

        // Increment count for categories or uncategorized
        if (category) {
            const cat = categoriesMap.get(category.id);
            if (cat) {
                cat.count += 1;
            }
        } else {
            // Count uncategorized posts
            uncategorizedCount += 1;
        }
    });

    // Add uncategorized category if there are uncategorized posts
    if (uncategorizedCount > 0) {
        categoriesMap.set("uncategorized", {
            id: 0, // Use 0 for uncategorized
            name: "Tidak Berkategori",
            slug: "uncategorized",
            description: "Posts without category",
            count: uncategorizedCount,
        });
    }

    const transformedData = Array.from(categoriesMap.values());
    console.log(`OpenSID: Found ${transformedData.length} categories (${uncategorizedCount} uncategorized)`);

    setCachedData(cacheKey, transformedData);
    return transformedData;
}

// Get tags (OpenSID doesn't have tags, so return empty array)
export async function getTags() {
    return [];
}

// Get archive dates (from full OpenSID data)
export async function getArchiveDates() {
    const cacheKey = "opensid-archive-dates";
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // Get ALL articles from OpenSID for complete archive data
    const response = await fetchFromOpenSID();

    if (!response?.data) {
        console.error("OpenSID: No data for archive dates");
        return [];
    }

    console.log(`OpenSID: Getting archive dates from ${response.data.length} articles`);

    // Extract tahun dan bulan dari articles
    const archives = new Map<string, number>();

    response.data.forEach((article: OpenSIDArticle) => {
        // Parse OpenSID date format (DD-MM-YYYY HH:mm:ss)
        const dateStr = article.attributes.tgl_upload;
        const [datePart] = dateStr.split(" ");
        const [day, month, year] = datePart.split("-");

        // Validate that we have valid date components
        if (!day || !month || !year || isNaN(parseInt(year)) || isNaN(parseInt(month))) {
            return; // Skip invalid dates
        }

        const key = `${year}-${month.toString().padStart(2, "0")}`;
        archives.set(key, (archives.get(key) ?? 0) + 1);
    });

    const transformedData = Array.from(archives.entries())
        .map(([key, count]) => {
            const [year, month] = key.split("-");
            const monthNames = [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ];

            return {
                key,
                year: parseInt(year),
                month: parseInt(month),
                monthName: monthNames[parseInt(month) - 1],
                count,
                displayText: `${monthNames[parseInt(month) - 1]} ${year}`,
            };
        })
        .sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });

    console.log(`OpenSID: Found ${transformedData.length} archive periods`);
    setCachedData(cacheKey, transformedData);
    return transformedData;
}

// Search posts (from full OpenSID data)
export async function searchPosts(query: string, page: number = 1) {
    if (!query.trim()) return null;

    const cacheKey = `opensid-search-${query}-${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // Get ALL articles from OpenSID for comprehensive search
    const response = await fetchFromOpenSID();

    if (!response?.data) {
        console.error("OpenSID: No data for search");
        return null;
    }

    console.log(`OpenSID: Searching "${query}" in ${response.data.length} articles`);

    // Filter articles by search query (search in title and content)
    const searchLower = query.toLowerCase();
    const filteredArticles = response.data.filter((article: OpenSIDArticle) => {
        const { judul, isi } = article.attributes;
        return judul.toLowerCase().includes(searchLower) || isi.toLowerCase().includes(searchLower);
    });

    console.log(`OpenSID: Found ${filteredArticles.length} matching articles`);

    // Transform filtered articles
    const transformedArticles = filteredArticles.map(transformArticle);

    // Server-side pagination
    const perPage = OPENSID_CONFIG.postsPerPage;
    const totalPosts = transformedArticles.length;
    const totalPages = Math.ceil(totalPosts / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedArticles = transformedArticles.slice(startIndex, endIndex);

    const result = {
        posts: paginatedArticles,
        totalPosts,
        totalPages,
        query,
    };

    setCachedData(cacheKey, result);
    return result;
}

// Export configuration
export { OPENSID_CONFIG };

// Types untuk digunakan di components (compatible with WordPress types)
export type { OpenSIDArticle, OpenSIDApiResponse };

// Transformed types (matching WordPress interface for compatibility)
export interface Post {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    date: string;
    modified: string;
    link: string;
    status: string;
    readingTime: number;
    author: {
        id: number;
        name: string;
        avatar: string;
    };
    featuredImage: string;
    featuredImageAlt: string;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    tags: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    viewCount: number;
    popularity?: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    count: number;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    description: string;
    count: number;
}

export interface ArchiveDate {
    key: string;
    year: number;
    month: number;
    monthName: string;
    count: number;
    displayText: string;
}
