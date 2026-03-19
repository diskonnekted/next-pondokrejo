"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PustakaBookDetail = {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    detailUrl: string;
    publisher: string | null;
    year: string | null;
    isbn: string | null;
    language: string | null;
    synopsis: string | null;
};

type ApiResponse = { success: true; data: PustakaBookDetail } | { success: false; error: string };

function PustakaDetailContent() {
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = React.useState<PustakaBookDetail | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchDetail = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/pustaka/books/${encodeURIComponent(id)}`, { method: "GET" });
            const json = (await res.json()) as ApiResponse;
            if (!json.success) throw new Error(json.error || "Gagal memuat detail buku");
            setData(json.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat detail buku");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        if (!id) return;
        fetchDetail();
    }, [fetchDetail, id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4">
                    <Card className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-48" />
                            <div className="h-80 bg-gray-200 rounded" />
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4">
                    <Link href="/pustaka">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal memuat data</h3>
                                <p className="text-gray-600">{error || "Detail tidak ditemukan"}</p>
                            </div>
                            <Button onClick={fetchDetail} className="bg-blue-600 hover:bg-blue-700">
                                Coba Lagi
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-6">
                <Link href="/pustaka">
                    <Button variant="ghost">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Perpustakaan
                    </Button>
                </Link>

                <Card className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 md:col-span-1">
                            <div className="aspect-[2/3] bg-gray-100 relative rounded overflow-hidden">
                                {data.coverUrl ? (
                                    <Image src={data.coverUrl} alt={data.title} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BookOpen className="h-10 w-10 text-gray-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 md:col-span-2 space-y-4">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">{data.title}</CardTitle>
                                <div className="text-sm text-muted-foreground">{data.author || "—"}</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div className="text-muted-foreground">Penerbit</div>
                                    <div className="font-medium">{data.publisher || "—"}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Tahun</div>
                                    <div className="font-medium">{data.year || "—"}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">ISBN</div>
                                    <div className="font-medium">{data.isbn || "—"}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Bahasa</div>
                                    <div className="font-medium">{data.language || "—"}</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <a href={data.detailUrl} target="_blank" rel="noopener noreferrer">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Buka di Situs Asli
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Ringkasan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{data.synopsis || "—"}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function PustakaDetailPage() {
    return (
        <React.Suspense
            fallback={
                <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                    <div className="container mx-auto px-4">
                        <Card className="p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-48" />
                                <div className="h-80 bg-gray-200 rounded" />
                            </div>
                        </Card>
                    </div>
                </div>
            }
        >
            <PustakaDetailContent />
        </React.Suspense>
    );
}
