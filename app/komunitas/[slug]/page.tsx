"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type KomunitasDetail = {
    slug: string;
    name: string;
    category: string | null;
    description: string | null;
    membersActive: number | null;
    url: string;
};

type ApiResponse = { success: true; data: KomunitasDetail } | { success: false; error: string };

function KomunitasDetailContent() {
    const params = useParams();
    const slug = params.slug as string;

    const [data, setData] = React.useState<KomunitasDetail | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchDetail = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/komunitas/komunitas/${encodeURIComponent(slug)}`, { method: "GET" });
            const json = (await res.json()) as ApiResponse;
            if (!json.success) throw new Error(json.error || "Gagal memuat detail komunitas");
            setData(json.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat detail komunitas");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    React.useEffect(() => {
        if (!slug) return;
        fetchDetail();
    }, [fetchDetail, slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4">
                    <Card className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-48" />
                            <div className="h-40 bg-gray-200 rounded" />
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
                    <Link href="/komunitas">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <Users className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal memuat data</h3>
                                <p className="text-gray-600">{error || "Detail tidak ditemukan"}</p>
                            </div>
                            <Button onClick={fetchDetail} className="bg-purple-700 hover:bg-purple-800">
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
                <Link href="/komunitas">
                    <Button variant="ghost">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Komunitas
                    </Button>
                </Link>

                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-2xl">{data.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            {[data.category, data.membersActive !== null ? `${data.membersActive} anggota aktif` : null]
                                .filter(Boolean)
                                .join(" • ")}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{data.description || "—"}</p>
                        <a href={data.url} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-purple-700 hover:bg-purple-800">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Buka di Situs Asli
                            </Button>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function KomunitasDetailPage() {
    return (
        <React.Suspense
            fallback={
                <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                    <div className="container mx-auto px-4">
                        <Card className="p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-48" />
                                <div className="h-40 bg-gray-200 rounded" />
                            </div>
                        </Card>
                    </div>
                </div>
            }
        >
            <KomunitasDetailContent />
        </React.Suspense>
    );
}
