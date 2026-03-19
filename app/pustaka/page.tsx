"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PustakaBook = {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    detailUrl: string;
};

type ApiResponse =
    | {
          success: true;
          data: PustakaBook[];
          meta: {
              pagination: { total: number; per_page: number; current_page: number; total_pages: number };
          };
      }
    | { success: false; error: string };

function PustakaSearchContent() {
    const searchParams = useSearchParams();
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    return <PustakaContent page={page} />;
}

function PustakaContent({ page }: { page: number }) {
    const router = useRouter();
    const perPage = 12;

    const [books, setBooks] = React.useState<PustakaBook[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [pagination, setPagination] = React.useState<{
        total: number;
        perPage: number;
        currentPage: number;
        totalPages: number;
    } | null>(null);

    const fetchBooks = React.useCallback(async (targetPage: number) => {
        try {
            setLoading(true);
            setError(null);
            const url = `/api/pustaka/books?limit=${perPage}&page=${targetPage}`;
            const res = await fetch(url, { method: "GET" });
            const json = (await res.json()) as ApiResponse;
            if (!json.success) {
                throw new Error(json.error || "Gagal memuat data pustaka");
            }
            setBooks(json.data);
            setPagination({
                total: json.meta.pagination.total,
                perPage: json.meta.pagination.per_page,
                currentPage: json.meta.pagination.current_page,
                totalPages: json.meta.pagination.total_pages,
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat data pustaka");
            setBooks([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, [perPage]);

    React.useEffect(() => {
        fetchBooks(page);
    }, [fetchBooks, page]);

    const goToPage = React.useCallback(
        (nextPage: number) => {
            const p = Math.max(1, nextPage);
            router.push(`/pustaka?page=${p}`);
        },
        [router]
    );

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                        <BookOpen className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Perpustakaan</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Thumbnail koleksi buku dari Perpustakaan Kalurahan Pondokrejo.
                    </p>
                    <p className="text-xs text-muted-foreground">Sumber data: pustaka.pondokrejo.id</p>
                </div>

                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Array.from({ length: 18 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
                                <CardContent className="p-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {error && (
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal memuat data</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                            <Button onClick={() => fetchBooks(page)} className="bg-blue-600 hover:bg-blue-700">
                                Coba Lagi
                            </Button>
                        </div>
                    </Card>
                )}

                {!loading && !error && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {books.map((book) => (
                                <Link key={book.id} href={`/pustaka/${book.id}`} className="block">
                                    <Card className="overflow-hidden hover:shadow-md transition h-full">
                                        <div className="aspect-[2/3] bg-gray-100 relative">
                                            {book.coverUrl ? (
                                                <Image
                                                    src={book.coverUrl}
                                                    alt={book.title}
                                                    fill
                                                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                    <BookOpen className="h-10 w-10 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-3">
                                            <div className="text-xs font-semibold text-gray-900 line-clamp-2">
                                                {book.title}
                                            </div>
                                            <div className="text-xs text-gray-600 mt-1 truncate">{book.author || "—"}</div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {pagination && (
                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Halaman {pagination.currentPage} dari {pagination.totalPages} • Total {pagination.total} buku
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => goToPage(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage <= 1}
                                    >
                                        Sebelumnya
                                    </Button>
                                    <Button
                                        onClick={() => goToPage(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage >= pagination.totalPages}
                                    >
                                        Berikutnya
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PustakaPage() {
    return (
        <React.Suspense
            fallback={
                <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                    <div className="container mx-auto px-4 space-y-8">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                                <BookOpen className="h-10 w-10 text-blue-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-primary">Perpustakaan</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Thumbnail koleksi buku dari Perpustakaan Kalurahan Pondokrejo.
                            </p>
                            <p className="text-xs text-muted-foreground">Sumber data: pustaka.pondokrejo.id</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
                                    <CardContent className="p-3">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            }
        >
            <PustakaSearchContent />
        </React.Suspense>
    );
}
