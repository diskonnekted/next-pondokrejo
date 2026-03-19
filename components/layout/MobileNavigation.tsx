"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Newspaper,
    FileText,
    MessageSquare,
    Menu,
    UserCheck,
    Landmark,
    Info,
    TrendingUp,
    HardHat,
    CalendarDays,
    Store,
    BookOpen,
    Wrench,
    MessageCircle,
    BarChart3,
    Heart,
    Monitor,
    Church,
    Briefcase,
    FileCheck,
    Globe,
    Building,
    GraduationCap,
    Accessibility,
    MapPin,
    Users,
    Shield,
    CreditCard,
    ChevronRight,
    Sparkles,
} from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileNavigation() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    // Static translations to avoid hydration issues
    const translations = {
        navigation: {
            beranda: "Beranda",
            berita: "Berita",
            layanan: "Layanan",
            pengaduan: "Pengaduan",
            profilDesa: "Profil Kalurahan",
            pemerintahan: "Pemerintahan",
            informasi: "Informasi",
            keuangan: "Laporan Keuangan",
            pembangunan: "Pembangunan",
            kegiatan: "Agenda & Kegiatan",
            bumdes: "BUMDes",
            menuNavigasi: "Menu Navigasi",
        },
        lainnya: "Lainnya",
    };

    // Main 5-item bottom navigation
    const mainNavItems = [
        { href: "/", label: translations.navigation.beranda, icon: Home },
        { href: "/berita", label: translations.navigation.berita, icon: Newspaper },
        {
            href: "https://pondokrejo.sleman-desa.id/layanan-mandiri",
            label: translations.navigation.layanan,
            icon: FileText,
            external: true,
        },
        { href: "/pengaduan", label: translations.navigation.pengaduan, icon: MessageSquare },
    ];

    // Main navigation items for mobile sidebar (in same order as desktop)
    const mainSidebarNavItems = [
        { href: "/pemerintahan", label: translations.navigation.pemerintahan, icon: Landmark },
        { href: "/informasi", label: translations.navigation.informasi, icon: Info },
        { href: "/statistik", label: "Statistik", icon: BarChart3 },
        { href: "/ppid", label: "PPID", icon: FileCheck },
        { href: "/idm", label: "IDM", icon: FileText },
        { href: "/sdgs", label: "SDGs", icon: Globe },
        { href: "/iot", label: "IoT", icon: Monitor },
        { href: "/pengaduan", label: translations.navigation.pengaduan, icon: MessageSquare },
    ];

    // Additional items for sidebar
    // Categorized statistik items for mobile
    const statistikCategories = [
        {
            category: "Demografi",
            icon: Users,
            items: [
                { href: "/statistik/penduduk", label: "Penduduk", icon: BarChart3 },
                { href: "/statistik/umur", label: "Umur", icon: CalendarDays },
                { href: "/statistik/kelompok-usia", label: "Kelompok Usia", icon: BarChart3 },
                { href: "/statistik/hubungan-dalam-kk", label: "Hubungan Dalam KK", icon: Building },
                { href: "/statistik/kewarganegaraan", label: "Kewarganegaraan", icon: UserCheck },
                { href: "/statistik/etnis", label: "Etnis", icon: Globe },
                { href: "/statistik/kelas-sosial", label: "Kelas Sosial", icon: TrendingUp },
            ],
        },
        {
            category: "Pendidikan",
            icon: GraduationCap,
            items: [
                { href: "/statistik/pendidikan", label: "Kelompok Pendidikan", icon: GraduationCap },
                { href: "/statistik/pendidikan-ditempuh", label: "Pendidikan Ditempuh", icon: GraduationCap },
            ],
        },
        {
            category: "Kesehatan & KB",
            icon: Heart,
            items: [
                { href: "/statistik/stunting", label: "Stunting", icon: Heart },
                { href: "/statistik/hamil", label: "Ibu Hamil", icon: Heart },
                { href: "/statistik/kontrasepsi-kb", label: "Kontrasepsi/KB", icon: Heart },
                { href: "/statistik/disabilitas", label: "Disabilitas", icon: Accessibility },
                { href: "/statistik/penyakit", label: "Sakit/Penyakit", icon: Heart },
            ],
        },
        {
            category: "Pernikahan & Keluarga",
            icon: Heart,
            items: [
                { href: "/statistik/perkawinan", label: "Perkawinan", icon: Heart },
                { href: "/statistik/buku-nikah", label: "Buku Nikah", icon: Heart },
                { href: "/statistik/kepemilikan-akta-kematian", label: "Kepemilikan Akta Kematian", icon: FileCheck },
            ],
        },
        {
            category: "Sosial & Bantuan",
            icon: Heart,
            items: [
                { href: "/statistik/penerima-bantuan-penduduk", label: "Penerima Bantuan Penduduk", icon: Heart },
                { href: "/statistik/penerima-bantuan-keluarga", label: "Penerima Bantuan Keluarga", icon: Heart },
                { href: "/statistik/bdt", label: "BDT", icon: BarChart3 },
            ],
        },
        {
            category: "Administrasi",
            icon: CreditCard,
            items: [
                { href: "/statistik/ktp-elektronik", label: "KTP Elektronik", icon: FileCheck },
                { href: "/statistik/kepemilikan-kia", label: "Kepemilikan KIA", icon: FileCheck },
                { href: "/statistik/dpt", label: "DPT", icon: BarChart3 },
            ],
        },
        {
            category: "Jaminan Sosial",
            icon: Shield,
            items: [
                { href: "/statistik/bpjs", label: "BPJS", icon: Heart },
                { href: "/statistik/bpjs-ketenagakerjaan", label: "BPJS Ketenagakerjaan", icon: Briefcase },
            ],
        },
        {
            category: "Lainnya",
            icon: FileText,
            items: [
                { href: "/statistik/agama", label: "Agama", icon: Church },
                { href: "/statistik/pekerjaan", label: "Pekerjaan", icon: Briefcase },
            ],
        },
    ];

    const additionalSidebarNavItems = [
        { href: "/profil", label: translations.navigation.profilDesa, icon: UserCheck },
        { href: "/keuangan", label: translations.navigation.keuangan, icon: TrendingUp },
        { href: "/pembangunan", label: translations.navigation.pembangunan, icon: HardHat },
        { href: "/bumdes", label: translations.navigation.bumdes, icon: Store },
    ];

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    const toggleCategory = (categoryName: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName]
        );
    };

    return (
        <>
            {/* Bottom Navigation - Fixed at bottom */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1279a7] border-t border-[#2a77a7] z-50 shadow-lg">
                <div className="grid grid-cols-5 h-16">
                    {mainNavItems.map((item) => {
                        const active = !item.external && isActive(item.href);
                        const Component = item.external ? "a" : Link;
                        const linkProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

                        return (
                            <Component
                                key={item.href}
                                href={item.href}
                                {...linkProps}
                                className={`flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200 relative cursor-pointer ${
                                    active ? "text-white animate-wiggle" : "text-[#ffffff] hover:text-white"
                                }`}
                            >
                                <item.icon
                                    className={`h-5 w-5 transition-all duration-200 ${active ? "scale-110" : "scale-100"}`}
                                />
                                <span className="font-medium truncate px-1">{item.label}</span>
                            </Component>
                        );
                    })}

                    {/* "Lainnya" menu item that triggers sidebar */}
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <button className="flex flex-col items-center justify-center gap-1 text-xs text-[#ffffff] hover:text-white transition-colors w-full h-full cursor-pointer">
                                <Menu className="h-5 w-5" />
                                <span className="font-medium">{translations.lainnya}</span>
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 p-0">
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle>{translations.navigation.menuNavigasi}</SheetTitle>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-2">
                                    {/* Main Navigation Items - Same order as desktop */}
                                    {mainSidebarNavItems.map((item: (typeof mainSidebarNavItems)[0]) => {
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                                    active
                                                        ? "bg-primary text-primary-foreground font-medium"
                                                        : "hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 shrink-0 ${
                                                        active ? "text-primary-foreground" : "text-primary"
                                                    }`}
                                                />
                                                <span className="truncate">{item.label}</span>
                                                {active && <div className="ml-auto w-2 h-2 bg-current rounded-full" />}
                                            </Link>
                                        );
                                    })}

                                    {/* Pemerintahan Section Header */}
                                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                                        Pemerintahan
                                    </div>

                                    {/* Pemerintahan Items */}
                                    <Link
                                        key="/profil"
                                        href="/profil"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/profil")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <UserCheck
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/profil") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Profil</span>
                                        {isActive("/profil") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <a
                                        key="/layanan"
                                        href="https://pondokrejo.sleman-desa.id/layanan-mandiri"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <FileText className="h-5 w-5 shrink-0 text-primary" />
                                        <span className="truncate">Layanan</span>
                                    </a>

                                    <Link
                                        key="/keuangan"
                                        href="/keuangan"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/keuangan")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <TrendingUp
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/keuangan") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Keuangan</span>
                                        {isActive("/keuangan") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/pembangunan"
                                        href="/pembangunan"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/pembangunan")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <HardHat
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/pembangunan") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Pembangunan</span>
                                        {isActive("/pembangunan") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/wilayah-administratif"
                                        href="/wilayah-administratif"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/wilayah-administratif")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <MapPin
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/wilayah-administratif")
                                                    ? "text-primary-foreground"
                                                    : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Wilayah Administratif</span>
                                        {isActive("/wilayah-administratif") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/bumdes"
                                        href="/bumdes"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/bumdes")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <Store
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/bumdes") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">BUMDes</span>
                                        {isActive("/bumdes") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    {/* Informasi Section Header */}
                                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                                        Informasi
                                    </div>

                                    {/* Informasi Items */}
                                    <Link
                                        key="/pengumuman"
                                        href="/pengumuman"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/pengumuman")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <MessageCircle
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/pengumuman") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Pengumuman</span>
                                        {isActive("/pengumuman") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/berita"
                                        href="/berita"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/berita")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <Newspaper
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/berita") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Berita</span>
                                        {isActive("/berita") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/kegiatan"
                                        href="/kegiatan"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/kegiatan")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <CalendarDays
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/kegiatan") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Agenda & Kegiatan</span>
                                        {isActive("/kegiatan") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/ppid"
                                        href="/ppid"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/ppid")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <FileCheck
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/ppid") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Informasi Publik (PPID)</span>
                                        {isActive("/ppid") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    {/* Inovasi Section Header */}
                                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Inovasi
                                    </div>

                                    <Link
                                        key="/posyandu"
                                        href="/posyandu"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/posyandu")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <Heart
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/posyandu") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Posyandu Digital</span>
                                        {isActive("/posyandu") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/pustaka"
                                        href="/pustaka"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/pustaka")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <BookOpen
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/pustaka") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Perpustakaan Digital</span>
                                        {isActive("/pustaka") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/lapak-digital"
                                        href="/lapak-digital"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/lapak-digital")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <Store
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/lapak-digital") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Lapak Digital</span>
                                        {isActive("/lapak-digital") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/ttg"
                                        href="/ttg"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/ttg")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <Wrench
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/ttg") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Teknologi Tepat Guna</span>
                                        {isActive("/ttg") && <div className="ml-auto w-2 h-2 bg-current rounded-full" />}
                                    </Link>

                                    <Link
                                        key="/komunitas"
                                        href="/komunitas"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/komunitas")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <Users
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/komunitas") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Komunitas</span>
                                        {isActive("/komunitas") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    <Link
                                        key="/analitik"
                                        href="/analitik"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                            isActive("/analitik")
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                    >
                                        <BarChart3
                                            className={`h-5 w-5 shrink-0 ${
                                                isActive("/analitik") ? "text-primary-foreground" : "text-primary"
                                            }`}
                                        />
                                        <span className="truncate">Analitik</span>
                                        {isActive("/analitik") && (
                                            <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                                        )}
                                    </Link>

                                    {/* Statistik Section Header */}
                                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                                        Statistik
                                    </div>

                                    {/* Categorized Statistik Items */}
                                    {statistikCategories.map((category) => {
                                        const CategoryIcon = category.icon;
                                        const isExpanded = expandedCategories.includes(category.category);
                                        const hasActiveItem = category.items.some((item) => isActive(item.href));

                                        return (
                                            <div key={category.category} className="mb-2">
                                                {/* Category Header */}
                                                <button
                                                    onClick={() => toggleCategory(category.category)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                                        hasActiveItem
                                                            ? "bg-primary text-primary-foreground"
                                                            : "hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <CategoryIcon className="h-4 w-4" />
                                                        <span>{category.category}</span>
                                                        <span className="text-xs opacity-60">
                                                            ({category.items.length})
                                                        </span>
                                                    </div>
                                                    <ChevronRight
                                                        className={`h-4 w-4 transition-transform duration-200 ${
                                                            isExpanded ? "rotate-90" : ""
                                                        }`}
                                                    />
                                                </button>

                                                {/* Category Items */}
                                                {isExpanded && (
                                                    <div className="mt-1 space-y-1">
                                                        {category.items.map((item) => {
                                                            const ItemIcon = item.icon;
                                                            return (
                                                                <Link
                                                                    key={item.href}
                                                                    href={item.href}
                                                                    onClick={() => setIsSidebarOpen(false)}
                                                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ml-4 ${
                                                                        isActive(item.href)
                                                                            ? "bg-primary/20 text-primary"
                                                                            : "hover:bg-accent/50"
                                                                    }`}
                                                                >
                                                                    <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                                                                    <ItemIcon
                                                                        className={`h-4 w-4 shrink-0 ${
                                                                            isActive(item.href)
                                                                                ? "text-primary"
                                                                                : "text-muted-foreground"
                                                                        }`}
                                                                    />
                                                                    <span className="truncate">{item.label}</span>
                                                                    {isActive(item.href) && (
                                                                        <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                                                                    )}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Lainnya Section */}
                                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                                        Lainnya
                                    </div>

                                    {additionalSidebarNavItems.map((item: (typeof additionalSidebarNavItems)[0]) => {
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 mb-1 cursor-pointer ${
                                                    active
                                                        ? "bg-primary text-primary-foreground font-medium"
                                                        : "hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 shrink-0 ${
                                                        active ? "text-primary-foreground" : "text-primary"
                                                    }`}
                                                />
                                                <span className="truncate">{item.label}</span>
                                                {active && <div className="ml-auto w-2 h-2 bg-current rounded-full" />}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Additional info section */}
                                <div className="p-4 border-t mt-2">
                                    <div className="text-xs text-muted-foreground space-y-2">
                                        <p>Portal Resmi Kalurahan Pondokrejo</p>
                                        <p>Kabupaten Sleman, DIY</p>
                                        <div className="pt-2">
                                            <p className="font-medium text-foreground mb-1">Butuh Bantuan?</p>
                                            <p>Hubungi kami melalui halaman pengaduan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Spacer for mobile to prevent content from being hidden behind bottom nav */}
            <div className="md:hidden h-16" />
        </>
    );
}
