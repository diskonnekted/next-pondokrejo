<p align="center">
  <img src="public/images/logo.png" width="120" alt="Logo Kalurahan Pondokrejo" />
</p>

# Portal Pondokrejo

Portal Pondokrejo adalah aplikasi web yang berfungsi sebagai pengumpul API (API aggregator) untuk menyajikan informasi publik dari berbagai sistem milik Kalurahan Pondokrejo. Portal ini tidak menjadi sumber data utama dan tidak menyimpan data konten ke database internal; konten ditampilkan dari layanan upstream yang relevan.

## Tujuan
- Menyediakan satu pintu akses informasi publik yang konsisten, cepat, dan mudah diakses.
- Mengurangi duplikasi implementasi antarmuka dengan memusatkan konsumsi API dari sistem yang sudah ada.
- Menjadi lapisan presentasi (presentation layer) dan integrasi (integration layer) bagi layanan yang berbeda.

## Sumber Data
Portal mengambil data dari beberapa layanan, antara lain:
- OpenSID (arsip/berita, wilayah, PPID, keuangan, dan endpoint internal lain yang relevan)
- SDGs
- IDM
- Sistem/layanan internal lain yang dipublikasikan melalui API

## Cara Kerja (Ringkas)
- Aplikasi client dan server memanggil route internal `app/api/*` sebagai antarmuka terpadu.
- Untuk beberapa sumber eksternal, portal menyediakan proxy untuk menghindari masalah CORS dan menambahkan caching.
- Konten ditampilkan secara on-demand dari sumber upstream, dengan mekanisme cache/revalidate sesuai kebutuhan.

## Prasyarat
- Node.js dan npm
- Environment variables (lihat `.env.example`)

## Menjalankan Lokal
```bash
npm install
npm run dev
```

Buka: http://localhost:5091

## Build dan Menjalankan Production
```bash
npm run build
npm run start
```

## Konfigurasi Environment (Umum)
- `OPENSID_API_URL`: base URL OpenSID (jika diperlukan)
- `NEXT_PUBLIC_SITE_URL`: base URL portal (untuk produksi)
- `CORS_ORIGIN`: origin yang diizinkan mengakses API portal
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`: konfigurasi rate limiting route `/api`

## Keterangan Data Pribadi
Portal Pondokrejo tidak melakukan pengumpulan, perekaman, maupun penyimpanan data pribadi pengguna secara mandiri. Portal ini berfungsi sebagai media penyajian informasi yang bersumber dari sistem/layanan upstream milik Kalurahan Pondokrejo. Dengan demikian, kewajiban pengelolaan dan pemenuhan ketentuan perlindungan data pribadi melekat pada sistem sumber sesuai kewenangan dan kebijakan masing-masing. Portal Pondokrejo tetap menerapkan pengamanan teknis yang wajar untuk menjaga integritas layanan.

## Keamanan dan Operasional
- Security headers dan Content Security Policy (CSP) dikonfigurasi global di [next.config.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/next.config.ts).
- CORS distandarkan untuk route API utama melalui helper internal dan dibatasi oleh konfigurasi environment.
- Rate limiting diterapkan pada route `/api` melalui [middleware.ts](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/middleware.ts).
- Ringkasan audit fix terbaru tersedia di [AUDIT_FIX_LATEST.md](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/AUDIT_FIX_LATEST.md).

## Dokumen
- [RELEASE_NOTES.md](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/RELEASE_NOTES.md)
- [AUDIT_FIX_LATEST.md](file:///d:/xampp/htdocs/audit-pondokrejo/next-pondokrejo/AUDIT_FIX_LATEST.md)

<p align="center">
  <img src="public/images/clasnet-group.svg" width="140" alt="Clasnet Group" />
</p>
