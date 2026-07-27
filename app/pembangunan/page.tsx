"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Hammer,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    CheckCircle,
    Clock,
    Camera,
    Search,
    TrendingUp,
    Building,
    Target,
    ImageIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PembangunanDataLoading } from "@/components/ui/custom/PembangunanDataLoading";
import { PembangunanDataNotAvailable } from "@/components/ui/custom/PembangunanDataNotAvailable";

const hasRealFoto = (fotoUrl: string): boolean => {
    if (!fotoUrl) return false;
    try {
        if (fotoUrl.startsWith("http://") || fotoUrl.startsWith("https://")) {
            const url = new URL(fotoUrl);
            const path = url.searchParams.get("path");
            if (url.pathname.includes("storage-desa")) {
                return !!(path && path.trim() !== "" && !path.includes("404-image-not-found"));
            }
        }
        return !fotoUrl.includes("404-image-not-found");
    } catch (e) {
        return !fotoUrl.includes("404-image-not-found");
    }
};

interface PembangunanProject {
    type: string;
    id: string;
    attributes: {
        config_id: number;
        id_lokasi: number | null;
        sumber_dana: string;
        judul: string;
        slug: string;
        keterangan: string;
        lokasi: string;
        lat: string | null;
        lng: string | null;
        volume: string;
        tahun_anggaran: string;
        pelaksana_kegiatan: string;
        status: number;
        created_at: string;
        updated_at: string;
        foto: string;
        anggaran: number;
        perubahan_anggaran: number;
        sumber_biaya_pemerintah: number;
        sumber_biaya_provinsi: number;
        sumber_biaya_kab_kota: number;
        sumber_biaya_swadaya: number;
        sumber_biaya_jumlah: number;
        manfaat: string;
        waktu: number;
        satuan_waktu: number;
        sifat_proyek: string;
        pembangunan_dokumentasi: Array<{
            id: number;
            config_id: number;
            id_pembangunan: number;
            gambar: string;
            persentase: string;
            keterangan: string;
            created_at: string;
            updated_at: string;
        }>;
        alamat: string;
        lokasi_lengkap: string;
        wilayah: {
            id: number;
            config_id: number;
            rt: string;
            rw: string;
            dusun: string;
            [key: string]: unknown;
        } | null;
    };
}

interface ApiResponse {
    data: PembangunanProject[];
    meta: {
        pagination: {
            total: number;
            count: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    };
    links: {
        self: string;
        first: string;
        last: string;
    };
}

export default function PembangunanPage() {
    const [projects, setProjects] = useState<PembangunanProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
    const [selectedProject, setSelectedProject] = useState<PembangunanProject | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/pembangunan");
            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }
            const data: ApiResponse = await response.json();
            setProjects(data.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Gagal memuat data pembangunan");
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.attributes.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.attributes.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === null || project.attributes.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: number) => {
        if (status === 1) {
            return <Badge className="bg-green-600 hover:bg-green-700">Selesai</Badge>;
        }
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Berjalan</Badge>;
    };

    const getStatusColor = (status: number) => {
        if (status === 1) return "text-green-600";
        return "text-yellow-600";
    };

