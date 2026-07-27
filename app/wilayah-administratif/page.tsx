"use client";

import { useState, useEffect } from "react";
import { Map, MapPin, Users, Home, ChevronRight, Search, Building2, Users2, UserCheck, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { WilayahDataLoading } from "@/components/ui/custom/WilayahDataLoading";
import { WilayahDataNotAvailable } from "@/components/ui/custom/WilayahDataNotAvailable";

interface Kepala {
    nik: string;
    nama: string;
    id: number;
    pendidikan: unknown;
    pendidikanKK: unknown;
    usia: string;
    alamat_wilayah: string;
    alamat_wilayah_kartu_keluarga: string;
    [key: string]: unknown;
}

interface RT {
    id: number;
    config_id: number;
    rt: string;
    rw: string;
    dusun: string;
    keluarga_aktif_count: number;
    penduduk_pria_count: number;
    penduduk_wanita_count: number;
    sebutan_rt: string;
    kepala_nama: string;
    penduduk_pria_wanita_count: number;
    kepala: Kepala | null;
    [key: string]: unknown;
}

interface RW {
    id: number;
    config_id: number;
    rt: string;
    rw: string;
    dusun: string;
    rts: RT[];
    [key: string]: unknown;
}

interface WilayahAdministratif {
    type: string;
    id: string;
    attributes: {
        config_id: number;
        rt: string;
        rw: string;
        dusun: string;
        id_kepala: number | null;
        lat: null;
        lng: null;
        zoom: number;
        path: null;
        map_tipe: null;
        warna: null;
        border: null;
        urut: number | null;
        urut_cetak: number | null;
        rts_count: number;
        rws_count: number;
        keluarga_aktif_count: number;
        penduduk_pria_count: number;
        penduduk_wanita_count: number;
        sebutan_dusun: string;
        kepala_nama: string;
        penduduk_pria_wanita_count: number;
        kepala: Kepala | null;
        rws: RW[];
        [key: string]: unknown;
    };
}

interface ApiResponse {
    data: WilayahAdministratif[];
}

const getDusunImage = (dusunName: string): string => {
    const images: Record<string, string> = {
        "Balan": "/uploads/balan.jpg",
        "Banjarharjo": "/uploads/banjarharjo.jpeg",
        "Dukuh": "/uploads/dukuh.jpeg",
        "Glagahombo": "/uploads/glagahombo.jpeg",
        "Jlapan": "/uploads/jlapan.jpg",
        "Jlopo": "/uploads/jlopo.jpeg",
        "Karanglo": "/uploads/karanglo.jpeg",
        "Ngentak": "/uploads/ngentak.png",
        "Plotengan": "/uploads/plotengan.jpeg",
        "Watupecah": "/uploads/watupecah.jpeg",
        "Mlesen": "/uploads/mlesen.jpg",
        "Badalan": "/uploads/badalan.jpeg",
        "Jenengan": "/uploads/jenengan.jpg",
    };
    return images[dusunName] || "/uploads/sliders/desa.avif";
};

export default function WilayahAdministratifPage() {
    const [wilayahData, setWilayahData] = useState<WilayahAdministratif[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDusun, setSelectedDusun] = useState<WilayahAdministratif | null>(null);

    useEffect(() => {
        fetchWilayahData();
    }, []);

    const fetchWilayahData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/wilayah");
            if (!response.ok) {
                throw new Error("Failed to fetch wilayah data");
            }
            const data: ApiResponse = await response.json();
            setWilayahData(data.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching wilayah data:", err);
            setError("Gagal memuat data wilayah administratif");
        } finally {
            setLoading(false);
        }
    };

    const filteredWilayah = wilayahData.filter((wilayah) => {
        const matchesSearch =
            wilayah.attributes.dusun.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wilayah.attributes.sebutan_dusun.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wilayah.attributes.kepala_nama.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalDusun = wilayahData.length;
    const totalRW = wilayahData.reduce((sum, w) => sum + w.attributes.rws_count, 0);
    const totalRT = wilayahData.reduce((sum, w) => sum + w.attributes.rts_count, 0);
    const totalKeluarga = wilayahData.reduce((sum, w) => sum + w.attributes.keluarga_aktif_count, 0);
    const totalPenduduk = wilayahData.reduce((sum, w) => sum + w.attributes.penduduk_pria_wanita_count, 0);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("id-ID").format(num);
    };

    const getGenderRatio = (pria: number, wanita: number) => {
        const total = pria + wanita;
        if (total === 0) return 0;
        return (pria / total) * 100;
    };

    const cleanKepalaName = (kepalaNama: string) => {
        if (!kepalaNama) return "";

        // Remove common prefixes like ", ketua ", "ketua ", ", kepala ", "kepala "
        return kepalaNama
            .replace(/^,?\s*(ketua|kepala)\s+/i, "")
            .replace(/^,\s*/, "")
            .trim();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4 space-y-8">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                            <Map className="h-10 w-10 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">Wilayah Administratif</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Informasi lengkap mengenai wilayah administratif Kalurahan Pondokrejo
                        </p>
                    </div>
                    <WilayahDataLoading />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4 space-y-8">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                            <Map className="h-10 w-10 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">Wilayah Administratif</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Informasi lengkap mengenai wilayah administratif Kalurahan Pondokrejo
                        </p>
                    </div>
                    <WilayahDataNotAvailable onRetry={fetchWilayahData} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                        <Map className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Wilayah Administratif</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Informasi lengkap mengenai wilayah administratif Kalurahan Pondokrejo
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Total Dusun */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                            <MapPin className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Dusun
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-blue-900 mb-2">{totalDusun}</div>
                            <p className="text-xs text-blue-700">Total padukuhan</p>
                        </CardContent>
                    </Card>

                    {/* Total RW */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-green-100 to-green-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-green-600">
                            <Building2 className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                RW
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-green-900 mb-2">{totalRW}</div>
                            <p className="text-xs text-green-700">Rukun Warga</p>
                        </CardContent>
                    </Card>

                    {/* Total RT */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-yellow-100 to-yellow-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-yellow-600">
                            <Home className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                RT
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-yellow-900 mb-2">{totalRT}</div>
                            <p className="text-xs text-yellow-700">Rukun Tetangga</p>
                        </CardContent>
                    </Card>

                    {/* Total Keluarga */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-purple-100 to-purple-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-purple-600">
                            <Users className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Keluarga
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-purple-900 mb-2">{formatNumber(totalKeluarga)}</div>
                            <p className="text-xs text-purple-700">Keluarga aktif</p>
                        </CardContent>
                    </Card>

                    {/* Total Penduduk */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-orange-100 to-orange-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-orange-600">
                            <Users2 className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
                                <Users2 className="h-4 w-4" />
                                Penduduk
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-orange-900 mb-2">{formatNumber(totalPenduduk)}</div>
                            <p className="text-xs text-orange-700">Total penduduk</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari berdasarkan nama dusun atau kepala dusun..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Dusun Grid */}
                {filteredWilayah.length === 0 ? (
                    <WilayahDataNotAvailable onRetry={fetchWilayahData} />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWilayah.map((dusun) => {
                            const attrs = dusun.attributes;
                            const genderRatio = getGenderRatio(attrs.penduduk_pria_count, attrs.penduduk_wanita_count);

                            return (
                                <Card
                                    key={dusun.id}
                                    className="overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 cursor-pointer pt-0 flex flex-col h-full bg-white group rounded-xl"
                                    onClick={() => setSelectedDusun(dusun)}
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img 
                                            src={getDusunImage(attrs.dusun)} 
                                            alt={attrs.dusun}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge className="bg-blue-600/90 text-white font-medium border-0 px-2.5 py-0.5 rounded-md">
                                                {attrs.sebutan_dusun}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs">
                                            <span className="text-xs font-semibold text-gray-900">
                                                {attrs.rws_count} RW, {attrs.rts_count} RT
                                            </span>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg line-clamp-2">{attrs.dusun}</CardTitle>
                                        {attrs.kepala_nama && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <UserCheck className="h-4 w-4" />
                                                <span>Kepala: {cleanKepalaName(attrs.kepala_nama)}</span>
                                            </div>
                                        )}
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Home className="h-4 w-4" />
                                                    <span>Keluarga</span>
                                                </div>
                                                <span className="font-medium">
                                                    {formatNumber(attrs.keluarga_aktif_count)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Users2 className="h-4 w-4" />
                                                    <span>Penduduk</span>
                                                </div>
                                                <span className="font-medium">
                                                    {formatNumber(attrs.penduduk_pria_wanita_count)}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Rasio Gender</span>
                                                    <span className="font-medium text-blue-600">
                                                        {genderRatio.toFixed(1)}% Pria
                                                    </span>
                                                </div>
                                                <Progress value={genderRatio} className="h-2 [&>div]:bg-blue-600" />
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Pria: {formatNumber(attrs.penduduk_pria_count)}</span>
                                                    <span>Wanita: {formatNumber(attrs.penduduk_wanita_count)}</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">RW: {attrs.rws_count}</span>
                                                    <span className="text-xs text-gray-500">RT: {attrs.rts_count}</span>
                                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Dusun Detail Modal */}
                {selectedDusun && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto overflow-hidden">
                            <div className="relative h-64 w-full overflow-hidden">
                                <img 
                                    src={getDusunImage(selectedDusun.attributes.dusun)} 
                                    alt={selectedDusun.attributes.dusun}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute bottom-4 left-6 z-10 text-white">
                                    <Badge className="bg-blue-600/90 text-white font-medium mb-2 border-0">
                                        {selectedDusun.attributes.sebutan_dusun}
                                    </Badge>
                                    <h3 className="text-3xl font-bold">
                                        {selectedDusun.attributes.dusun}
                                    </h3>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setSelectedDusun(null)} 
                                    className="absolute top-4 right-4 rounded-full bg-black/40 hover:bg-black/60 text-white! h-10 w-10 p-0 flex items-center justify-center cursor-pointer z-20 border-0"
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">

                                    {selectedDusun.attributes.kepala_nama && (
                                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <UserCheck className="h-5 w-5" />
                                                Kepala {selectedDusun.attributes.sebutan_dusun}
                                            </h4>
                                            <p className="text-gray-700">
                                                {cleanKepalaName(selectedDusun.attributes.kepala_nama)}
                                            </p>
                                            {selectedDusun.attributes.kepala?.alamat_wilayah && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {selectedDusun.attributes.kepala.alamat_wilayah}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-blue-800 mb-2">
                                                <Building2 className="h-5 w-5" />
                                                <span className="font-medium">RW</span>
                                            </div>
                                            <div className="text-2xl font-bold text-blue-900">
                                                {selectedDusun.attributes.rws_count}
                                            </div>
                                        </div>

                                        <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-yellow-800 mb-2">
                                                <Home className="h-5 w-5" />
                                                <span className="font-medium">RT</span>
                                            </div>
                                            <div className="text-2xl font-bold text-yellow-900">
                                                {selectedDusun.attributes.rts_count}
                                            </div>
                                        </div>

                                        <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-purple-800 mb-2">
                                                <Users className="h-5 w-5" />
                                                <span className="font-medium">Keluarga</span>
                                            </div>
                                            <div className="text-2xl font-bold text-purple-900">
                                                {formatNumber(selectedDusun.attributes.keluarga_aktif_count)}
                                            </div>
                                        </div>

                                        <div className="bg-linear-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-orange-800 mb-2">
                                                <Users2 className="h-5 w-5" />
                                                <span className="font-medium">Penduduk</span>
                                            </div>
                                            <div className="text-2xl font-bold text-orange-900">
                                                {formatNumber(selectedDusun.attributes.penduduk_pria_wanita_count)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gender Distribution */}
                                    <div className="bg-linear-to-br from-green-50 to-blue-50 p-4 rounded-lg mb-4">
                                        <h4 className="font-semibold mb-3">Distribusi Penduduk</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                                    <span className="text-gray-700">Pria:</span>
                                                </div>
                                                <span className="font-semibold text-blue-900">
                                                    {formatNumber(selectedDusun.attributes.penduduk_pria_count)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-pink-600" />
                                                    <span className="text-gray-700">Wanita:</span>
                                                </div>
                                                <span className="font-semibold text-pink-900">
                                                    {formatNumber(selectedDusun.attributes.penduduk_wanita_count)}
                                                </span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                                                <span>Total:</span>
                                                <span className="text-orange-900">
                                                    {formatNumber(selectedDusun.attributes.penduduk_pria_wanita_count)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RW List */}
                                {selectedDusun.attributes.rws && selectedDusun.attributes.rws.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Eye className="h-5 w-5" />
                                            Rincian Wilayah
                                        </h4>
                                        <div className="space-y-4">
                                            {selectedDusun.attributes.rws.map((rw) => (
                                                <Card key={rw.id} className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="font-medium text-lg">RW {rw.rw}</h5>
                                                        <Badge variant="outline">{rw.rts?.length || 0} RT</Badge>
                                                    </div>

                                                    {rw.rts && rw.rts.length > 0 && (
                                                        <div className="grid md:grid-cols-2 gap-2 mt-3">
                                                            {rw.rts.map((rt) => (
                                                                <div
                                                                    key={rt.id}
                                                                    className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Home className="h-4 w-4 text-gray-500" />
                                                                        <span>RT {rt.rt}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-gray-600">
                                                                        <Users className="h-4 w-4" />
                                                                        <span>
                                                                            {formatNumber(
                                                                                rt.penduduk_pria_wanita_count
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
