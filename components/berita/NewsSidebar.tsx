"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, TrendingUp, Tag, Folder, Archive, ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, Category, Tag as TagType, ArchiveDate } from "@/lib/opensid";

interface NewsSidebarProps {
    currentCategory?: number;
    currentTag?: number;
    className?: string;
}

export default function NewsSidebar({ currentCategory, currentTag, className = "" }: NewsSidebarProps) {
    const [popularPosts, setPopularPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<TagType[]>([]);
    const [archives, setArchives] = useState<ArchiveDate[]>([]);
    const [loading, setLoading] = useState(true);

    // Collapsible sections for mobile
    const [expandedSections, setExpandedSections] = useState({
        popular: true,
        categories: true,
        tags: true,
        archives: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    useEffect(() => {
        async function loadSidebarData() {
            try {
                setLoading(true);

                // Import OpenSID library
                const opensid = await import("@/lib/opensid");
                const [recentPostsData, categoriesData, tagsData, archivesData] = await Promise.all([
                    opensid.getPosts(1, 10),
                    opensid.getCategories(),
                    opensid.getTags(),
                    opensid.getArchiveDates(),
                ]);

                setPopularPosts((recentPostsData as { posts?: Post[] })?.posts ?? []);
                setCategories((categoriesData as Category[]) ?? []);
                setTags((tagsData as TagType[])?.slice(0, 10) ?? []); // Hanya 10 tags pertama
                setArchives((archivesData as Array<ArchiveDate>)?.slice(0, 12) ?? []); // Hanya 12 bulan terakhir
            } catch {
                // Set empty arrays when API is not available
                setPopularPosts([]);
                setCategories([]);
                setTags([]);
                setArchives([]);
            } finally {
                setLoading(false);
            }
        }

        loadSidebarData();
    }, []);

    // Format date untuk popular posts
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString("id-ID", { month: "short" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Popular News */}
            <Card>
                <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("popular")}>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Berita Terkini
                        </div>
                        <div className="sm:hidden">
                            {expandedSections.popular ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className={expandedSections.popular ? "block" : "hidden sm:block"}>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            ))}
                        </div>
                    ) : popularPosts.length > 0 ? (
                        <div className="space-y-4">
                            {popularPosts.map((post, index) => (
                                <div key={post.id} className="group">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/berita/${post.slug}`}
                                                className="block hover:text-primary transition-colors"
                                            >
                                                <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:underline">
                                                    {post.title}
                                                </h4>
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(post.date)}</span>
                                                <span>•</span>
                                                <span>{post.viewCount} views</span>
                                            </div>
                                        </div>
                                    </div>
                                    {index < popularPosts.length - 1 && <div className="mt-4 border-b border-border" />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada berita terkini</p>
                    )}
                </CardContent>
            </Card>

            {/* Categories */}
            <Card>
                <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("categories")}>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                            <Folder className="h-5 w-5 text-primary" />
                            Kategori
                        </div>
                        <div className="sm:hidden">
                            {expandedSections.categories ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className={expandedSections.categories ? "block" : "hidden sm:block"}>
                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                            ))}
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/berita?category=${category.slug}`}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                        currentCategory === category.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    }`}
                                >
                                    {category.name}
                                    <Badge variant="secondary" className="ml-1 text-xs">
                                        {category.count}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada kategori</p>
                    )}
                </CardContent>
            </Card>

            {/* Tags */}
            {loading ? (
                <Card>
                    <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("tags")}>
                        <CardTitle className="flex items-center justify-between text-lg">
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                Tags
                            </div>
                            <div className="sm:hidden">
                                {expandedSections.tags ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={expandedSections.tags ? "block" : "hidden sm:block"}>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-6 w-16" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : tags.length > 0 ? (
                <Card>
                    <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("tags")}>
                        <CardTitle className="flex items-center justify-between text-lg">
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                Tags
                            </div>
                            <div className="sm:hidden">
                                {expandedSections.tags ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={expandedSections.tags ? "block" : "hidden sm:block"}>
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Skeleton key={i} className="h-6 w-16" />
                                ))}
                            </div>
                        ) : tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/berita?tag=${tag.slug}`}
                                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs border transition-colors ${
                                            currentTag === tag.id
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-primary hover:bg-primary/5"
                                        }`}
                                    >
                                        #{tag.name}
                                        <span className="ml-1 text-muted-foreground">({tag.count})</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Belum ada tag</p>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("tags")}>
                        <CardTitle className="flex items-center justify-between text-lg">
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                Tags
                            </div>
                            <div className="sm:hidden">
                                {expandedSections.tags ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={expandedSections.tags ? "block" : "hidden sm:block"}>
                        <p className="text-sm text-muted-foreground">Belum ada tag</p>
                    </CardContent>
                </Card>
            )}

            {/* Archives */}
            <Card>
                <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("archives")}>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                            <Archive className="h-5 w-5 text-primary" />
                            Arsip
                        </div>
                        <div className="sm:hidden">
                            {expandedSections.archives ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className={expandedSections.archives ? "block" : "hidden sm:block"}>
                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-6 w-full" />
                            ))}
                        </div>
                    ) : archives.length > 0 ? (
                        <div className="space-y-1">
                            {archives.map((archive) => (
                                <Link
                                    key={archive.key}
                                    href={`/berita?archive=${archive.key}`}
                                    className="flex items-center justify-between py-2 px-2 rounded-md text-sm hover:bg-accent transition-colors"
                                >
                                    <span>{archive.displayText}</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {archive.count}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada arsip</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
