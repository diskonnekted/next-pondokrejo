"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Store } from "lucide-react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    sourceUrl: string;
};

type ApiResponse = { success: true; data: LapakProduct } | { success: false; error: string };

function formatRupiah(value: number | null | undefined) {
    if (value === null || value === undefined) return "—";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function LapakDetailContent() {
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = React.useState<LapakProduct | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchDetail = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/lapak/produk/${encodeURIComponent(id)}`, { method: "GET" });
            const json = (await res.json()) as ApiResponse;
            if (!json.success) throw new Error(json.error || "Gagal memuat detail produk");
            setData(json.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat detail produk");
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
                    <Link href="/lapak-digital">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <Store className="h-12 w-12 text-gray-400 mx-auto" />
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

    const photo = data.photos?.[0] || null;
    const hasDiscount = data.price !== null && data.discountPrice !== null && data.discountPrice !== data.price;

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-6">
                <Link href="/lapak-digital">
                    <Button variant="ghost">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Lapak Digital
                    </Button>
                </Link>

                <Card className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6">
                            <div className="aspect-[4/3] bg-gray-100 relative rounded overflow-hidden">
                                {photo ? (
                                    <Image src={photo} alt={data.name} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Store className="h-10 w-10 text-gray-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">{data.name || "—"}</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {[data.category || "UMKM", data.sellerName || "Admin"].join(" • ")}
                                </div>
                            </div>

                            <div className="space-y-1">
                                {hasDiscount ? (
                                    <div className="text-sm text-red-600 line-through">{formatRupiah(data.price)}</div>
                                ) : null}
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatRupiah(data.discountPrice ?? data.price)}{" "}
                                    {data.unit ? <span className="text-sm font-normal text-gray-600">/ {data.unit}</span> : null}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                {data.waUrl ? (
                                    <a href={data.waUrl} target="_blank" rel="noopener noreferrer">
                                        <Button className="bg-emerald-700 hover:bg-emerald-800">Hubungi via WhatsApp</Button>
                                    </a>
                                ) : null}
                                <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Buka Lapak Asli
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Deskripsi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{data.description || "—"}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function LapakDetailPage() {
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
            <LapakDetailContent />
        </React.Suspense>
    );
}
