"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Bell,
    ChevronDown,
    User,
    Info,
    Home,
    Cpu,
    Building2,
    BarChart3,
    FileText,
    Globe,
    MessageSquare,
    BookCheck,
    Newspaper,
    Users,
    Heart,
    Shield,
    CreditCard,
    GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/useTranslation";
import { Logo, LogoVariant } from "@/components/ui/custom/Logo";

export function Header() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const mainNavItems = [
        { href: "/", label: t("navigation.beranda"), icon: Home },
        { href: "/pemerintahan", label: t("navigation.pemerintahan"), icon: Building2 },
        { href: "/informasi", label: "Informasi", icon: Newspaper },
        { href: "/statistik", label: "Statistik", icon: BarChart3 },
        { href: "/ppid", label: "PPID", icon: BookCheck },
        { href: "/idm", label: "IDM", icon: FileText },
        { href: "/sdgs", label: "SDGs", icon: Globe },
        { href: "/iot", label: "IoT", icon: Cpu },
        { href: "/pengaduan", label: t("navigation.pengaduan"), icon: MessageSquare },
    ];

    const pemerintahanSubItems = [
        { href: "/profil", label: t("navigation.profilDesa") },
        { href: "/wilayah-administratif", label: "Wilayah Administratif" },
        { href: "/keuangan", label: t("navigation.keuangan") },
        { href: "/pembangunan", label: t("navigation.pembangunan") },
        { href: "/bumdes", label: t("navigation.bumdes") },
    ];

    const informasiSubItems = [
        { href: "/berita", label: t("navigation.berita") },
        { href: "/pengumuman", label: "Pengumuman" },
        { href: "/kegiatan", label: t("navigation.kegiatan") },
    ];

    // Categorized statistik sub-items
    const statistikCategories = [
        {
            category: "Demografi",
            icon: Users,
            items: [
                { href: "/statistik/penduduk", label: "Penduduk" },
                { href: "/statistik/umur", label: "Umur" },
                { href: "/statistik/kelompok-usia", label: "Kelompok Usia" },
                { href: "/statistik/hubungan-dalam-kk", label: "Hubungan Dalam KK" },
                { href: "/statistik/kewarganegaraan", label: "Kewarganegaraan" },
                { href: "/statistik/etnis", label: "Etnis" },
                { href: "/statistik/kelas-sosial", label: "Kelas Sosial" },
            ],
        },
        {
            category: "Pendidikan",
            icon: GraduationCap,
            items: [
                { href: "/statistik/pendidikan", label: "Kelompok Pendidikan" },
                { href: "/statistik/pendidikan-ditempuh", label: "Pendidikan Ditempuh" },
            ],
        },
        {
            category: "Kesehatan & KB",
            icon: Heart,
            items: [
                { href: "/statistik/stunting", label: "Stunting" },
                { href: "/statistik/hamil", label: "Ibu Hamil" },
                { href: "/statistik/kontrasepsi-kb", label: "Kontrasepsi/KB" },
                { href: "/statistik/disabilitas", label: "Disabilitas" },
                { href: "/statistik/penyakit", label: "Sakit/Penyakit" },
            ],
        },
        {
            category: "Pernikahan & Keluarga",
            icon: Heart,
            items: [
                { href: "/statistik/perkawinan", label: "Perkawinan" },
                { href: "/statistik/buku-nikah", label: "Buku Nikah" },
                { href: "/statistik/kepemilikan-akta-kematian", label: "Kepemilikan Akta Kematian" },
            ],
        },
        {
            category: "Sosial & Bantuan",
            icon: Heart,
            items: [
                { href: "/statistik/penerima-bantuan-penduduk", label: "Penerima Bantuan Penduduk" },
                { href: "/statistik/penerima-bantuan-keluarga", label: "Penerima Bantuan Keluarga" },
                { href: "/statistik/bdt", label: "BDT" },
            ],
        },
        {
            category: "Administrasi",
            icon: CreditCard,
            items: [
                { href: "/statistik/ktp-elektronik", label: "KTP Elektronik" },
                { href: "/statistik/kepemilikan-kia", label: "Kepemilikan KIA" },
                { href: "/statistik/dpt", label: "DPT" },
            ],
        },
        {
            category: "Jaminan Sosial",
            icon: Shield,
            items: [
                { href: "/statistik/bpjs", label: "BPJS" },
                { href: "/statistik/bpjs-ketenagakerjaan", label: "BPJS Ketenagakerjaan" },
            ],
        },
        {
            category: "Lainnya",
            icon: FileText,
            items: [
                { href: "/statistik/agama", label: "Agama" },
                { href: "/statistik/pekerjaan", label: "Pekerjaan" },
            ],
        },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality
            // TODO: Implement actual search functionality
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="bg-[#39a2cf] text-white fixed top-0 left-0 right-0 z-50 transition-transform duration-300">
            {/* Top Header Bar */}
            <div
                className={`border-b border-[#10244f]/30 bg-[#1279a7] transition-opacity duration-300 ${
                    isScrolled ? "opacity-0 h-0" : "opacity-100 h-16"
                } overflow-hidden`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section - Left Side */}
                        <div className="flex items-center flex-shrink-0">
                            <Link
                                href="/"
                                className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <Logo {...LogoVariant.light} size={40} />
                                <div className="hidden sm:block">
                                    <h1 className="text-lg font-bold text-white">Kalurahan Pondokrejo</h1>
                                    <p className="text-xs text-[#ddf0ff]">Kabupaten Sleman, DIY</p>
                                </div>
                                <div className="block sm:hidden">
                                    <h1 className="text-lg font-bold text-white">Pondokrejo</h1>
                                    <p className="text-xs text-[#ddf0ff]">Kabupaten Sleman</p>
                                </div>
                            </Link>
                        </div>

                        {/* Search Bar - Center with flexible space */}
                        <div className="hidden lg:flex flex-1 justify-center px-6">
                            <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
                                <Input
                                    type="search"
                                    placeholder={t("navigation.cari")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 bg-white/10 border-[#7487af]/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-[#0a4661]/40"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                                <Button
                                    type="submit"
                                    className="absolute right-0 top-0 bottom-0 px-3 rounded-l-none h-auto bg-[#0a4661] hover:bg-[#115c93] text-white"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Right Section - Right Side */}
                        <div className="flex items-center flex-shrink-0 space-x-4">
                            {/* Mobile Search Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-white hover:bg-[#2a77a7]! hover:text-white! cursor-pointer"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* Notifications */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative text-white hover:text-white! hover:bg-[#2a77a7]! cursor-pointer"
                                    >
                                        <Bell className="h-5 w-5" />
                                        <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-[#f87171] text-white text-xs rounded-full p-0 flex items-center justify-center">
                                            3
                                        </Badge>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuItem className="flex items-center justify-between data-highlighted:bg-[#2a77a7] data-highlighted:text-white">
                                        <span>Pengumuman Baru</span>
                                        <Badge variant="destructive">Baru</Badge>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center justify-between data-highlighted:bg-[#2a77a7] data-highlighted:text-white">
                                        <span>Update APBDes</span>
                                        <Badge variant="secondary">Info</Badge>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center justify-between data-highlighted:bg-[#2a77a7] data-highlighted:text-white">
                                        <span>Jadwal Kegiatan</span>
                                        <Badge variant="outline">Reminder</Badge>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="data-highlighted:bg-[#2a77a7] data-highlighted:text-white">
                                        <Link href="/notifikasi" className="w-full cursor-pointer">
                                            Lihat Semua Notifikasi
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Account */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:text-white! hover:bg-[#2a77a7]! cursor-pointer px-0! ml-4! sm:ml-0!"
                                    >
                                        <Info className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">Info</span>
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-96">
                                    <DropdownMenuItem className="data-highlighted:bg-[#2a77a7] data-highlighted:text-white" disabled>
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                Portal ini merupakan penampil konten dari berbagai layanan via API.
                                            </p>
                                            <p className="text-sm">
                                                Tidak tersedia akun, dasbor, atau fitur login publik.
                                            </p>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                {isSearchOpen && (
                    <div className="lg:hidden border-t border-[#10244f]/30 p-4">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Input
                                type="search"
                                placeholder={t("navigation.cari")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 bg-white/10 border-[#7487af]/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-[#0a4661]/40"
                                autoFocus
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                            <Button
                                type="submit"
                                className="absolute right-0 top-0 bottom-0 px-3 rounded-l-none h-auto bg-[#0a4661] hover:bg-[#115c93] text-white"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </div>

            {/* Main Navigation - Desktop */}
            <nav className="hidden lg:block border-b border-[#10244f]/30">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center space-x-1 h-12">
                        {/* Main Navigation Items */}
                        {mainNavItems.map((item) => {
                            // Check if this item should have a dropdown
                            const isPemerintahanItem = item.href === "/pemerintahan";
                            const isInformasiItem = item.href === "/informasi";
                            const isStatistikItem = item.href === "/statistik";
                            const IconComponent = item.icon;

                            if (isPemerintahanItem) {
                                // Render as dropdown for pemerintahan sub-items
                                return (
                                    <DropdownMenu key={item.href}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="px-4! py-2! text-sm! text-white! bg-transparent! hover:bg-[#2a77a7]! hover:text-white! data-[state=open]:bg-[#2a77a7]! data-[state=open]:text-white! rounded-md transition-colors cursor-pointer h-auto"
                                            >
                                                <IconComponent className="h-4 w-4 mr-2" />
                                                <span>{item.label}</span>
                                                <ChevronDown className="h-4 w-4 ml-1" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-full">
                                            {pemerintahanSubItems.map((subItem) => (
                                                <DropdownMenuItem key={subItem.href} asChild>
                                                    <Link
                                                        href={subItem.href}
                                                        className="w-full cursor-pointer data-highlighted:bg-[#2a77a7] data-highlighted:text-white"
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }

                            if (isInformasiItem) {
                                // Render as dropdown for informasi sub-items
                                return (
                                    <DropdownMenu key={item.href}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="px-4! py-2! text-sm! text-white! bg-transparent! hover:bg-[#2a77a7]! hover:text-white! data-[state=open]:bg-[#2a77a7]! data-[state=open]:text-white! rounded-md transition-colors cursor-pointer h-auto"
                                            >
                                                <IconComponent className="h-4 w-4 mr-2" />
                                                <span>{item.label}</span>
                                                <ChevronDown className="h-4 w-4 ml-1" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-full">
                                            {informasiSubItems.map((subItem) => (
                                                <DropdownMenuItem key={subItem.href} asChild>
                                                    <Link
                                                        href={subItem.href}
                                                        className="w-full cursor-pointer data-highlighted:bg-[#2a77a7] data-highlighted:text-white"
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }

                            if (isStatistikItem) {
                                // Render as dropdown for statistik sub-items
                                return (
                                    <DropdownMenu key={item.href}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="px-4! py-2! text-sm! text-white! bg-transparent! hover:bg-[#2a77a7]! hover:text-white! data-[state=open]:bg-[#2a77a7]! data-[state=open]:text-white! rounded-md transition-colors cursor-pointer h-auto"
                                            >
                                                <IconComponent className="h-4 w-4 mr-2" />
                                                <span>{item.label}</span>
                                                <ChevronDown className="h-4 w-4 ml-1" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-full">
                                            {statistikCategories.map((category) => {
                                                const CategoryIcon = category.icon;
                                                return (
                                                    <DropdownMenuSub key={category.category}>
                                                        <DropdownMenuSubTrigger>
                                                            <CategoryIcon className="h-4 w-4 mr-2" />
                                                            {category.category}
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent alignOffset={-4}>
                                                            {category.items.map((subItem) => (
                                                                <DropdownMenuItem key={subItem.href} asChild>
                                                                    <Link
                                                                        href={subItem.href}
                                                                        className="w-full cursor-pointer data-highlighted:bg-[#2a77a7] data-highlighted:text-white"
                                                                    >
                                                                        {subItem.label}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }

                            // Render as regular link
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-2 text-sm text-white hover:bg-[#2a77a7] hover:text-white! rounded-md transition-colors cursor-pointer flex items-center"
                                >
                                    <IconComponent className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </header>
    );
}
