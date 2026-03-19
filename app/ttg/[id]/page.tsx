"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Wrench } from "lucide-react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TtgTutorialDetail = {
    id: string;
    slug: string;
    title: string;
    category: string | null;
    author: string | null;
    readTime: string | null;
    heroImageUrl: string | null;
    dateText: string | null;
    excerptHtml: string | null;
    contentHtml: string | null;
    url: string;
};

type ApiResponse = { success: true; data: TtgTutorialDetail } | { success: false; error: string };

function TtgDetailContent() {
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = React.useState<TtgTutorialDetail | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchDetail = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/ttg/tutorials/${encodeURIComponent(id)}`, { method: "GET" });
            const json = (await res.json()) as ApiResponse;
            if (!json.success) throw new Error(json.error || "Gagal memuat detail TTG");
            setData(json.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat detail TTG");
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
                    <Link href="/ttg">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <Wrench className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal memuat data</h3>
                                <p className="text-gray-600">{error || "Detail tidak ditemukan"}</p>
                            </div>
                            <Button onClick={fetchDetail} className="bg-emerald-700 hover:bg-emerald-800">
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
                <Link href="/ttg">
                    <Button variant="ghost">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke TTG
                    </Button>
                </Link>

                <Card className="overflow-hidden">
                    {data.heroImageUrl ? (
                        <div className="relative w-full h-64 md:h-80 bg-gray-100">
                            <Image src={data.heroImageUrl} alt={data.title} fill className="object-cover" />
                        </div>
                    ) : null}
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">{data.title}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            {[data.category, data.author, data.dateText, data.readTime].filter(Boolean).join(" • ")}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.excerptHtml ? (
                            <div className="prose prose-gray max-w-none">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data.excerptHtml,
                                    }}
                                />
                            </div>
                        ) : null}

                        <div className="flex flex-col sm:flex-row gap-2">
                            <a href={data.url} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-emerald-700 hover:bg-emerald-800">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Buka di Situs Asli
                                </Button>
                            </a>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Konten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.contentHtml ? (
                            <div className="prose prose-gray max-w-none">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data.contentHtml,
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-sm text-gray-700 leading-relaxed">—</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function TtgDetailPage() {
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
            <TtgDetailContent />
        </React.Suspense>
    );
}
