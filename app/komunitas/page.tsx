"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type KomunitasPopular = {
    name: string;
    category: string;
    description: string;
    url: string;
};

type KomunitasEvent = {
    title: string;
    community: string;
    description: string;
    dateTimeText: string;
    location: string;
    url: string;
};

type Payload = {
    popular: KomunitasPopular[];
    events: KomunitasEvent[];
    fetchedAt: string;
};

type ApiResponse = { success: true; data: Payload } | { success: false; error: string };

export default function KomunitasPage() {
    const [data, setData] = React.useState<Payload | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/komunitas/home", { method: "GET" });
            const json = (await res.json()) as ApiResponse;
            if (!json.success) {
                throw new Error(json.error || "Gagal memuat data Komunitas");
            }
            setData(json.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat data Komunitas");
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
                        <Users className="h-10 w-10 text-purple-700" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Komunitas</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Wadah digital terpadu bagi komunitas warga Kalurahan Pondokrejo untuk berkolaborasi dan berkembang.
                    </p>
                    <p className="text-xs text-muted-foreground">Sumber data: komunitas.pondokrejo.id</p>
                </div>

                {loading && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader className="pb-3">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader className="pb-3">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <Users className="h-12 w-12 text-gray-400 mx-auto" />
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
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Komunitas Populer</h2>
                                    <p className="text-sm text-muted-foreground">Temukan komunitas sesuai minat dan bakat.</p>
                                </div>
                                <a
                                    href="https://komunitas.pondokrejo.id/komunitas"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:block"
                                >
                                    <Button variant="outline">Lihat Semua</Button>
                                </a>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {data.popular.map((c) => (
                                    <Link
                                        key={c.url}
                                        href={`/komunitas/${c.url.split('/').pop()}`}
                                        className="block"
                                    >
                                        <Card className="hover:shadow-md transition h-full">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">{c.name}</CardTitle>
                                                <div className="text-xs text-muted-foreground">{c.category}</div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-600 line-clamp-3">{c.description || "—"}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                            <a
                                href="https://komunitas.pondokrejo.id/komunitas"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sm:hidden block"
                            >
                                <Button variant="outline" className="w-full">
                                    Lihat Semua Komunitas
                                </Button>
                            </a>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Kegiatan Terdekat</h2>
                                    <p className="text-sm text-muted-foreground">Jangan lewatkan kegiatan-kegiatan komunitas.</p>
                                </div>
                                <a
                                    href="https://komunitas.pondokrejo.id/kegiatan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:block"
                                >
                                    <Button variant="outline">Lihat Semua</Button>
                                </a>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.events.map((e) => (
                                    <a key={`${e.title}-${e.dateTimeText}`} href={e.url} target="_blank" rel="noopener noreferrer" className="block">
                                        <Card className="hover:shadow-md transition h-full">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base line-clamp-2">{e.title}</CardTitle>
                                                <div className="text-xs text-muted-foreground">{e.community}</div>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <p className="text-sm text-gray-600 line-clamp-3">{e.description || "—"}</p>
                                                <div className="pt-1 space-y-1 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4" />
                                                        <span className="line-clamp-1">{e.dateTimeText}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="line-clamp-1">{e.location}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                            <a
                                href="https://komunitas.pondokrejo.id/kegiatan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sm:hidden block"
                            >
                                <Button variant="outline" className="w-full">
                                    Lihat Semua Kegiatan
                                </Button>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
