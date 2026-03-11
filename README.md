# Portal Pondokrejo

Portal web Kalurahan Pondokrejo (Next.js) yang menampilkan konten dari berbagai layanan via API (OpenSID, SDGs, IDM, dsb).

## Prasyarat
- Node.js + npm
- Konfigurasi environment (lihat `.env.example`)

## Menjalankan (Development)
```bash
npm install
npm run dev -- --port 5091
```

Buka: http://localhost:5091

## Build (Production)
```bash
npm run build
npm run start
```

## Catatan Keamanan
- Security headers + CSP dikonfigurasi global di `next.config.ts`
- CORS distandarkan via helper API dan dibatasi oleh `CORS_ORIGIN` / `NEXT_PUBLIC_SITE_URL`
- Rate limiting untuk rute `/api` via middleware

## Dokumentasi Rilis
- `RELEASE_NOTES.md`
