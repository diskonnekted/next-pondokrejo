## 🎯 TUJUAN

Portal ini berfungsi sebagai **kehadiran digital resmi Pemerintah Kalurahan Pondokrejo**, menyediakan informasi transparan, layanan publik, serta pembaruan bagi warga dan pengunjung.

---

## 📍 INFORMASI TEKNIS

- **Folder Instalasi:** `/home/clasnet-pondokrejo/htdocs/pondokrejo.clasnet.co.id`
- **URL Website:** [`https://pondokrejo.clasnet.co.id`](https://pondokrejo.clasnet.co.id) - **Environment:** Production (operasional penuh) - **Port Next.js:** **5090**

---

## ⚙️ TEKNOLOGI & FRAMEWORK

Seluruh dependensi sudah terpasang dan dikonfigurasi dengan benar.

- **Framework:** Next.js 15 (App Router, Server Actions, TypeScript)
- **UI Framework:** Tailwind CSS 4
- **Komponen UI:** Shadcn (Semua paket dan komponen Shadcn UI sudah terpasang semua)
- **Ikon:** Lucide
- **Grafik & Statistik:** Recharts
- **ORM:** Prisma
- **Autentikasi:** Auth.js
- **Validasi Skema:** Zod
- **Zona Waktu & Tanggal:** date-fns & date-fns-tz (Asia/Jakarta)
- **Hashing Password:** bcryptjs
- **Linting:** ESLint strict mode + Prettier
- **Komponen Tata Letak:** `Header`, `Content`, `Footer`

---

## 🔧 PERINTAH NPM

```bash
npm run lint        # eslint . --max-warnings 0
npm run lint-fix    # prettier --write . && eslint . --fix --max-warnings 0
npm run db-generate # prisma generate
npm run db-push     # prisma db push
npm run db-studio   # prisma studio
npm run db-seed     # tsx prisma/seed.ts
npm run db-purge    # tsx prisma/seed.ts
```

> Daftar lengkap tersedia di `package.json`.

---

## 🔒 KONFIGURASI DATABASE

- **Mesin:** MariaDB
- **Host:** `localhost`
- **Database:** `clasnet-pondokrejo`
- **Username:** `clasnet-pondokrejo`
- **Password:** `pmOH4YB0jSN9foGHfR1b`

> Kredensial harus disimpan secara aman di file `.env` sesuai praktik terbaik Next.js.

**Aturan Skema Tabel:**

- Setiap tabel memiliki kolom `id` auto-increment.
- Gunakan enum integer (`0,1,2,3`) untuk enumerasi dan sususan, jangan gunakan string.
- Semua timestamp mengikuti waktu server database (`Asia/Jakarta`).
- Timestamp Prisma default: `CURRENT_TIMESTAMP(3)`.
- Penanganan tanggal menggunakan `date-fns` dengan zona waktu `Asia/Jakarta`. `date-fns-tz` juga tersedia.

---

## 🧩 FITUR UTAMA

### **🌟 FITUR UNGGULAN HOMEPAGE**

1. **Top Navigation Bar**
   - Logo Kalurahan Pondokrejo dengan nama resmi
   - Search bar untuk pencarian informasi, layanan, dan berita
   - Login button dengan user authentication
   - Language selector (Indonesia/English)
   - Notification bell untuk updates penting
   - Navigation menu: Beranda, Berita, Layanan, Profil, Pengaduan, Kontak

2. **Hero Slider**
   - Auto-playing carousel dengan 5 slides
   - Video background dengan drone footage kalurahan
   - Interactive CTA buttons: Layanan Digital, Pantau Pembangunan, Hubungi Kami, Download Aplikasi
   - Progress indicator dan navigation controls (Previous/Next)
   - Judul dan deskripsi yang menarik dan informatif

3. **Quick Links dengan Icons**
   - 10 layanan cepat dengan ikon yang jelas:
     - 📄 Dokumen Publik (APBDes)
     - 📋 Surat Online (E-KTP, KK, dll)
     - 📊 Laporan Online (bulanan, triwulanan)
     - 💰 Keuangan Kalurahan (transparansi APBDes)
     - 🏥 Kesehatan (BPJS, vaksinasi)
     - 🎓 Pendidikan (beasiswa, sekolah)
     - 🏗️ Pembangunan (proyek infrastruktur)
     - 📱 Aplikasi Mobile
     - 🗳️ E-Voting (partisipasi warga)
     - 📞 Kontak Darurat (112, hotline)

4. **Berita dan Pengumuman (2 Column Layout)**
   - **Kiri (Berita Terkini):**
     - Featured article dengan gambar utama
     - Berita utama dengan judul, ringkasan, penulis, views
     - Berita lainnya dengan bullet list (4 items)
     - Link "Lihat Semua Berita"
   - **Kanan (Pengumuman):**
     - Emergency alerts dengan ikon peringatan
     - Agenda kegiatan kalurahan dengan waktu
     - Pengumuman achievement dengan progress percentage
     - Link "Lihat Semua Pengumuman"

5. **SDGs Icons**
   - 17 Goals SDGs dengan progress percentage
   - Ikon yang jelas untuk setiap goal
   - Progress bars dan indikator pencapaian
   - Layout 2 baris (10 di atas, 7 di bawah)
   - Link "Lihat Detail Progress SDGs"

6. **Statistik Charts**
   - **Kiri:** Grafik pertumbuhan penduduk (line chart 2019-2024)
   - **Kanan:** Grafik distribusi anggaran APBDes (pie chart)
   - Data real-time dengan update terakhir
   - Link "Lihat Dashboard Statistik Lengkap"
   - Animasi dan interaksi pada desktop

7. **Officers Slider**
   - Photo gallery Lurah dan perangkat kalurahan
   - Informasi lengkap: nama, jabatan, email, telepon, jam kerja
   - Penghargaan dan pencapaian
   - Social media links (WhatsApp, LinkedIn)
   - Pendidikan dan pengalaman kerja
   - Navigation controls (Previous/Next)

8. **Fitur Tambahan (Optional)**
   - Kegiatan Hari Ini dengan jadwal lengkap
   - Cuaca Hari Ini dengan kondisi dan suhu
   - Video Galeri untuk dokumentasi kegiatan
   - Statistik Real-Time dengan live updates
   - Polling Komunitas untuk partisipasi warga

9. **Footer yang Komprehensif**
   - Informasi kontak lengkap (alamat, telepon, email, website)
   - Quick Links untuk navigasi cepat
   - Social media links (Facebook, Twitter, Instagram, YouTube, LinkedIn)
   - Newsletter subscription
   - Legal information (privacy policy, terms, FAQ, sitemap)
   - Copyright dan credits (Clasnet Corporation, awards, security)

### **📋 FITUR STANDAR PORTAL**

9. **Profil Kalurahan**
    - Sejarah, Visi & Misi, Struktur Organisasi
    - Virtual tour kalurahan dengan 360° photos
    - Achievement gallery
    - Annual reports download

10. **Layanan Mandiri**
    - Administrasi Kependudukan (KK, KTP, Kelahiran, Kematian)
    - Surat Kalurahan (Domisili, Usaha, Pengantar, dll)
    - Formulir permohonan layanan online dengan e-signature
    - Document tracking system
    - SMS notification system
    - Integration dengan **OpenSID API**

11. **Berita & Pengumuman**
    - Multi-category content management
    - Scheduled publishing system
    - Email newsletter subscription
    - RSS feed generation
    - Social media auto-posting
    - Integration dengan **OpenSID API**

12. **Transparansi Keuangan**
    - APBDes interactive visualization
    - Real-time budget tracking
    - Expenditure breakdown charts
    - Historical comparison tools
    - Citizen budget participation
    - Integration dengan **OpenSID API**

13. **Pembangunan Kalurahan**
    - Project management dashboard
    - Progress photo documentation
    - Timeline visualization
    - Budget tracking per project
    - Community feedback system
    - BUMDes performance metrics

14. **Kegiatan Masyarakat**
    - Event calendar dengan registration
    - Community group management
    - Photo gallery albums
    - Video streaming capability
    - Volunteer coordination
    - Achievement tracking

15. **Pengaduan & Layanan Publik**
    - Multi-channel complaint system (web, mobile, WhatsApp)
    - Ticket tracking system
    - SLA monitoring dashboard
    - Satisfaction survey
    - Performance analytics
    - Public service standards

16. **Sistem Informasi Geografis (GIS)**
    - Comprehensive village mapping
    - Land use planning visualization
    - Infrastructure inventory
    - Public facilities directory
    - Disaster risk mapping
    - Development planning tools

17. **Ekstensi di Masa Depan**
    - AI-powered chatbot assistance
    - Voice search capability
    - Mobile applications (iOS/Android)
    - IoT sensor integration
    - Blockchain-based document verification
    - E-voting system untuk Musdes

---

## 📊 STRUKTUR NAVIGASI

- Beranda
- Berita
- Profil Kalurahan
- Pemerintahan
- Layanan Mandiri
- Informasi & Pengumuman
- Laporan Keuangan
- Pembangunan Kalurahan
- Kegiatan Warga
- BUMDes
- Pengaduan
- Kontak

---

## 📅 SISTEM TAHUN ADMINISTRATIF

Setiap data utama (proyek, anggaran, kegiatan, statistik) terkait dengan **tahun anggaran administratif**, misalnya **Tahun Anggaran 2024–2025**, gunanya adalah untuk mendukung:

- Pelacakan historis dan perbandingan antar tahun
- Sinkronisasi dengan APBDes dan pelaporan resmi
- Ini nanti kita akan pakai API dari **OpenSID**

---

## 🖥️ HOMEPAGE LAYOUT SPESIFIKASI

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          TOP NAVIGATION BAR                                                                    │
│  ┌─────────────────────────[ LOGO DESA PONDOKREJO ]─────────────────────────┐ ┌────────────────────────────────────────────────┐ │
│  │                                                               │ │ │ 🔍 [Cari informasi, layanan, atau berita...]    │ │ │
│  │               🏛️ PEMERINTAH KALURAHAN PONDOKREJO             │ │ │ ┌─────────────────────────────────────┐       │ │ │
│  │               Kabupaten Sleman, DIY                             │ │ │ │ 👤 Login      │ 🌐 Indonesia │ 🔔 Notif │ │       │ │ │
│  └───────────────────────────────────────────────────────────────┘ │ └────────────────────────────────────────────────┘ │ │
│  📱 [Beranda] [Berita] [Layanan] [Profil] [Pengaduan] [Kontak]          │                                                 │ │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           HERO SLIDER                                                                         │
│  ┌────────────────────────────────────────────────────[ ◀ PREV ] SLIDE 1/5 [ NEXT ▶ ]─────────────────────────────────┐  │
│  │  🏛️ "Digitalisasi Kalurahan Pondokrejo" - Mewujudkan Tata Kelola Pemerintahan Modern dan Transparan untuk Kesejahteraan Warga     │  │
│  │  🎥 Background: Drone footage kalurahan Pondokrejo                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐                  │  │
│  │  │ 🎯 [Jelajahi Layanan Digital] [Pantau Pembangunan] [Hubungi Kami] [Download Aplikasi Mobile]              │                  │  │
│  │  └─────────────────────────────────────────────────────────────────────────────────────────────┘                  │  │
│  │  ●●●●●○ Progress Indicator                                                                                  │  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         QUICK LINKS WITH ICONS                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                            LAYANAN CEPAT                                                                      │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │  │
│  │  │ 📄       │ │ 📋       │ │ 📊       │ │ 💰       │ │ 🏥       │ │ 🎓       │ │ 🏗️       │ │ 📱       │ │ 🗳️       │ │ 📞       │  │  │
│  │  │ Dokumen  │ │ Surat    │ │ Laporan  │ │ Keuangan │ │ Kesehatan│ │ Pendidikan│ │ Pembangunan│ │ Aplikasi  │ │ E-Voting │ │ Kontak   │  │  │
│  │  │   Publik │ │   Online │ │  Online  │ │   Kalurahan   │ │          │ │          │ │          │ │          │ │   Darurat │  │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │  │
│  │    [APBDes]      [E-KTP]     [Bulanan]   [Transparan] [BPJS]     [Beasiswa]  [Proyek]    [Mobile]    [Musdes]   [112]     │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────┐
│               BERITA TERKINI (LEFT)            │                                      PENGUMUMAN (RIGHT)                            │
│  ┌─────────────────────────────────────────┐  │  ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 📰 BERITA UTAMA                         │  │  │ 🔔 PENGUMUMAN PENTING                                                          │  │
│  │ 📸 [Gambar Berita Utama]                │  │  │                                                                               │  │
│  │ 📝 Program Vaksinasi COVID-19 Tahap 3     │  │  │ ┌─🚨 EMERGENCY─┐ 📅 27 Okt 2025                                                    │  │
│  │    Dimulai Hari Ini di 3 Lokasi          │  │  │ │ Waspada Banjir!                                                             │  │
│  │ ⏰ 2 jam lalu │ 👤 Bambang Sutrisno       │  │  │ │ Warga diimbau waspada terhadap potensi banjir...                          │  │
│  │ 🏷️ Kesehatan │ 👁️ 1,234 views          │  │  │ └─────────────────┘                                                        │  │
│  │ 🎯 [Baca Selengkapnya]                  │  │  │                                                                               │  │
│  │ └─────────────────────────────────────────┘  │  │ ┌─📅 AGENDA─┐ 🕒 14:00 WIB                                                       │  │
│  │                                          │  │  │ │ Rapat Koordinasi Pembangunan                                              │  │
│  │                                          │  │  │ │ Evaluasi progress proyek Q4 2024                                         │  │
│  │ 📋 BERITA LAINNYA                        │  │  │ └─────────────────┘                                                        │  │
│  │ • Bantuan BPNT Tahap 3 Dibagikan         │  │  │                                                                               │  │
│  │ • Rehabilitasi Mushola Al-Hidayah        │  │  │ ┌─🏆 PENGUMUMAN─┐ 📊 85% Terselesaai                                              │  │
│  │ • Lomba Gotong Royong Tingkat RT         │  │  │ │ Target Vaksinasi Capai 85%                                                │  │
│  │ • Pelatihan Kewirausahaan UMKM          │  │  │ │ Masyarakat diimbau segera vaksin di puskesmas terdekat                │  │
│  │                                          │  │  │ └─────────────────┘                                                        │  │
│  │ 📰 [Lihat Semua Berita]                 │  │  │                                                                               │  │
│  └─────────────────────────────────────────┘  │  │ 🔔 [Lihat Semua Pengumuman]                                                    │  │
└──────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           SDGs ICONS                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                            TARGET SDGs DESA PONDOKREJO                                                      │  │
│  │  ┌─No Poverty─┐ ┌─Zero Hunger─┐ ┌─Good Health─┐ ┌─Quality Edu─┐ ┌─Gender Equal─┐ ┌─Clean Water─┐ ┌─Clean Energy─┐ ┌─Decent Work─┐ ┌─Industry─┐  │  │
│  │  │    85%      │ │     92%     │ │     78%     │ │     88%     │ │     91%      │ │     87%     │ │      95%     │ │     82%     │ │    79%    │  │  │
│  │  │ 📊 Progress │ 🌾 Programs  │ 🏥 Healthcare │ 📚 Schools  │ 👩‍💼 Women Emp │ 💧 Water Sys  │ ⚡ Renewable  │ 💼 Local Job │ 🏭 Innovation │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │  │
│  │  ┌─Reduced Ineq─┐ ┌─Sustain Cities─┐ ┌─Responsible─┐ ┌─Climate Action─┐ ┌─Life Below─┐ ┌─Life On Land─┐                               │  │
│  │  │      76%     │ │       84%     │ │      83%      │ │       71%      │ │      88%     │ │      90%      │                               │  │
│  │  │ 👥 Inclusion  │ │ 🏘️ Urban Dev  │ │ ♻️ Consumption│ │ 🌍 Environment │ │ 🐟 Marine      │ │ 🌳 Forest      │                               │  │
│  │  └──────────────┘ └────────────────┘ └─────────────────┘ └────────────────┘ └──────────────┘ └──────────────┘                               │  │
│  │                                                                                                                         │  │
│  │  📊 [Lihat Detail Progress SDGs]                                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            STATISTIK CHARTS                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                            GRAFIK STATISTIK DESA                                                              │  │
│  │  ┌─────────────────────────────────────────────────────────┐ ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │                PERTUMBUHAN PENDUDUK                  │ │                 DISTRIBUSI ANGGARAN APBDES              │  │  │
│  │  │                  (2019-2024)                        │ │                    TAHUN 2024                          │  │  │
│  │  │  ┌───────────────────────────────────────────────┐ │ │  ┌───────────────────────────────────────────────┐ │ │  │
│  │  │  │  9,200 │                                        │ │ │  │          ██ 30% Pendidikan                             │ │ │  │
│  │  │  │  8,900 │     ●●●                               │ │ │  │          ██ 25% Infrastruktur                         │ │ │  │
│  │  │  │  8,600 │   ●●●   ●                             │ │ │  │          ██ 20% Kesehatan                             │ │ │  │
│  │  │  │  8,400 │ ●●●       ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●│ │ │  │          ██ 15% Pemberdayaan                         │ │ │  │
│  │  │  │  8,200 │                                        │ │ │  │          ██ 10% Administrasi                         │ │ │  │
│  │  │  └───────────────────────────────────────────────┘ │ │  └───────────────────────────────────────────────┘ │ │  │
│  │  │    2019   2020   2021   2022   2023   2024          │ │ │                                                   │ │  │
│  │  └─────────────────────────────────────────────────────────┘ └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                                                                         │  │
│  │  📊 [Lihat Dashboard Statistik Lengkap]                                                                                 │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        PEMERINTAH DESA SLIDER                                                                   │
│  ┌─[ ◀ PREV ]─┐ 👤 DR. BAMBANG SUTRISNO, M.SI 👤 [ NEXT ▶ ]───────────────────────────────────────────────────────────────────────┐  │
│  │  Lurah Kalurahan Pondokrejo                                                                                                   │  │
│  │  "Melayani dengan hati, membangun bersama warga"                                                                      │  │
│  │  📧 lurah@pondokrejo.desa.id │ 📱 0812-3456-7890 │ 📅 Senin-Jumat, 08:00-16:00 WIB                                         │  │
│  │  🏆 Penghargaan: Terbaik 1 Pelayanan Publik 2023 │ 📱 WhatsApp: 0812-3456-7890 │ 🌐 www.linkedin.com/in/bambangsutrisno        │  │
│  │  📚 Pendidikan: S2 Administrasi Publik UGM │ 💼 Pengalaman: 15 tahun di pemerintahan                                       │  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              FITUR TAMBAHAN                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 📅 KEGIATAN HARI INI     │ 🌤️ CUACA HARI INI        │ 📺 VIDEO GALERI        │ 📱 STATISTIK REAL-TIME │ 🗳️ POLLING KOMUNITAS │  │
│  │ • Rapat RT 02: 14:00    │ ☀️ 28°C │ Berawan      │ • Wisata Kalurahan 2024    │ 🏠 KK: 2,847 │ 📈 +2.5% │ "Program prioritas   │  │
│  │ • Senam Lansia: 07:00   │ 💧 65% | Hujan Ringan  │ • Acara 17 Agustus     │ 👥 Penduduk: 8,941 │ 📈 +1.8% │ 2025?"               │  │
│  │ • Posyandu: 09:00      │ 🌬️ 15 km/jam dari Tenggara│ • Hari Jadi Kalurahan       │ 💰 APBDes: 2.4B │ 📈 +5.2% │ 👍 Ya (76%) 🚑 Tidak (24%) │  │
│  │ • Vaksinasi: 13:00     │                          │ • Kegiatan Ramadhan    │ 🏗️ Proyek: 12 │ 📈 +8.1% │                        │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                 FOOTER                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🏛️ Pemerintah Kalurahan Pondokrejo                                                                                 │  │
│  │ 📍 Jl. Raya Pondokrejo No. 123, Sleman, Daerah Istimewa Yogyakarta 55581 │ 📞 (0274) 123456 │ 📱 0812-3456-7890                     │  │
│  │ 📧 info@pondokrejo.clasnet.co.id │ 🌐 www.pondokrejo.clasnet.co.id │ 🕒 Senin-Jumat: 08:00-16:00 WIB                               │  │
│  │                                                                                                                         │  │
│  │ Quick Links: [Beranda] [Berita] [Layanan] [Profil] [Pengaduan] [Kontak] │ Layanan: [E-KTP] [KK] [Surat] [Bantuan] [Kesehatan] [Pendidikan]            │  │
│  │                                                                                                                         │  │
│  │ Social Media: [📘 Facebook] [🐦 Twitter] [📷 Instagram] [📺 YouTube] [💼 LinkedIn] │ Newsletter: 📧 [Subscribe] untuk update terkini              │  │
│  │                                                                                                                         │  │
│  │ Legal: [Kebijakan Privasi] [Syarat & Ketentuan] [FAQ] [Sitemap] │ © 2025 Pemerintah Kalurahan Pondokrejo. All Rights Reserved.           │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                                             │
│  💻 Powered by: Clasnet Corporation │ 🏆 Digital Village Award 2024 │ 🛡️ Security Certified │ 📞 Hotline Darurat: 112                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ PERSYARATAN UI/UX

- **Gaya:** Modern, clean, elegant, sleek, official
- **Nuansa:** Profesional namun ramah masyarakat
- **Skema Warna:** Identitas kalurahan (emerald)
- **Responsif:** Optimal di desktop & mobile
- **Aksesibilitas:** Tipografi jelas, kontras tinggi

### Tema & Warna

Hanya mendukung **tema terang (white theme)** — **tanpa dark mode**.

| Atribut        | Warna                                      | Deskripsi                             |
| -------------- | ------------------------------------------ | ------------------------------------- |
| **primary**    | `#39a2cf`                                  | Biru utama resmi (Header)             |
| **secondary**  | `#3eafdf`                                  | Biru kebiruan pendukung (Hero)        |
| **background** | `#f2f6ff`                                  | Dasar halaman bersih                  |
| **surface**    | `#ffffff`                                  | Latar kartu/komponen                  |
| **text-dark**  | `#000000`                                  | Teks utama                            |
| **text-light** | `#ffffff`                                  | Teks di atas latar gelap              |
| **text-hover** | `#ddf0ff`                                  | Teks hover di atas latar gelap        |
| **accent**     | `#0a4661`                                  | Warna aksen/CTA (Footer)              |
| **success**    | `#22c55e`                                  | Status sukses                         |
| **warning**    | `#fbbf24`                                  | Peringatan                            |
| **danger**     | `#f87171`                                  | Kesalahan                             |
| **info**       | `#60a5fa`                                  | Informasi                             |
| **hover**      | `#08374c`, `#08374c`, `#ddf0ff`            | Untuk hover states                    |

---

## 📱 KOMPONEN UI DAN ATURAN IMPLEMENTASI

**Logo:**

- Harus berbentuk ikon kalurahan, lebar penuh (tidak di dalam kotak).

**Padding & Margin:**

- Maksimum `p-4` atau `m-4`.
- Jarak antar card/kartu = 20px.

**Navbar Mobile:**

- Diletakkan di bawah (bottom) layar.
- Menu: `Beranda`, `Berita`, `Layanan`, `Pengaduan`, `Lainnya`.
- Klik `Lainnya` → membuka sidebar tambahan.

**Komponen Utama:**

- `Header`, `Content`, `Footer`.

**Button:**

- Wajib memiliki ikon.
- Gaya outline.
- Warna sesuai konteks (sukses, bahaya, info, dll).
- Gunakan spinner saat loading.
- Button tanpa teks atau ikon saja, maka tampilkan tooltip Shadcn.

**Input:**

- Gunakan ikon konteks (user, lock, ID card, dll).
  Contoh:
    ```
    --------------------------------------
    | (icon user) Masukkan nama lengkap  |
    --------------------------------------
    --------------------------------------
    | (icon email) Masukkan alamat email |
    --------------------------------------
    ```

**Textarea:**

- Komponen Shadcn, tinggi minimal 8 baris, dapat di-resize vertikal.

**Select/Dropdown:**

- Komponen Shadcn, pilihan aktif terlihat jelas.
- Layout:
    ```
    -----------------
    | Tombol Select |
    |----------------
    | Pilihan 1     |
    | Pilihan 2     |
    | Pilihan 3   v | <<--- Terpilih, tanda check standar bawaan shadcn
    | Pilihan 4     |
    -----------------
    ```
    Ingat, select harus berada di posisi kiri, pastikan rata kiri dan untuk tanda check pastikan rata kanan

**Tabs:**

- Hanya di desktop; di mobile gunakan dropdown.
- Jika suatu container terdapat 4 tabs, maka posisikan tabs tersebut di tengah-tengah container dan buat width memanjang hingga memenuhi container.
  Contoh:
    ```
    -----------------------------------------|
    | -------- --------- --------- --------- |
    | | TAB 1| | TAB 2 | | TAB 3 | | TAB 4 | |
    | -------- --------- --------- --------- |
    | -------------------------------------- |
    | |                                    | |
    | |            AREA KONTEN             | |
    | |                                    | |
    | -------------------------------------- |
    -----------------------------------------|
    ```

**Badge:**

- Selalu memiliki ikon dan berwarna sesuai konteks.

**Hero, Card, Calendar, Checkbox, Context Menu:**

- Gunakan komponen Shadcn.
- Context Menu wajib ikon dan separator antar kategori.

**Breadcrumb:**

- Muncul di semua halaman kecuali halaman utama.

**Toast/Sonner:**

- Posisi kanan bawah.
- Durasi minimal 30 detik.
- Ada tombol `x` untuk menutup toast.

**Modal:**

- `alert dialog` → konfirmasi/informasi.
- `dialog` → form tambah/edit.
- Tidak boleh tertutup otomatis saat klik di luar area.

**Animasi:**

- Tampilkan animasi secantik dan semenarik mungkin di mode desktop
- Matikan semua animasi di mode mobile

---

## 📋 TABEL & PAGINASI

**Aturan Tabel:**

- Baris even/odd memiliki efek berbeda.
- Aksi → context menu Shadcn.

**Paginasi Default:**

- Desktop: 20 baris/halaman
- Mobile: 10 baris/halaman
- Pilihan: 10, 20, 30, 50, 100

**Tampilan Paginasi (Contoh dengan 20 halaman):**

- Halaman 1 → `[<<] [<] [AKTIF] [2] [3] ... [20] [>] [>>]`
- Halaman 4 → `[<<] [<] [1] ... [3] [AKTIF] [5] ... [20] [>] [>>]`
- Halaman 10 → `[<<] [<] [1] ... [9] [AKTIF] [11] ... [20] [>] [>>]`
- Halaman 19 → `[<<] [<] [1] ... [18] [AKTIF] [20] [>] [>>]`
- Halaman 20 → `[<<] [<] [1] ... [18] [19] [AKTIF] [>] [>>]`

---

## ✅ TUGAS AWAL

1. Buat halaman **Portal Utama (Beranda)**.
2. Halaman lain tampilkan placeholder:

    > "Halaman ini masih dalam tahap pengembangan."

---

## 🗣️ ATURAN BAHASA, GAYA KODE, DAN KONTEKS

- Semua **teks UI, nama fungsi, nama kolom database, dokumentasi, dan komentar kode** → **HARUS ditulis dalam Bahasa Indonesia**.
- Istilah umum seperti "error", "refresh", "reset" dipertahankan untuk tetap menggunakan bahasa Inggris.
- Semua string UI dimapping ke file `lib/translation.json`.
- Gunakan **format lokal Indonesia (id-ID)** dan zona waktu **Asia/Jakarta**.
