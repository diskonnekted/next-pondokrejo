"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Droplets,
    Egg,
    Factory,
    Fish,
    Layers,
    Leaf,
    Newspaper,
    Recycle,
    Sprout,
    Trash2,
    Trees,
    Wrench,
    Zap,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TtgTutorial = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    imageUrl: string | null;
    dateText: string | null;
    difficulty: string | null;
    url: string;
};

type TtgCategory = { id: string; name: string; slug: string; count: number; url: string };

type TutorialsResponse =
    | {
          success: true;
          data: TtgTutorial[];
          meta: { pagination: { total: number; per_page: number; current_page: number; total_pages: number } };
      }
    | { success: false; error: string };

type CategoriesResponse = { success: true; data: TtgCategory[]; total: number } | { success: false; error: string };

function getCategoryIcon(slug: string) {
    const map: Record<string, typeof Wrench> = {
        all: Layers,
        berita: Newspaper,
        pertanian: Sprout,
        peternakan: Egg,
        perikanan: Fish,
        pengairan: Droplets,
        pengolahan: Factory,
        "pengolahan-limbah": Trash2,
        "daur-ulang": Recycle,
        energi: Zap,
        kerajinan: Wrench,
        "tanaman-obat": Leaf,
        "ramah-lingkungan": Trees,
        "tak-berkategori": Layers,
    };
    return map[slug] || Wrench;
}

function getCategoryGradient(slug: string) {
    const map: Record<string, string> = {
        all: "from-slate-100 to-slate-200 border-slate-200",
        berita: "from-blue-100 to-blue-200 border-blue-200",
        pertanian: "from-lime-100 to-lime-200 border-lime-200",
        peternakan: "from-amber-100 to-amber-200 border-amber-200",
        perikanan: "from-cyan-100 to-cyan-200 border-cyan-200",
        pengairan: "from-sky-100 to-sky-200 border-sky-200",
        pengolahan: "from-violet-100 to-violet-200 border-violet-200",
        "pengolahan-limbah": "from-rose-100 to-rose-200 border-rose-200",
        "daur-ulang": "from-emerald-100 to-emerald-200 border-emerald-200",
        energi: "from-yellow-100 to-yellow-200 border-yellow-200",
        kerajinan: "from-orange-100 to-orange-200 border-orange-200",
        "tanaman-obat": "from-green-100 to-green-200 border-green-200",
        "ramah-lingkungan": "from-teal-100 to-teal-200 border-teal-200",
        "tak-berkategori": "from-gray-100 to-gray-200 border-gray-200",
    };
    return map[slug] || "from-emerald-100 to-emerald-200 border-emerald-200";
}

function getCategoryDescription(slug: string) {
    const map: Record<string, string> = {
        all: "Semua konten TTG",
        berita: "Artikel & info terbaru",
        pertanian: "Teknik budidaya & pertanian",
        peternakan: "Budidaya ternak & kandang",
        perikanan: "Budidaya ikan & perairan",
        pengairan: "Air bersih & irigasi",
        pengolahan: "Pengolahan hasil & produk",
        "pengolahan-limbah": "Limbah rumah tangga & industri",
        "daur-ulang": "Daur ulang & pemanfaatan ulang",
        energi: "Energi alternatif & hemat energi",
        kerajinan: "Kerajinan & produksi lokal",
        "tanaman-obat": "TOGA & kesehatan",
        "ramah-lingkungan": "Konservasi & lingkungan",
        "tak-berkategori": "Konten lainnya",
    };
    return map[slug] || "Teknologi tepat guna";
}

function TtgSearchContent() {
    const searchParams = useSearchParams();
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    const categoryId = (searchParams.get("categoryId") || searchParams.get("category") || "").trim();
    return <TtgContent page={page} categoryId={categoryId} />;
}

