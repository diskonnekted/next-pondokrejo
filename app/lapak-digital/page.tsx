"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Store } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LapakProduct = {
    id: string;
    name: string;
    description: string;
    unit: string | null;
    price: number | null;
    discountPrice: number | null;
    photos: string[];
    category: string | null;
    sellerName: string | null;
    waUrl: string | null;
};

type ApiResponse =
    | {
          success: true;
          data: LapakProduct[];
          meta: { pagination: { total: number; per_page: number; current_page: number; total_pages: number } | null };
      }
    | { success: false; error: string };

function formatRupiah(value: number | null | undefined) {
    if (value === null || value === undefined) return "—";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function LapakSearchContent() {
    const searchParams = useSearchParams();
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    return <LapakContent page={page} />;
}

function LapakContent({ page }: { page: number }) {
    const router = useRouter();
    const perPage = 12;

    const [items, setItems] = React.useState<LapakProduct[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [pagination, setPagination] = React.useState<{
        total: number;
        perPage: number;
        currentPage: number;
        totalPages: number;
    } | null>(null);

    const fetchItems = React.useCallback(async (targetPage: number) => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/lapak/produk?limit=${perPage}&page=${targetPage}`, { method: "GET" });
            const json = (await res.json()) as ApiResponse;
            if (!json.success) {
                throw new Error(json.error || "Gagal memuat data Lapak");
            }
            setItems(json.data);
            const p = json.meta.pagination;
            setPagination(
                p
                    ? { total: p.total, perPage: p.per_page, currentPage: p.current_page, totalPages: p.total_pages }
                    : null
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat data Lapak");
            setItems([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchItems(page);
    }, [fetchItems, page]);

    const goToPage = React.useCallback(
        (nextPage: number) => {
            const p = Math.max(1, nextPage);
            router.push(`/lapak-digital?page=${p}`);
        },
        [router]
    );

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                        <Store className="h-10 w-10 text-emerald-700" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Lapak Digital</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Produk UMKM Kalurahan Pondokrejo yang ditampilkan dari Lapak.</p>
                    <p className="text-xs text-muted-foreground">Sumber data: pondokrejo.sleman-desa.id</p>
                </div>

                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
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
                            <Store className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal memuat data</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                            <Button onClick={() => fetchItems(page)} className="bg-emerald-700 hover:bg-emerald-800">
                                Coba Lagi
                            </Button>
                        </div>
                    </Card>
                )}

                {!loading && !error && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {items.map((item) => {
                                const photo = item.photos?.[0] || null;
                                const hasDiscount =
                                    item.price !== null &&
                                    item.discountPrice !== null &&
                                    item.discountPrice !== item.price;

                                return (
                                    <Link key={item.id} href={`/lapak-digital/${item.id}`} className="block">
                                        <Card className="overflow-hidden hover:shadow-md transition h-full">
                                            <div className="aspect-[4/3] bg-gray-100 relative">
                                                {photo ? (
                                                    <Image
                                                        src={photo}
                                                        alt={item.name}
                                                        fill
                                                        sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                        <Store className="h-10 w-10 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-3 space-y-2">
                                                <div className="text-xs font-semibold text-gray-900 line-clamp-2">
                                                    {item.name || "—"}
                                                </div>
                                                <div className="text-[11px] text-gray-600 truncate">
                                                    {item.category || "UMKM"} • {item.sellerName || "Admin"}
                                                </div>
                                                <div className="space-y-1">
                                                    {hasDiscount && (
                                                        <div className="text-xs text-red-600 line-through">
                                                            {formatRupiah(item.price)}
                                                        </div>
                                                    )}
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {formatRupiah(item.discountPrice ?? item.price)}{" "}
                                                        {item.unit ? (
                                                            <span className="text-xs font-normal text-gray-600">
                                                                / {item.unit}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>

                        {pagination && (
                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Halaman {pagination.currentPage} dari {pagination.totalPages} • Total {pagination.total} produk
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

export default function LapakDigitalPage() {
    return (
        <React.Suspense
            fallback={
                <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                    <div className="container mx-auto px-4 space-y-8">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                                <Store className="h-10 w-10 text-emerald-700" />
                            </div>
                            <h1 className="text-4xl font-bold text-primary">Lapak Digital</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Produk UMKM Kalurahan Pondokrejo yang ditampilkan dari Lapak.
                            </p>
                            <p className="text-xs text-muted-foreground">Sumber data: pondokrejo.sleman-desa.id</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
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
            <LapakSearchContent />
        </React.Suspense>
    );
}
