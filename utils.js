/**
 * utils.js - BayarKita Utility Functions
 * Berisi fungsi-fungsi helper yang digunakan di seluruh aplikasi
 */

// =============================================
// FORMAT CURRENCY
// =============================================
/**
 * Format angka ke format mata uang Rupiah
 * @param {number} amount - Jumlah dalam angka
 * @returns {string} - Format Rp xxx.xxx
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// =============================================
// FORMAT TANGGAL
// =============================================
/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date - Tanggal
 * @returns {string} - Format dd MMMM yyyy
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Format tanggal & waktu ke format Indonesia
 * @param {string|Date} date - Tanggal
 * @returns {string} - Format dd MMMM yyyy HH:mm
 */
function formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// =============================================
// VALIDASI INPUT
// =============================================
/**
 * Validasi nomor pelanggan PLN/PDAM (8-12 digit angka)
 * @param {string} num - Nomor pelanggan
 * @returns {boolean}
 */
function validateCustomerNumber(num) {
    return /^\d{8,12}$/.test(num.trim());
}

/**
 * Validasi ID Internet (alphanumeric dengan tanda hubung)
 * @param {string} id - ID Internet
 * @returns {boolean}
 */
function validateInternetId(id) {
    return /^[A-Z0-9\-]{6,15}$/.test(id.trim().toUpperCase());
}

/**
 * Validasi kode seminar (alphanumeric)
 * @param {string} code - Kode seminar
 * @returns {boolean}
 */
function validateSeminarCode(code) {
    return /^[A-Z0-9]{6,12}$/.test(code.trim().toUpperCase());
}

/**
 * Validasi NIM Mahasiswa (12 digit angka)
 * @param {string} nim - NIM mahasiswa
 * @returns {boolean}
 */
function validateNIM(nim) {
    return /^\d{12}$/.test(nim.trim());
}

/**
 * Validasi Kode Tagihan SPP (15 digit angka)
 * @param {string} code - Kode tagihan
 * @returns {boolean}
 */
function validateBillCode(code) {
    return /^\d{15}$/.test(code.trim());
}

/**
 * Validasi nomor HP Indonesia (10-13 digit, dimulai dengan 08)
 * @param {string} phone - Nomor HP
 * @returns {boolean}
 */
function validatePhone(phone) {
    return /^08\d{8,11}$/.test(phone.trim());
}

// =============================================
// DETEKSI PROVIDER HP
// =============================================
/**
 * Deteksi provider berdasarkan prefix nomor HP
 * @param {string} phone - Nomor HP
 * @returns {string|null} - Nama provider atau null
 */
function detectProvider(phone) {
    if (phone.length >= 4) {
        const prefix = phone.substring(0, 4);
        return phoneProviders[prefix] || null;
    }
    return null;
}

// =============================================
// GENERATE ID UNIK
// =============================================
/**
 * Generate nomor transaksi unik
 * @returns {string} - Nomor transaksi format TRX-YYYYMMDD-XXXXXX
 */
function generateTransactionId() {
    const now = new Date();
    const datePart = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    const randPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRX-${datePart}-${randPart}`;
}

/**
 * Generate nomor Virtual Account
 * @param {string} bankPrefix - Prefix nomor bank
 * @returns {string} - Nomor VA 16 digit
 */
function generateVirtualAccount(bankPrefix) {
    const rand = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    return bankPrefix + rand;
}

/**
 * Generate kode bayar di kasir
 * @returns {string} - Kode kasir 12 digit
 */
function generateKasirCode() {
    return Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
}

// =============================================
// TOAST NOTIFICATION
// =============================================
/**
 * Tampilkan toast notification
 * @param {string} message - Pesan notifikasi
 * @param {string} type - Tipe: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Durasi tampil dalam ms (default: 3500)
 */
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconMap = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${iconMap[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    // Trigger animasi masuk
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// =============================================
// SIMULASI API CALL (setTimeout)
// =============================================
/**
 * Simulasi API call dengan delay realistis
 * @param {Function} callback - Fungsi yang dijalankan setelah delay
 * @param {number} minMs - Delay minimum (default: 800)
 * @param {number} maxMs - Delay maksimum (default: 1500)
 */
function simulateApiCall(callback, minMs = 800, maxMs = 1500) {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return setTimeout(callback, delay);
}

// =============================================
// LOADING STATE HELPER
// =============================================
/**
 * Set loading state pada tombol
 * @param {HTMLElement} btn - Elemen tombol
 * @param {boolean} isLoading - Status loading
 * @param {string} loadingText - Teks saat loading
 * @param {string} originalText - Teks asli tombol
 */
function setButtonLoading(btn, isLoading, loadingText = 'Memproses...', originalText = '') {
    if (isLoading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = `<span class="spinner"></span> ${loadingText}`;
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText || originalText;
    }
}

// =============================================
// LOCAL STORAGE HELPERS
// =============================================
function getActiveNim() {
    return typeof activeUserNim !== 'undefined' ? activeUserNim : '221011402463';
}

/**
 * Simpan transaksi ke localStorage
 * @param {Object} transaction - Data transaksi
 */
function saveTransaction(transaction) {
    const nim = getActiveNim();
    const transactions = getTransactions();
    transactions.unshift(transaction); // Tambah di awal
    localStorage.setItem('bayarkita_transactions_' + nim, JSON.stringify(transactions));
}

/**
 * Ambil semua transaksi dari localStorage
 * @returns {Array} - Array transaksi
 */
function getTransactions() {
    const nim = getActiveNim();
    const data = localStorage.getItem('bayarkita_transactions_' + nim);
    return data ? JSON.parse(data) : [];
}

/**
 * Hapus semua transaksi dari localStorage
 */
function clearTransactions() {
    const nim = getActiveNim();
    localStorage.removeItem('bayarkita_transactions_' + nim);
}

/**
 * Simpan saldo simulasi ke localStorage
 * @param {number} balance - Saldo baru
 */
function saveBalance(balance) {
    const nim = getActiveNim();
    localStorage.setItem('bayarkita_balance_' + nim, balance.toString());
}

/**
 * Ambil saldo simulasi dari localStorage
 * @returns {number} - Saldo saat ini
 */
function getBalance() {
    const nim = getActiveNim();
    const bal = localStorage.getItem('bayarkita_balance_' + nim);
    return bal ? parseInt(bal) : 5000000; // Default saldo 5 juta
}

// =============================================
// PRINT STRUK
// =============================================
/**
 * Print struk pembayaran
 * @param {string} receiptId - ID modal struk
 */
function printReceipt(receiptId) {
    window.print();
}

// =============================================
// ESCAPE HTML (Keamanan)
// =============================================
/**
 * Escape karakter HTML untuk mencegah XSS
 * @param {string} str - String input
 * @returns {string} - String yang sudah di-escape
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// =============================================
// DARK MODE
// =============================================
/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('bayarkita_darkmode', isDark ? '1' : '0');
    updateDarkModeIcon(isDark);
}

/**
 * Inisialisasi dark mode dari localStorage
 */
function initDarkMode() {
    const isDark = localStorage.getItem('bayarkita_darkmode') === '1';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeIcon(isDark);
}

/**
 * Update ikon dark mode toggle
 * @param {boolean} isDark - Status dark mode
 */
function updateDarkModeIcon(isDark) {
    const icon = document.getElementById('darkmode-icon');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}