    const getStatusIcon = (status: number) => {
        if (status === 1) return <CheckCircle className="h-5 w-5 text-green-600" />;
        return <Clock className="h-5 w-5 text-yellow-600" />;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getLatestProgress = (dokumentasi: Array<{ persentase: string }>) => {
        if (!dokumentasi || dokumentasi.length === 0) return "0%";
        const sorted = [...dokumentasi].sort((a, b) => parseInt(b.persentase) - parseInt(a.persentase));
        return sorted[0].persentase;
    };

    const totalAnggaran = projects.reduce((sum, p) => sum + p.attributes.anggaran, 0);
    const completedProjects = projects.filter((p) => p.attributes.status === 1).length;
    const ongoingProjects = projects.filter((p) => p.attributes.status !== 1).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4 space-y-8">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
                            <Hammer className="h-10 w-10 text-orange-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">Pembangunan Kalurahan</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Informasi lengkap mengenai proyek pembangunan infrastruktur dan kemajuan Kalurahan
                            Pondokrejo
                        </p>
                    </div>
                    <PembangunanDataLoading />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4 space-y-8">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
                            <Hammer className="h-10 w-10 text-orange-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">Pembangunan Kalurahan</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Informasi lengkap mengenai proyek pembangunan infrastruktur dan kemajuan Kalurahan
                            Pondokrejo
                        </p>
                    </div>
                    <PembangunanDataNotAvailable onRetry={fetchProjects} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
                        <Hammer className="h-10 w-10 text-orange-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Pembangunan Kalurahan</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Informasi lengkap mengenai proyek pembangunan infrastruktur dan kemajuan Kalurahan Pondokrejo
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Proyek */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-orange-100 to-orange-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-orange-600">
                            <Building className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Total Proyek
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-orange-900 mb-2">{projects.length}</div>
                            <p className="text-xs text-orange-700">Proyek pembangunan aktif</p>
                        </CardContent>
                    </Card>

                    {/* Selesai */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-emerald-100 to-emerald-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-emerald-600">
                            <CheckCircle className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Selesai
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-emerald-900 mb-2">{completedProjects}</div>
                            <Badge className="text-xs bg-emerald-600/20 text-emerald-800 border-emerald-700/30">
                                {completedProjects > 0 ? "Selesai" : "Belum ada"}
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Berjalan */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-yellow-100 to-yellow-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-yellow-600">
                            <Clock className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Berjalan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-yellow-900 mb-2">{ongoingProjects}</div>
                            <Badge className="text-xs bg-yellow-600/20 text-yellow-800 border-yellow-700/30">
                                Dalam progress
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Total Anggaran */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                            <DollarSign className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Total Anggaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-bold text-blue-900 mb-2">{formatCurrency(totalAnggaran)}</div>
                            <p className="text-xs text-blue-700">Dari semua proyek</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari berdasarkan judul atau lokasi..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedStatus === null ? "default" : "outline"}
                                    onClick={() => setSelectedStatus(null)}
                                    size="sm"
                                    className={cn(
                                        "transition-colors",
                                        selectedStatus === null ? "bg-orange-600 hover:bg-orange-700 text-white" : ""
                                    )}
                                >
                                    Semua
                                </Button>
                                <Button
                                    variant={selectedStatus === 1 ? "default" : "outline"}
                                    onClick={() => setSelectedStatus(1)}
                                    size="sm"
                                    className={cn(
                                        "transition-colors",
                                        selectedStatus === 1 ? "bg-green-600 hover:bg-green-700 text-white" : ""
                                    )}
                                >
                                    Selesai
                                </Button>
                                <Button
                                    variant={selectedStatus === 0 ? "default" : "outline"}
                                    onClick={() => setSelectedStatus(0)}
                                    size="sm"
                                    className={cn(
                                        "transition-colors",
                                        selectedStatus === 0 ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""
                                    )}
                                >
                                    Berjalan
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <PembangunanDataNotAvailable onRetry={fetchProjects} />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => {
                            const attrs = project.attributes;
                            const progress = getLatestProgress(attrs.pembangunan_dokumentasi);
                            const progressValue = parseInt(progress);

                            return (
                                <Card
                                    key={project.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className="relative h-48 bg-linear-to-br from-gray-100 to-gray-200">
                                        {hasRealFoto(attrs.foto) ? (
                                            <Image
                                                src={attrs.foto}
                                                alt={attrs.judul}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Building className="h-16 w-16 text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">{getStatusBadge(attrs.status)}</div>
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {progress} Selesai
                                            </span>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg line-clamp-2">{attrs.judul}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                                <span className="line-clamp-2">{attrs.alamat || attrs.lokasi}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>Tahun {attrs.tahun_anggaran}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <DollarSign className="h-4 w-4" />
                                                <span className="font-medium">{formatCurrency(attrs.anggaran)}</span>
                                            </div>

                                            {attrs.pembangunan_dokumentasi &&
                                                attrs.pembangunan_dokumentasi.length > 0 && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Camera className="h-4 w-4" />
                                                        <span>{attrs.pembangunan_dokumentasi.length} Dokumentasi</span>
                                                    </div>
                                                )}

                                            <div className="pt-2">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className={`font-medium ${getStatusColor(attrs.status)}`}>
                                                        {progress}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={progressValue}
                                                    className={cn(
                                                        "h-2",
                                                        attrs.status === 1
                                                            ? "[&>div]:bg-green-600"
                                                            : "[&>div]:bg-yellow-500"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Project Detail Modal */}
                {selectedProject && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Detail Proyek</h2>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedProject(null)}
                                    className="rounded-full"
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">
                                                {selectedProject.attributes.judul}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(selectedProject.attributes.status)}
                                                {getStatusIcon(selectedProject.attributes.status)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="h-5 w-5" />
                                                <span>
                                                    {selectedProject.attributes.alamat ||
                                                        selectedProject.attributes.lokasi}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-5 w-5" />
                                                <span>Tahun Anggaran: {selectedProject.attributes.tahun_anggaran}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="h-5 w-5" />
                                                <span>Pelaksana: {selectedProject.attributes.pelaksana_kegiatan}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <DollarSign className="h-5 w-5" />
                                                <span className="font-semibold text-lg">
                                                    {formatCurrency(selectedProject.attributes.anggaran)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Target className="h-5 w-5" />
                                                <span>Volume: {selectedProject.attributes.volume}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <TrendingUp className="h-5 w-5" />
                                                <span>Sifat: {selectedProject.attributes.sifat_proyek}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedProject.attributes.keterangan && (
                                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                            <h4 className="font-semibold mb-2">Deskripsi Proyek</h4>
                                            <p className="text-gray-700">{selectedProject.attributes.keterangan}</p>
                                        </div>
                                    )}

                                    {selectedProject.attributes.manfaat && (
                                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                            <h4 className="font-semibold mb-2">Manfaat</h4>
                                            <p className="text-gray-700">{selectedProject.attributes.manfaat}</p>
                                        </div>
                                    )}

                                    {/* Budget Breakdown */}
                                    <div className="bg-linear-to-br from-orange-50 to-blue-50 p-4 rounded-lg mb-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Sumber Anggaran
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedProject.attributes.sumber_biaya_pemerintah > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                                                        <span className="text-gray-700">Pemerintah:</span>
                                                    </div>
                                                    <span className="font-semibold text-blue-900">
                                                        {formatCurrency(
                                                            selectedProject.attributes.sumber_biaya_pemerintah
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedProject.attributes.sumber_biaya_provinsi > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                                                        <span className="text-gray-700">Provinsi:</span>
                                                    </div>
                                                    <span className="font-semibold text-emerald-900">
                                                        {formatCurrency(
                                                            selectedProject.attributes.sumber_biaya_provinsi
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedProject.attributes.sumber_biaya_kab_kota > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-violet-600" />
                                                        <span className="text-gray-700">Kab/Kota:</span>
                                                    </div>
                                                    <span className="font-semibold text-violet-900">
                                                        {formatCurrency(
                                                            selectedProject.attributes.sumber_biaya_kab_kota
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedProject.attributes.sumber_biaya_swadaya > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-amber-600" />
                                                        <span className="text-gray-700">Swadaya:</span>
                                                    </div>
                                                    <span className="font-semibold text-amber-900">
                                                        {formatCurrency(
                                                            selectedProject.attributes.sumber_biaya_swadaya
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                                                <span>Total Anggaran:</span>
                                                <span className="text-orange-900">
                                                    {formatCurrency(selectedProject.attributes.anggaran)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Documentation */}
                                {selectedProject.attributes.pembangunan_dokumentasi &&
                                    selectedProject.attributes.pembangunan_dokumentasi.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <ImageIcon className="h-5 w-5" />
                                                Dokumentasi Progress
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {selectedProject.attributes.pembangunan_dokumentasi
                                                    .sort((a, b) => parseInt(b.persentase) - parseInt(a.persentase))
                                                    .map((doc) => {
                                                        const docProgress = parseInt(doc.persentase);
                                                        return (
                                                            <div
                                                                key={doc.id}
                                                                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                                            >
                                                                <div className="relative h-48 bg-gray-100">
                                                                    <Image
                                                                        src={doc.gambar}
                                                                        alt={`Progress ${doc.persentase}`}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                    />
                                                                    <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                                        {doc.persentase}
                                                                    </div>
                                                                </div>
                                                                <div className="p-4">
                                                                    <div className="mb-3">
                                                                        <Progress value={docProgress} className="h-2" />
                                                                    </div>
                                                                    {doc.keterangan && (
                                                                        <p className="text-sm text-gray-600 mb-2">
                                                                            {doc.keterangan}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-xs text-gray-500">
                                                                        {new Date(doc.created_at).toLocaleDateString(
                                                                            "id-ID",
                                                                            {
                                                                                year: "numeric",
                                                                                month: "long",
                                                                                day: "numeric",
                                                                            }
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
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
