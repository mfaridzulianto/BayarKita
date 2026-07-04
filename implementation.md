# Panduan Tugas Akhir: Pengembangan Frontend (View Layer)
## Aplikasi Web Pembayaran Tagihan Multi-Layanan & Pengisian Pulsa (Bill Payment & Top-Up Application)

---

## 1. Deskripsi Tugas
Anda diminta membangun sebuah aplikasi web *frontend* yang mensimulasikan proses pembayaran berbagai tagihan rutin masyarakat Indonesia serta pengisian pulsa/paket data. Aplikasi ini sepenuhnya berjalan di sisi klien (*client-side*) tanpa backend server nyata.

### Fokus Utama Pengembangan:
*   **UI/UX Modern:** Perancangan antarmuka pengguna (UI) yang intuitif, modern, dan responsif.
*   **Vanilla JavaScript:** Pengelolaan state dan interaktivitas murni tanpa framework JS (React/Vue/Angular).
*   **Alur Realistis:** Simulasi alur pembayaran yang mirip dengan aplikasi nyata seperti Tokopedia, Dana, atau PLN Mobile.
*   **Persistence:** Data transaksi dapat disimpan dan bertahan di dalam `localStorage`.
*   **User Feedback:** Menyediakan *loading state*, validasi form, notifikasi, konfirmasi, dan bukti transaksi yang jelas.

### Ketentuan Desain Berdasarkan NIM:
*   **NIM Ganjil:** Fokus mempercantik dan mengoptimalkan tampilan **Desktop**.
*   **NIM Genap:** Fokus mempercantik dan mengoptimalkan tampilan **Mobile**.

> **Tema Aplikasi:** "BayarKita" atau nama lain yang kreatif (mahasiswa dibebaskan memberi nama sendiri).
> **Tugas Tambahan:** Buat video tutorial penggunaan aplikasi dengan durasi maksimal **5 menit**, lalu unggah ke YouTube.

---

## 2. Tujuan Pembelajaran (Learning Outcomes)
Setelah menyelesaikan tugas ini, mahasiswa diharapkan mampu:
1. Merancang dan mengimplementasikan layout responsif menggunakan CSS modern (Flexbox/Grid) atau framework CSS (Tailwind/Bootstrap via CDN).
2. Menguasai DOM manipulation, event handling, dan dynamic content rendering dengan JavaScript.
3. Menerapkan form handling yang baik: validasi input, error handling, dan user feedback.
4. Mengelola state aplikasi secara client-side (object JavaScript + localStorage).
5. Membangun alur user journey yang lengkap: input $\rightarrow$ validasi $\rightarrow$ preview $\rightarrow$ konfirmasi $\rightarrow$ hasil.
6. Menerapkan prinsip accessibility (ARIA, semantic HTML, keyboard navigation) dan mobile-first design.
7. Mendokumentasikan proyek dengan baik (README + komentar kode).

---

## 3. Fitur Wajib yang Harus Diimplementasikan

### 3.1 Halaman / Section Utama (SPA Style)
Aplikasi minimal memiliki 4–5 section/view yang bisa diakses via navbar atau tab navigation tanpa *reload* halaman:

| No | Section | Deskripsi Singkat |
| :--- | :--- | :--- |
| 1 | **Dashboard / Beranda** | Ringkasan saldo simulasi, quick access tombol kategori layanan, dan promo banner. |
| 2 | **Bayar Tagihan** | Pilihan kategori: Listrik (PLN), PDAM, Internet, dan Seminar/Event. |
| 3 | **Biaya Kuliah / SPP** | Fitur khusus input NIM $\rightarrow$ tampil daftar cicilan semester mahasiswa. |
| 4 | **Isi Pulsa & Paket** | Pengisian pulsa & paket data berbagai provider telekomunikasi. |
| 5 | **Riwayat Transaksi** | Tabel histori transaksi yang tersimpan di `localStorage`. |

**Fitur Opsional (Nilai Tambah):**
*   Halaman Profil User (fake login)
*   Halaman Bantuan / FAQ
*   Dark / Light mode toggle

### 3.2 Detail Fitur per Kategori

#### A. Tagihan Umum (Listrik/PLN, PDAM, Internet, Seminar)
*   **Form Input:** 
    *   Input utama: Nomor Pelanggan / ID Pelanggan / No. Referensi.
    *   Tombol "Cek Tagihan".
    *   Validasi: minimal 8–12 karakter, hanya angka (kecuali untuk Seminar bisa alphanumeric).