function TtgContent({ page, categoryId }: { page: number; categoryId: string }) {
    const router = useRouter();
    const [items, setItems] = React.useState<TtgTutorial[]>([]);
    const [categories, setCategories] = React.useState<TtgCategory[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [pagination, setPagination] = React.useState<{
        total: number;
        perPage: number;
        currentPage: number;
        totalPages: number;
    } | null>(null);

    const perPage = 12;

    const fetchCategories = React.useCallback(async () => {
        try {
            const res = await fetch("/api/ttg/categories", { method: "GET" });
            const json = (await res.json()) as CategoriesResponse;
            if (!json.success) throw new Error(json.error || "Gagal memuat kategori TTG");
            const totalPosts = json.data.reduce((sum, c) => sum + (typeof c.count === "number" ? c.count : 0), 0);
            setCategories([
                { id: "", name: "Semua", slug: "all", count: totalPosts, url: "https://ttg.pondokrejo.id/" },
                ...json.data,
            ]);
        } catch {
            setCategories([{ id: "", name: "Semua", slug: "all", count: 0, url: "https://ttg.pondokrejo.id/" }]);
        }
    }, []);

    React.useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const activeCategoryId = categoryId && categoryId !== "all" ? categoryId : "";

    const fetchItems = React.useCallback(
        async (targetCategoryId: string, targetPage: number) => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(
                    `/api/ttg/tutorials?limit=${perPage}&page=${targetPage}&categoryId=${encodeURIComponent(targetCategoryId)}`,
                    { method: "GET" }
                );
                const json = (await res.json()) as TutorialsResponse;
                if (!json.success) throw new Error(json.error || "Gagal memuat konten TTG");
                setItems(json.data);
                setPagination({
                    total: json.meta.pagination.total,
                    perPage: json.meta.pagination.per_page,
                    currentPage: json.meta.pagination.current_page,
                    totalPages: json.meta.pagination.total_pages,
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : "Gagal memuat konten TTG");
                setItems([]);
                setPagination(null);
            } finally {
                setLoading(false);
            }
        },
        [perPage]
    );

    React.useEffect(() => {
        fetchItems(activeCategoryId, page);
    }, [activeCategoryId, fetchItems, page]);

    const goToPage = React.useCallback(
        (nextPage: number) => {
            const p = Math.max(1, nextPage);
            const base = "/ttg";
            const qp = activeCategoryId ? `?categoryId=${encodeURIComponent(activeCategoryId)}&page=${p}` : `?page=${p}`;
            router.push(`${base}${qp}`);
        },
        [activeCategoryId, router]
    );

    const setCategory = React.useCallback(
        (nextCategoryId: string) => {
            const base = "/ttg";
            const qp = nextCategoryId ? `?categoryId=${encodeURIComponent(nextCategoryId)}&page=1` : `?page=1`;
            router.push(`${base}${qp}`);
        },
        [router]
    );

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                        <Wrench className="h-10 w-10 text-emerald-700" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Teknologi Tepat Guna</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Konten TTG Pondokrejo untuk kemandirian dan kemajuan Kalurahan Pondokrejo.
                    </p>
                    <p className="text-xs text-muted-foreground">Sumber data: ttg.pondokrejo.id</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {categories.map((cat) => {
                        const isAll = cat.slug === "all" || cat.id === "";
                        const isActive = isAll ? !activeCategoryId : cat.id === activeCategoryId;
                        const Icon = getCategoryIcon(cat.slug);
                        const gradient = getCategoryGradient(cat.slug);
                        const description = getCategoryDescription(cat.slug);
                        const showCount = typeof cat.count === "number" ? cat.count : 0;
                        return (
                            <button
                                key={cat.id || "all"}
                                type="button"
                                onClick={() => setCategory(isAll ? "" : cat.id)}
                                className="text-left"
                            >
                                <Card
                                    className={[
                                        "overflow-hidden border bg-linear-to-br shadow-xs hover:shadow-md transition",
                                        gradient,
                                        isActive ? "ring-2 ring-emerald-700" : "",
                                    ].join(" ")}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs text-muted-foreground">Kategori</div>
                                                    {isActive ? (
                                                        <div className="inline-flex items-center rounded-full bg-emerald-700/90 text-white px-2 py-0.5 text-[10px] font-semibold">
                                                            Aktif
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900 line-clamp-2">{cat.name}</div>
                                                <div className="text-[11px] text-gray-700 mt-1 line-clamp-2">{description}</div>
                                            </div>
                                            <div className="shrink-0 w-10 h-10 rounded-xl bg-white/70 border border-white/60 flex items-center justify-center">
                                                <Icon className="h-5 w-5 text-gray-800" />
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-end justify-between gap-3">
                                            <div className="text-2xl font-bold text-gray-900 leading-none">{showCount}</div>
                                            <div className="text-xs text-gray-700">konten</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </button>
                        );
                    })}
                </div>

                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                                <CardContent className="p-3 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {error && (
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <Wrench className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal memuat data</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                            <Button
                                onClick={() => fetchItems(activeCategoryId, page)}
                                className="bg-emerald-700 hover:bg-emerald-800"
                            >
                                Coba Lagi
                            </Button>
                        </div>
                    </Card>
                )}

                {!loading && !error && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {items.map((item) => (
                                <Link key={item.id} href={`/ttg/${item.id}`} className="block">
                                    <Card className="overflow-hidden hover:shadow-md transition h-full">
                                        <div className="aspect-[4/3] bg-gray-100 relative">
                                            {item.imageUrl ? (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    fill
                                                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                    <Wrench className="h-10 w-10 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-3 space-y-1">
                                            <div className="text-xs font-semibold text-gray-900 line-clamp-2">{item.title}</div>
                                            <div className="text-[11px] text-gray-600 line-clamp-2">{item.excerpt || "—"}</div>
                                            <div className="text-[10px] text-gray-400">
                                                {[item.dateText, item.difficulty].filter(Boolean).join(" • ")}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {pagination && (
                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Halaman {pagination.currentPage} dari {pagination.totalPages} • Total {pagination.total} konten
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

export default function TtgPage() {
    return (
        <React.Suspense
            fallback={
                <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                    <div className="container mx-auto px-4 space-y-8">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                                <Wrench className="h-10 w-10 text-emerald-700" />
                            </div>
                            <h1 className="text-4xl font-bold text-primary">Teknologi Tepat Guna</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Konten TTG Pondokrejo untuk kemandirian dan kemajuan Kalurahan Pondokrejo.
                            </p>
                            <p className="text-xs text-muted-foreground">Sumber data: ttg.pondokrejo.id</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                                    <CardContent className="p-3 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            }
        >
            <TtgSearchContent />
        </React.Suspense>
    );
}
