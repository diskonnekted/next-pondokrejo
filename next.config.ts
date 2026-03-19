import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    cacheComponents: true,
    poweredByHeader: false,

    allowedDevOrigins: ['*.clasnet.co.id'],

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            process.env.NODE_ENV === 'development'
                                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.openstreetmap.org"
                                : "script-src 'self' 'unsafe-inline' cdn.openstreetmap.org",
                            "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
                            "font-src 'self' fonts.gstatic.com cdn.jsdelivr.net",
                            "img-src 'self' data: https: blob:",
                            "connect-src 'self' https: wss:",
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'"
                        ].join('; '),
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'geolocation=(), microphone=(), camera=()'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload'
                    }
                ]
            }
        ];
    },

    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        qualities: [25, 50, 75, 90],

        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pustaka.pondokrejo.id',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'ttg.pondokrejo.id',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'ttg.pondokrejo.id',
                port: '',
                pathname: '/assets/**',
            },
            {
                protocol: 'https',
                hostname: 'ttg.web.id',
                port: '',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'www.pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/storage-desa/**',
            },
            {
                protocol: 'https',
                hostname: 'www.pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/storage-desa/**',
            },
            {
                protocol: 'http',
                hostname: 'pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/desa/upload/media/**',
            },
            {
                protocol: 'https',
                hostname: 'pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/desa/upload/media/**',
            },
            {
                protocol: 'http',
                hostname: 'pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/desa/upload/artikel/**',
            },
            {
                protocol: 'https',
                hostname: 'pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/desa/upload/artikel/**',
            },
            {
                protocol: 'http',
                hostname: 'pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/storage-desa/**',
            },
            {
                protocol: 'https',
                hostname: 'pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/storage-desa/**',
            },
            {
                protocol: 'http',
                hostname: 'pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/desa/upload/galeri/**',
            },
            {
                protocol: 'https',
                hostname: 'pondokrejo.sleman-desa.id',
                port: '',
                pathname: '/desa/upload/galeri/**',
            },
        ],

        dangerouslyAllowSVG: false,
        contentSecurityPolicy: "default-src 'self'; script-src 'self'; sandbox;",
        minimumCacheTTL: 60,
    },

    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'simple-icons'],
    }
};

export default nextConfig;
