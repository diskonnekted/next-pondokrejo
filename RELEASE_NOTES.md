# v0.1.0-security-hardening (2026-03-11)

## Ringkasan
- Penguatan keamanan aplikasi dengan header standar dan Content Security Policy.
- Pembatasan CORS berbasis environment; penghapusan wildcard origin dari API.
- Rate limiting untuk semua endpoint `/api` via middleware.
- Penambahan autentikasi Auth.js (Credentials + Prisma) dan halaman `/login`.
- Penyelarasan handler API dengan CORS aman dan fallback sat set.
- Penambahan prisma client helper dan `.env.example` untuk konfigurasi.
- Laporan audit perbaikan: `audit_fix.md`.

## Perubahan Utama
- Security headers global: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
  - Lihat [next.config.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/next.config.ts).
- Content Security Policy:
  - Production ketat: `script-src 'self' cdn.openstreetmap.org`.
  - Development adaptif: mengizinkan `'unsafe-inline' 'unsafe-eval'` untuk tooling dev.
- CORS aman:
  - Origin diatur dari `CORS_ORIGIN` atau `NEXT_PUBLIC_SITE_URL`.
  - Lihat [api-service.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/lib/api-service.ts).
- Rate limiting middleware untuk `/api`:
  - Lihat [middleware.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/middleware.ts).
- Auth.js (NextAuth v5) Credentials + Prisma:
  - Konfigurasi: [auth.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/auth.ts).
  - Endpoint: [app/api/auth/[...nextauth]/route.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/auth/%5B...nextauth%5D/route.ts).
  - Halaman: [app/login/page.tsx](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/login/page.tsx).
- Standarisasi handler API + CORS aman pada rute prioritas:
  - [sdgs](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/sdgs/route.ts), [idm](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/idm/route.ts), [peta](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/peta/route.ts), [pemerintah](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/pemerintah/route.ts), [pengaduan](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/pengaduan/route.ts), statistik endpoints terkait.
- Prisma client helper untuk menghindari multiple instance: [lib/prisma.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/lib/prisma.ts).
- Template environment: [.env.example](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/.env.example).
- Laporan audit perbaikan: [audit_fix.md](file:///d:/xampp/htdocs/audit-pondokrejo/audit_fix.md).

## Breaking Changes
- CORS tidak lagi menerima wildcard origin (`*`). Klien harus sesuai dengan origin whitelist di environment.
- Rute `/admin/*` kini dilindungi dan memerlukan login; akses tanpa autentik akan diarahkan ke `/login` dengan `callbackUrl`.
- Inline script tidak diizinkan di production CSP; jika diperlukan, gunakan `nonce` per-request atau `hash` untuk skrip statis.

## Konfigurasi Environment
- Wajib:
  - `AUTH_SECRET`, `NEXTAUTH_URL`
  - `CORS_ORIGIN`
  - `NEXT_PUBLIC_SITE_URL`
  - `DATABASE_URL`
- Opsional (disarankan):
  - `OPENSID_API_URL`, `SDGS_API_URL`
  - `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`

## Panduan Upgrade
- Set variabel environment sesuai di atas.
- Jalankan Prisma generate:

  ```bash
  npm run db-generate
  ```

- Build atau dev:

  ```bash
  npm run build
  npm run dev
  ```

- Login endpoint:
  - Buka `/login`, masukkan email dan kata sandi yang tersimpan di DB (seed dev tersedia).
  - Akses `/admin/*` setelah login; middleware akan meneruskan `callbackUrl` otomatis.

## Verifikasi
- Header keamanan:
  - Cek HSTS, CSP, XFO, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Rate limiting:
  - Kirim > batas default (60 req/menit) ke `/api` dan ensure `429 Too Many Requests`.
- CORS:
  - Preflight/GET dari origin tidak terdaftar harus ditolak.

## Catatan
- ESLint memiliki sejumlah warning lama; tidak memblok build. Pertimbangkan perbaikan bertahap atau penyesuaian toleransi lint.
- Next.js mengeluarkan peringatan konvensi “middleware” deprecated ke “proxy”. Rencana migrasi dapat dilakukan di rilis berikutnya.
- Log build menunjukkan peringatan dev terkait prerender IoT; tidak memblok fungsionalitas utama portal.
 - Klarifikasi ops/infra: Aplikasi tidak menggunakan database MariaDB; backup & recovery dikelola di sisi hosting server (di luar lingkup aplikasi).
