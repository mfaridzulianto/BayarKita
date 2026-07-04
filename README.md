# 💳 BayarKita – Bill Payment & Top-Up Web App

Aplikasi web *client-side* murni (Single Page Application) untuk mensimulasikan pembayaran berbagai tagihan rutin (PLN, PDAM, Internet, Seminar) serta pembelian pulsa dan cicilan biaya kuliah (SPP) secara modern, responsif, dan interaktif.

---

## 👤 Identitas Mahasiswa
*   **Nama:** M. Farid Zulianto
*   **NIM:** 221011402463
*   **Kelas:** 07TPLE006
*   **Mata Kuliah:** PEMROGRAMAN WEB 2
---

## 📝 Deskripsi Singkat Aplikasi
**BayarKita** dirancang mirip dengan alur aplikasi pembayaran nyata (seperti Tokopedia, Dana, atau PLN Mobile). Aplikasi ini memiliki sistem *state management* lokal menggunakan `localStorage` untuk menyimpan riwayat transaksi dan saldo simulasi (default: Rp 5.000.000). 

Aplikasi ini menggunakan **Vanilla JavaScript** (ES6+), **Vanilla CSS** untuk desain visual premium (dengan dukungan Dark/Light Mode), serta memanfaatkan CDN eksternal seperti *Font Awesome*, *qrcode.js* (untuk generator kode QRIS), dan *jsPDF* (untuk mencetak bukti pembayaran ke format PDF).

---

## 🚀 Cara Menjalankan Aplikasi
Karena sepenuhnya berjalan di sisi klien (*client-side*):
1.  **Metode Langsung:** Cukup klik dua kali (atau buka) file `index.html` di browser pilihan Anda (Chrome, Edge, Firefox, dll).
2.  **Metode Local Web Server (XAMPP/Apache):**
    *   Letakkan folder proyek di direktori `C:\xampp\htdocs\UAS\`
    *   Nyalakan **Apache** melalui *XAMPP Control Panel*.
    *   Buka browser dan ketik alamat: **`http://localhost/UAS/index.html`**

---

## 🌟 Daftar Fitur yang Berhasil Diimplementasikan

### 1. Dashboard / Beranda
*   **Ringkasan Dompet Virtual:** Menampilkan saldo simulasi (bisa disegarkan/refresh).
*   **Kartu Statistik Real-time:** Menampilkan total transaksi, pengeluaran bulan ini, dan transaksi terakhir.
*   **Akses Cepat (Quick Access):** Jalan pintas navigasi langsung ke layanan terkait.
*   **Promo Banner:** Banner iklan promosi yang mempercantik interface.

### 2. Pembayaran Tagihan Umum (Listrik PLN, PDAM, Internet, Seminar)
*   **Validasi Input Ketat:** Format regex untuk membedakan nomor PLN/PDAM (hanya angka), Internet & Seminar (alfanumerik).
*   **Simulasi Penemuan ID:** Menampilkan denda, biaya admin, nama pelanggan, jatuh tempo, dll.
*   **Edge Case Handled:** Pengecekan nomor ID yang tidak terdaftar akan memicu toast error.

### 3. Modul Khusus: Biaya Kuliah / SPP (Unggulan)
*   **Cari via NIM:** Membuka list tagihan semester (SPP Pokok, UTS, UAS, Praktikum, Perpustakaan, Asuransi).
*   **Cari via Kode Tagihan:** Masukan alternatif menggunakan 15 digit kode unik tagihan.
*   **Daftar Cicilan Interaktif:** Dilengkapi check-all checkbox, kalkulasi otomatis total biaya, dan validasi status lunas (tagihan yang lunas otomatis terkunci).

### 4. Pengisian Pulsa & Paket Data
*   **Deteksi Provider Otomatis:** Mengetik 4 digit pertama HP langsung mendeteksi logo provider (Telkomsel, Indosat, XL, Tri, Axis, Smartfren).
*   **Paket Data & Nominal Grid:** Pilihan instan pulsa dan paket data beserta form custom input nominal pulsa.

### 5. Multi-Metode Pembayaran (3 Opsi)
*   **Virtual Account (VA):** Generator kode transfer VA unik sesuai bank pilihan (BCA, BNI, Mandiri, BRI, CIMB).
*   **QRIS Instant:** Menampilkan QR code dinamis (menggunakan qrcode.js) beserta hitung mundur (countdown timer) 5 menit.
*   **Teller / Kasir Mitra:** Kode barcode kasir & daftar lokasi ritel (Alfamart/Indomaret) terdekat.

### 6. Riwayat Transaksi
*   **Tabel Riwayat Dinamis:** Tersimpan aman di `localStorage`.
*   **Filter & Pencarian:** Menyaring riwayat berdasarkan kategori layanan & status pembayaran.
*   **Hapus Riwayat (Clear History):** Membersihkan memori transaksi dari browser.
*   **Ekspor Data:** Fitur ekspor seluruh data riwayat menjadi file `.csv`.

### 7. User Experience & Fitur Tambahan (Nilai Tambah / Opsional)
*   **Halaman Profil User (Fake Login):** Simulasi login 3 akun mahasiswa demo (Budi Santoso, Siti Rahayu, Rizal Firmansyah). Mengganti akun demo akan otomatis mem-bypass data NIM di bagian SPP serta No HP di bagian Pulsa untuk alur pengujian instan.
*   **Top Up Dompet Virtual:** Memungkinkan pengisian saldo dompet simulasi langsung dari halaman profil.
*   **Halaman Bantuan / FAQ Accordion:** Pusat bantuan interaktif dengan list FAQ bertipe accordion untuk menjawab pertanyaan teknis transaksi.
*   **Dark Mode Toggle:** Modus malam yang halus dengan penyimpanan state di `localStorage`.
*   **Cetak Struk & PDF:** Cetak fisik via `window.print()` dan unduhan PDF instan menggunakan `jsPDF`.
*   **Notifikasi Toast:** Sistem pemberitahuan status transaksi dan error validation yang modern.

---

## 📱 Screenshot Tampilan Aplikasi

| Tampilan Desktop | Tampilan Mobile |
| :---: | :---: |
| ![Desktop Screenshot](screenshots/desktop.png) | ![Mobile Screenshot](screenshots/mobile.png) |

---

## 🔗 Tautan Demo & Video Presentasi
*   **Demo Live Online:** [Link GitHub Pages / Vercel / Netlify Anda]
*   **Video Demo YouTube (Maks 5 Menit):** [Link Video Demonstrasi Aplikasi Anda]
