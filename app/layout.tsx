import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigationWrapper } from "@/components/layout/MobileNavigationWrapper";
import { CustomToast } from "@/components/ui/custom/CustomToast";
import { BackToTop } from "@/components/ui/custom/BackToTop";
import { PWAInstallPrompt } from "@/components/ui/custom/PWAInstallPrompt";
import { env } from "process";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL || "https://devoneclickpondokrejo.slemankab.go.id"),
    title: "Portal Resmi Kalurahan Pondokrejo - Sleman, DIY",
    description:
        "Portal resmi Pemerintah Kalurahan Pondokrejo, Kabupaten Sleman, DIY. Informasi lengkap layanan publik, berita terkini, dan transparansi pemerintahan kalurahan.",
    keywords:
        "Kalurahan Pondokrejo, Sleman, DIY, pemerintahan kalurahan, layanan publik, berita kalurahan, transparansi, APBDes",
    authors: [{ name: "Pemerintah Kalurahan Pondokrejo" }],
    openGraph: {
        title: "Portal Resmi Kalurahan Pondokrejo",
        description: "Portal resmi Pemerintah Kalurahan Pondokrejo, Kabupaten Sleman, DIY",
        type: "website",
        locale: "id_ID",
        url: "https://devoneclickpondokrejo.slemankab.go.id",
        siteName: env.APP_NAME || "Portal Kalurahan Pondokrejo",
        images: [
            {
                url: "/favicon-512x512.png",
                width: 512,
                height: 512,
                alt: "Kalurahan Pondokrejo Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Portal Resmi Kalurahan Pondokrejo",
        description: "Portal resmi Pemerintah Kalurahan Pondokrejo, Kabupaten Sleman, DIY",
    },
    other: {
        "msapplication-TileColor": "#39a2cf",
        "msapplication-TileImage": "/favicon-144x144.png",
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "16x16 32x32" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest",
};

export function generateViewport() {
    return {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        themeColor: "#39a2cf",
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}>
                <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1 pt-16 md:pt-28">{children}</main>
                    <Footer />
                </div>
                <MobileNavigationWrapper />
                <CustomToast />
                <BackToTop />
                <PWAInstallPrompt />
            </body>
        </html>
    );
}
