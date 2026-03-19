"use client";

import * as React from "react";
import { BarChart3, Droplets, Home, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AnalyticsData = {
    total_households: number;
    total_residents: number;
    income_distribution: Record<string, number>;
    job_profile_poor: Record<string, number>;
    education_poor: Record<string, number>;
    income_comparison: Record<string, number>;
    rtlh_count: number;
    no_latrine_count: number;
    no_clean_water_count: number;
    elderly_single_count: number;
    poor_with_toddler_count: number;
};

type ApiResponse =
    | { success: true; data: AnalyticsData; sourceUrl: string; fetchedAt: string }
    | { success: false; error: string };

function toTopEntries(obj: Record<string, number>, limit: number) {
    return Object.entries(obj || {})
        .filter(([, v]) => typeof v === "number")
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
}

function formatNumber(n: number) {
    return new Intl.NumberFormat("id-ID").format(n);
}

export default function AnalitikPage() {
    const [data, setData] = React.useState<AnalyticsData | null>(null);
    const [sourceUrl, setSourceUrl] = React.useState<string>("https://peta.pondokrejo.id/analytics");
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/analitik", { method: "GET" });
            const json = (await res.json()) as ApiResponse;
            if (!json.success) throw new Error(json.error || "Gagal memuat data analitik");
            setData(json.data);
            setSourceUrl(json.sourceUrl);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat data analitik");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                        <BarChart3 className="h-10 w-10 text-purple-700" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Analitik</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Ringkasan analisis kesejahteraan dan sosial Kalurahan Pondokrejo berbasis data presisi.
                    </p>
                    <p className="text-xs text-muted-foreground">Sumber data: peta.pondokrejo.id</p>
                    <div className="flex justify-center">
                        <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline">Buka Dashboard Asli</Button>
                        </a>
                    </div>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="pb-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {error && (
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal memuat data</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                            <Button onClick={fetchData} className="bg-purple-700 hover:bg-purple-800">
                                Coba Lagi
                            </Button>
                        </div>
                    </Card>
                )}

                {!loading && !error && data && (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 border">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <CardTitle className="text-base text-blue-900">Jumlah KK</CardTitle>
                                        <Home className="h-5 w-5 text-blue-700" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-blue-900">{formatNumber(data.total_households)}</div>
                                    <div className="text-xs text-blue-800 mt-1">Total kepala keluarga terdata</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 border">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <CardTitle className="text-base text-emerald-900">Jumlah Penduduk</CardTitle>
                                        <Users className="h-5 w-5 text-emerald-700" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-emerald-900">{formatNumber(data.total_residents)}</div>
                                    <div className="text-xs text-emerald-800 mt-1">Total penduduk terdata</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200 border">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <CardTitle className="text-base text-sky-900">Air Minum Tidak Layak</CardTitle>
                                        <Droplets className="h-5 w-5 text-sky-700" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-sky-900">{formatNumber(data.no_clean_water_count)}</div>
                                    <div className="text-xs text-sky-800 mt-1">Indikator akses air minum tidak layak</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Potensi Rumah Tidak Layak Huni</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{formatNumber(data.rtlh_count)}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Sewa/menumpang atau kondisi fisik buruk</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Keluarga Tanpa Jamban Pribadi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{formatNumber(data.no_latrine_count)}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Menggunakan fasilitas umum atau tidak ada</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Keluarga Risiko Tinggi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">Lansia tunggal</div>
                                        <div className="font-semibold">{formatNumber(data.elderly_single_count)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">Miskin dengan balita</div>
                                        <div className="font-semibold">{formatNumber(data.poor_with_toddler_count)}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-base">Distribusi Pendapatan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {Object.entries(data.income_distribution || {}).map(([label, value]) => (
                                        <div key={label} className="flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground">{label}</div>
                                            <div className="font-semibold">{formatNumber(value)}</div>
                                        </div>
                                    ))}
                                    <div className="text-xs text-muted-foreground mt-2">Estimasi pengeluaran per bulan.</div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-base">Pekerjaan Keluarga Miskin (Top)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {toTopEntries(data.job_profile_poor, 10).map(([label, value]) => (
                                        <div key={label} className="flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground truncate">{label}</div>
                                            <div className="font-semibold">{formatNumber(value)}</div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-base">Pendidikan Kepala Keluarga Miskin (Top)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {toTopEntries(data.education_poor, 10).map(([label, value]) => (
                                        <div key={label} className="flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground truncate">{label}</div>
                                            <div className="font-semibold">{formatNumber(value)}</div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Perbandingan Pendapatan (Miskin vs Mampu)</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(data.income_comparison || {}).map(([label, value]) => (
                                    <div key={label} className="rounded-lg border p-4">
                                        <div className="text-xs text-muted-foreground line-clamp-2">{label}</div>
                                        <div className="text-2xl font-bold mt-2">{formatNumber(value)}</div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