*   **Hasil Cek Tagihan (Tampil di Card/Modal):**
    *   Nama Pelanggan, Alamat / Periode Tagihan, Jumlah Tagihan Pokok + Denda (jika ada), Total yang harus dibayar, dan Tanggal jatuh tempo.
*   **Pilihan Metode Pembayaran (Wajib Minimal 3):**
    *   *Virtual Account:* Generate nomor VA unik (simulasi) + instruksi transfer bank (BCA, BNI, Mandiri, dll).
    *   *QRIS:* Tampilkan QR code simulasi (bisa pakai CDN `qrcode.js` atau gambar placeholder + countdown timer 5 menit).
    *   *Bayar di Teller / Kasir:* Tampilkan kode pembayaran + daftar lokasi/alamat kantor (simulasi).
*   **Proses Pembayaran:**
    *   Tombol "Bayar Sekarang" dengan *Loading state* (spinner + teks "Memproses pembayaran...").
    *   **Setelah Sukses:** Modal konfirmasi + Bukti Pembayaran / Struk (bisa dicetak dengan `window.print()` atau di-generate PDF pakai `jsPDF` via CDN) serta simpan transaksi ke `localStorage`.

#### B. Fitur Khusus: Cicilan Biaya Kuliah / SPP (Fitur Unggulan)
*   **Input NIM (Nomor Induk Mahasiswa):** Validasi format NIM (misal: 12 digit angka) + Tombol "Lihat Tagihan Semester".
*   **Tampilan Daftar Tagihan:** Setelah NIM valid, tampilkan tabel/card list berisi semua cicilan satu semester (minimal 6–8 item).
    *   Kolom: No, Deskripsi (contoh: *"SPP Semester Ganjil 2025/2026 - Cicilan ke-1"*), Jumlah, Status (Lunas / Belum Lunas), Checkbox.
    *   Mahasiswa bisa memilih beberapa cicilan sekaligus untuk dibayar (Total otomatis terhitung berdasarkan pilihan).
*   **Input No Tagihan (Kode Tagihan):** Alternatif untuk menampilkan data detail tagihan spesifik. Contoh data: `986248962486438 | tagihan UTS | Semester 20252 | Belum Lunas`.

#### C. Pengisian Pulsa & Paket Data
*   **Pilihan Provider:** Ditampilkan sebagai grid card dengan logo (Telkomsel, XL Axiata, Indosat Ooredoo, Tri (3), Smartfren, Axis).
*   **Form Input:**
    *   Input nomor HP (validasi 10–13 digit, wajib mulai dengan 08).
    *   Pilihan nominal pulsa: Rp10.000, Rp25.000, Rp50.000, Rp100.000, Rp200.000 (bisa custom input) atau pilih Paket Data populer.
*   **Preview Sebelum Bayar:** Detail nomor tujuan, Provider, Nominal, dan Harga. Metode pembayaran & proses mengacu pada poin A.

### 3.3 Fitur Pendukung Wajib (Frontend)

| Fitur | Keterangan | Teknik yang Diharapkan |
| :--- | :--- | :--- |
| **Responsive Design** | Tampil sempurna di mobile, tablet, desktop | CSS Grid + Flexbox + Media Queries / Tailwind |
| **Form Validation** | Real-time & on submit | JavaScript `addEventListener`, regex, custom error |
| **Dynamic Content** | Semua data tagihan & riwayat dirender via JS | `innerHTML`, `createElement`, template literals |
| **State Management** | Simpan data transaksi & user | `localStorage` + JavaScript object |
| **Notifikasi** | Sukses, error, info | Toast notification (library ringan / custom) |
| **Loading State** | Saat cek tagihan & proses bayar | Spinner / skeleton screen |
| **Modal / Popup** | Konfirmasi & struk belanja | Bootstrap Modal / custom CSS modal |
| **Riwayat Transaksi** | Tabel lengkap + filter sederhana | `localStorage` + render ulang tabel |
| **Print Struk** | Bukti pembayaran bisa dicetak | `window.print()` + CSS print media query |

---

## 4. Spesifikasi Teknis

