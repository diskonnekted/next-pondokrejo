# Audit Fix Terbaru (2026-03-11)

Dokumen ini merangkum perbaikan hasil audit keamanan dan stabilitas untuk Portal Kalurahan Pondokrejo.

## Ringkasan Perbaikan
- Security headers global dan Content Security Policy (CSP) untuk mengurangi risiko XSS/clickjacking.
- CORS tidak lagi wildcard dan distandarkan di route API utama.
- Rate limiting untuk seluruh rute `/api` via middleware.
- Auth.js (Credentials + Prisma) untuk kebutuhan akses internal admin.
- UI akun publik di header dihapus dan diganti informasi portal (portal bersifat penampil konten via API).
- Perbaikan akses halaman detail berita: slug diturunkan dari `url_slug` dan base URL dev menggunakan origin lokal.
- Klarifikasi backup: aplikasi tidak menggunakan MariaDB; backup & recovery dilakukan di sisi hosting server.

## Detail Perbaikan (Dengan Referensi Kode)
### 1) Security Headers & CSP
- Implementasi: [next.config.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/next.config.ts)
- Dampak:
  - Menambah header keamanan standar (HSTS, XFO, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
  - CSP ketat di production dan adaptif di development.

### 2) CORS (Origin Tidak Wildcard + Standarisasi)
- Sumber header CORS: [api-service.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/lib/api-service.ts)
- Handler standar + OPTIONS: [api-helpers.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/lib/api-helpers.ts#L244-L314)
- Route API utama yang sudah menggunakan handler standar:
  - [ppid](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/ppid/route.ts)
  - [holidays](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/holidays/route.ts)
  - [external-news](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/external-news/route.ts)
  - [keuangan](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/keuangan/route.ts)
  - [opensid-berita](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/opensid-berita/route.ts)
  - [opensid-proxy](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/opensid-proxy/route.ts)
  - [pembangunan](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/pembangunan/route.ts)
  - [berita](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/berita/route.ts)
  - [pengumuman](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/pengumuman/route.ts)

### 3) Rate Limiting
- Implementasi middleware: [middleware.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/middleware.ts)
- Cakupan: seluruh rute `/api` (default 60 request/menit, dapat diubah via env).

### 4) Auth.js (Admin Internal)
- Konfigurasi Auth: [auth.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/auth.ts)
- Endpoint NextAuth: [route.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/api/auth/%5B...nextauth%5D/route.ts)
- Halaman login: [page.tsx](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/app/login/page.tsx)
- Catatan: Proteksi admin tidak dijalankan melalui Edge middleware pada Vercel Free untuk menghindari batas ukuran bundle.

### 5) Header Portal (Tanpa Akun Publik)
- Perubahan UI header: [Header.tsx](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/components/layout/Header.tsx)
- Dampak: tombol “Account/Profil/Logout” diganti dengan dropdown “Info” yang menjelaskan portal sebagai penampil konten via API.

### 6) Perbaikan Halaman Detail Berita (Slug)
- Sumber data OpenSID dan normalisasi slug:
  - Transform slug: [opensid.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/lib/opensid.ts)
  - Lookup by slug: [opensid.ts:getPostBySlug](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/lib/opensid.ts#L330-L356)
- Dampak: URL detail berita seperti `/berita/<slug>` dapat diakses walaupun OpenSID menyimpan slug di `url_slug`.

### 7) Klarifikasi Backup
- Aplikasi tidak menggunakan database MariaDB.
- Backup & recovery dilakukan di sisi hosting server (ops/infra), di luar lingkup aplikasi.
- Catatan rilis: [RELEASE_NOTES.md](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/RELEASE_NOTES.md)

## Sisa Pekerjaan
- Review kepatuhan UU PDP (consent, hak penghapusan data, prosedur insiden).

## Cara Verifikasi Cepat
- Cek header keamanan (HSTS/CSP/XFO):
  - `curl -I http://localhost:5091`
- CORS:
  - Pastikan preflight OPTIONS dan origin non-whitelist ditolak.
- Rate limit:
  - Kirim request cepat ke `/api/*` dan pastikan `429` saat melewati limit.