### 4.1 Teknologi yang Diperbolehkan
*   **Wajib:** HTML5, CSS3 (Flexbox, Grid, Custom Properties), Vanilla JavaScript (ES6+).
*   **Pilihan CDN (Nilai Tambah):**
    *   Tailwind CSS (`play.tailwindcss.com`) atau Bootstrap 5
    *   Font Awesome / Heroicons
    *   `qrcode.js` (untuk QRIS)
    *   `jsPDF` (untuk cetak struk PDF)
    *   `Chart.js` (untuk statistik pengeluaran di riwayat transaksi)

### 4.2 Data Simulasi (Hardcoded di JavaScript)
Siapkan berkas data dummy (`data.js`) terpisah yang berisi data realistis:
*   Minimal 5 nomor pelanggan PLN dengan tagihan berbeda.
*   Minimal 3 nomor PDAM dan 3 nomor Internet.
*   Minimal 3 NIM mahasiswa dengan 6–8 cicilan per semester.
*   Mapping prefix nomor HP ke provider untuk validasi otomatis.

```javascript
// Contoh struktur data di data.js
const billData = {
  pln: {
    "123456789012": { name: "Budi Santoso", amount: 245000, period: "Juli 2026" }
  },
  pdam: { /* ... */ },
  spp: {
    "202310001": [
      { id: 1, desc: "Cicilan SPP 1", amount: 2500000, status: "unpaid" },
      { id: 2, desc: "Biaya UTS", amount: 500000, status: "unpaid" }
    ]
  }
};

## 5. Kriteria Penilaian (Rubrik)
* 35% Fungsionalitas Fitur: Semua fitur wajib berjalan dengan benar, terutama alur khusus Biaya Kuliah & 3 metode pembayaran.
* 25% Kualitas UI/UX: Desain modern, konsisten, responsif, mudah digunakan, kelengkapan loading state, dan notifikasi.
* 20% Kualitas Kode JavaScript: Struktur kode rapi, bebas bug, validasi kokoh, pemanfaatan localStorage, serta kejelasan komentar.
* 10% Kreativitas & Extra Features: Tema warna brand yang menarik, animasi halus, fitur dark mode, export PDF, atau chart statistik.
* 10% Dokumentasi & Presentasi: Kelengkapan file README.md dan kualitas presentasi/demo.

## 6. Panduan Pengerjaan & Tips
* UI Terlebih Dahulu: Buat layout statis HTML + CSS sebelum mulai menambahkan logika JavaScript.
* Pendekatan Modular: Pisahkan file data dummy, utility function, dan core logic aplikasi.
* Simulasi API Call: Gunakan fungsi setTimeout() (durasi 800–1500ms) untuk memberikan efek loading yang realistis.
* Validasi Ketat: Terapkan Regex untuk memeriksa format nomor HP, NIM, dan nomor pelanggan.
* Uji Responsivitas: Manfaatkan Chrome DevTools (Responsive Mode) untuk memastikan kecocokan tampilan desktop/mobile sesuai ketentuan NIM.

## Edge Case yang Wajib Ditangani:
* Input NIM yang tidak terdaftar di sistem.
* Membayar tagihan yang statusnya sudah lunas.
* Input nomor HP yang tidak valid atau kurang digit.
* Mengeklik tombol bayar tanpa memilih metode pembayaran terlebih dahulu.
* Menyediakan fitur hapus riwayat (clear history) transaksi.

## 7. Deliverables (Berkas yang Harus Dikumpulkan)
Kumpulkan folder proyek dalam bentuk ZIP atau kumpulkan tautan Repositori GitHub (Open/Public) yang berisi:
### Source Code lengkap aplikasi (HTML, CSS, JS, Aset gambar/logo).
### File README.md yang memuat:
* Nama aplikasi & Identitas Mahasiswa.
* Deskripsi singkat aplikasi.
* Cara menjalankan aplikasi (cukup buka index.html).
* Daftar fitur yang berhasil diimplementasikan.
* Screenshot tampilan aplikasi di desktop & mobile.
* Tautan demo online (jika di-deploy ke GitHub Pages / Netlify / Vercel).
* Tautan video demo penggunaan di YouTube (maksimal 5 menit).

## 8. Referensi & Inspirasi
### Aplikasi nyata: PLN Mobile, Tokopedia Bayar Tagihan, Dana, LinkAja, ShopeePay
### Desain modern: Gunakan warna hijau/teal untuk kesan "keuangan kepercayaan"
### Library yang direkomendasikan (via CDN):
* Tailwind CSS
* Font Awesome 6
* qrcode.js
* jsPDF