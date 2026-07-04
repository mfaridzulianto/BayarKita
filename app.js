/**
 * app.js - BayarKita Core Logic
 * Mengelola navigasi SPA, validasi form, interaksi data, state management,
 * simulasi API, pembayaran, dan riwayat transaksi.
 */

// State Global Aplikasi
let currentSection = 'dashboard';
let currentCategory = 'PLN'; // PLN, PDAM, Internet, Seminar
let currentSppTab = 'nim'; // nim, code
let currentPulsaType = 'pulsa'; // pulsa, data
let selectedProvider = '';
let selectedPulsaIndex = -1;
let selectedDataIndex = -1;

// Akun Demo (Fake Login)
let activeUserNim = '221011402463';
const demoUsers = {
    "221011402463": { name: "M. Farid Zulianto", phone: "081234567890", role: "Mahasiswa Aktif (NIM: 221011402463)" },
    "221011402465": { name: "Nandi Mulyana", phone: "085712345678", role: "Mahasiswa Aktif (NIM: 221011402465)" },
    "221011402467": { name: "Salsabilla", phone: "089612345678", role: "Mahasiswa Aktif (NIM: 221011402467)" }
};

// Temp State untuk Alur Pembayaran Aktif
let activeBill = null; // Menyimpan data tagihan yang sedang dicek
let selectedPaymentMethod = '';
let countdownInterval = null;

// State Biaya Kuliah (SPP) berdasarkan Semester
let selectedSppSemester = '';
let sppSemesterCache = {};

// =============================================
// INISIALISASI APLIKASI
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initApp();
});

function initApp() {
    // Load SPP Data & Cache from localStorage
    const savedSppData = localStorage.getItem('sppData');
    if (savedSppData) {
        try {
            const parsed = JSON.parse(savedSppData);
            Object.assign(sppData, parsed);
        } catch (e) {
            console.error("Error loading sppData from localStorage", e);
        }
    }
    const savedSppSemesterCache = localStorage.getItem('sppSemesterCache');
    if (savedSppSemesterCache) {
        try {
            sppSemesterCache = JSON.parse(savedSppSemesterCache);
        } catch (e) {
            console.error("Error loading sppSemesterCache from localStorage", e);
        }
    }

    // Render info saldo di dashboard
    updateBalanceDisplay();
    updateDashboardStats();
    renderRecentTransactions();
    
    // Inisialisasi provider grid
    renderProviders();

    // Render contoh ID di section tagihan
    updateSampleIdsHint();

    // Render data profil default
    updateProfileView();

    // Event listener untuk SPP Semester select
    const sppSemesterSelect = document.getElementById('spp-semester-select');
    if (sppSemesterSelect) {
        sppSemesterSelect.addEventListener('change', (e) => {
            handleSemesterFilter(e.target.value);
        });
    }

    // Set default hash navigation
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
}

// =============================================
// ROUTING & NAVIGASI (SPA STYLE)
// =============================================
function handleRouting() {
    const hash = window.location.hash.substring(1) || 'dashboard';
    const parts = hash.split('/');
    const section = parts[0];
    const subParam = parts[1];

    navigateToSection(section);

    if (section === 'tagihan' && subParam) {
        // Klik quick access dari dashboard
        const tabBtn = document.querySelector(`.tab-btn[data-category="${subParam}"]`);
        if (tabBtn) switchCategory(tabBtn, subParam);
    }
}

function navigateTo(section, subParam = '') {
    if (subParam) {
        window.location.hash = `${section}/${subParam}`;
    } else {
        window.location.hash = section;
    }
}

function navigateToSection(sectionId) {
    const sections = ['dashboard', 'tagihan', 'spp', 'pulsa', 'riwayat', 'profile', 'help'];
    if (!sections.includes(sectionId)) return;

    currentSection = sectionId;

    // Hapus class active dari semua section & nav link
    sections.forEach(s => {
        const secEl = document.getElementById(`section-${s}`);
        if (secEl) secEl.classList.remove('active');
        
        const navEl = document.getElementById(`nav-${s}`);
        if (navEl) navEl.classList.remove('active');
    });

    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) profileBtn.classList.remove('active');

    // Set active pada section & nav link yang dipilih
    const activeSec = document.getElementById(`section-${sectionId}`);
    if (activeSec) activeSec.classList.add('active');

    if (sectionId === 'profile') {
        if (profileBtn) profileBtn.classList.add('active');
    } else {
        const activeNav = document.getElementById(`nav-${sectionId}`);
        if (activeNav) activeNav.classList.add('active');
    }

    // Close mobile menu if open
    const navBarNav = document.getElementById('navbar-nav');
    if (navBarNav) navBarNav.classList.remove('open');

    // Trigger update data spesifik section
    if (sectionId === 'dashboard') {
        updateBalanceDisplay();
        updateDashboardStats();
        renderRecentTransactions();
    } else if (sectionId === 'riwayat') {
        renderHistory();
    } else if (sectionId === 'profile') {
        updateProfileView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const navBarNav = document.getElementById('navbar-nav');
    if (navBarNav) navBarNav.classList.toggle('open');
}

// =============================================
// DASHBOARD LOGIC
// =============================================
function updateBalanceDisplay() {
    const balance = getBalance();
    const displayBal = document.getElementById('display-balance');
    if (displayBal) displayBal.innerText = formatCurrency(balance);
}

function refreshBalance() {
    const refreshBtn = document.querySelector('.balance-refresh');
    if (refreshBtn) refreshBtn.querySelector('i').classList.add('fa-spin');
    
    simulateApiCall(() => {
        updateBalanceDisplay();
        showToast('Saldo berhasil diperbarui', 'success');
        if (refreshBtn) refreshBtn.querySelector('i').classList.remove('fa-spin');
    }, 500, 800);
}

function updateDashboardStats() {
    const txs = getTransactions();
    const statTotal = document.getElementById('stat-total');
    const statBulan = document.getElementById('stat-bulan');
    const statTerakhir = document.getElementById('stat-terakhir');

    if (statTotal) statTotal.innerText = txs.length;

    // Hitung pengeluaran bulan ini (Juli 2026 berdasarkan metadata/data dummy)
    let monthlySpend = 0;
    const now = new Date();
    txs.forEach(t => {
        if (t.status === 'Sukses') {
            monthlySpend += t.amount;
        }
    });
    if (statBulan) statBulan.innerText = formatCurrency(monthlySpend);

    if (statTerakhir) {
        if (txs.length > 0) {
            const lastTx = txs[0];
            statTerakhir.innerText = formatCurrency(lastTx.amount);
            statTerakhir.title = `${lastTx.service} (${lastTx.desc})`;
        } else {
            statTerakhir.innerText = '—';
        }
    }
}

function renderRecentTransactions() {
    const recentDiv = document.getElementById('dashboard-recent');
    if (!recentDiv) return;

    const txs = getTransactions().slice(0, 3); // Ambil 3 teratas

    if (txs.length === 0) {
        recentDiv.innerHTML = `
            <div class="card" style="text-align:center;padding:30px;color:var(--text-muted);">
                <p>Belum ada riwayat transaksi terbaru.</p>
            </div>
        `;
        return;
    }

    let html = '<div style="display:flex;flex-direction:column;gap:12px;">';
    txs.forEach(t => {
        const iconClass = getServiceIcon(t.category);
        html += `
            <div class="card" style="padding:16px;display:flex;align-items:center;justify-content:between;gap:16px;">
                <div class="quick-btn" style="border:none;box-shadow:none;padding:0;margin:0;cursor:default;">
                    <div class="icon ${iconClass}" style="width:40px;height:40px;font-size:1.1rem;"><i class="${getFaIcon(t.category)}"></i></div>
                </div>
                <div style="flex:1;">
                    <h4 style="font-weight:700;font-size:0.9rem;">${t.service}</h4>
                    <p style="font-size:0.75rem;color:var(--text-muted);">${formatDateTime(t.date)} • ${t.desc}</p>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:800;font-size:0.95rem;color:var(--primary);">${formatCurrency(t.amount)}</div>
                    <span class="badge ${t.status === 'Sukses' ? 'badge-success' : t.status === 'Pending' ? 'badge-pending' : 'badge-fail'}">${t.status}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    recentDiv.innerHTML = html;
}

function getServiceIcon(cat) {
    switch (cat) {
        case 'PLN': return 'icon-pln';
        case 'PDAM': return 'icon-pdam';
        case 'Internet': return 'icon-internet';
        case 'SPP': return 'icon-spp';
        case 'Pulsa': return 'icon-pulsa';
        default: return 'icon-seminar';
    }
}

function getFaIcon(cat) {
    switch (cat) {
        case 'PLN': return 'fas fa-bolt';
        case 'PDAM': return 'fas fa-tint';
        case 'Internet': return 'fas fa-wifi';
        case 'SPP': return 'fas fa-graduation-cap';
        case 'Pulsa': return 'fas fa-mobile-alt';
        default: return 'fas fa-chalkboard-teacher';
    }
}

// =============================================
// TAGIHAN UMUM LOGIC (PLN, PDAM, Internet, Seminar)
// =============================================
function switchCategory(btn, category) {
    currentCategory = category;

    // Toggle active tab buttons
    document.querySelectorAll('.category-tabs .tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Reset Form & Hasil
    const input = document.getElementById('customer-number');
    const err = document.getElementById('customer-error');
    const resultDiv = document.getElementById('bill-result');
    
    if (input) {
        input.value = '';
        input.classList.remove('error');
    }
    if (err) err.classList.remove('show');
    if (resultDiv) resultDiv.classList.remove('show');

    // Update label & placeholder
    const label = document.getElementById('customer-label');
    if (label) {
        label.innerText = `Nomor Pelanggan ${category}`;
    }
    if (input) {
        if (category === 'Internet') {
            input.placeholder = "Contoh: INT-2024-001 (Alfanumerik)";
        } else if (category === 'Seminar') {
            input.placeholder = "Contoh: SEM2026001 (Alfanumerik)";
        } else {
            input.placeholder = "Masukkan nomor pelanggan (8-12 digit angka)";
        }
    }

    updateSampleIdsHint();
}

function updateSampleIdsHint() {
    const hintDiv = document.getElementById('sample-ids');
    if (!hintDiv) return;

    let samples = [];
    if (currentCategory === 'PLN') {
        samples = Object.keys(plnData).slice(0, 3);
    } else if (currentCategory === 'PDAM') {
        samples = Object.keys(pdamData).slice(0, 3);
    } else if (currentCategory === 'Internet') {
        samples = Object.keys(internetData).slice(0, 3);
    } else if (currentCategory === 'Seminar') {
        samples = Object.keys(seminarData).slice(0, 3);
    }

    hintDiv.innerHTML = samples.map(s => `<code onclick="useSampleId('${s}')" style="cursor:pointer;text-decoration:underline;margin-right:8px;">${s}</code>`).join('');
}

function useSampleId(id) {
    const input = document.getElementById('customer-number');
    if (input) {
        input.value = id;
        input.focus();
    }
}

function cekTagihan() {
    const input = document.getElementById('customer-number');
    const err = document.getElementById('customer-error');
    const btn = document.getElementById('btn-cek-tagihan');
    const resultDiv = document.getElementById('bill-result');

    if (!input) return;
    const value = input.value.trim();

    // Validasi Form
    let isValid = false;
    let errMsg = '';

    if (currentCategory === 'Internet') {
        isValid = validateInternetId(value);
        errMsg = 'ID Internet tidak valid. Format: INT-XXXX-XXX (Alfanumerik)';
    } else if (currentCategory === 'Seminar') {
        isValid = validateSeminarCode(value);
        errMsg = 'Kode Seminar tidak valid. Format: 6-12 digit alfanumerik';
    } else {
        isValid = validateCustomerNumber(value);
        errMsg = 'Nomor pelanggan tidak valid. Wajib 8-12 digit angka.';
    }

    if (!value) {
        errMsg = 'Nomor / ID pelanggan wajib diisi.';
        isValid = false;
    }

    if (!isValid) {
        input.classList.add('error');
        if (err) {
            err.innerText = errMsg;
            err.classList.add('show');
        }
        if (resultDiv) resultDiv.classList.remove('show');
        return;
    }

    // Reset error jika valid
    input.classList.remove('error');
    if (err) err.classList.remove('show');

    // Loading State
    setButtonLoading(btn, true, 'Memeriksa...');

    simulateApiCall(() => {
        setButtonLoading(btn, false);
        
        // Edge Case: Cek jika tagihan umum sudah lunas
        const paidBills = JSON.parse(localStorage.getItem('bayarkita_paid_bills') || '[]');
        const billKey = `${currentCategory}_${value}`;
        if (paidBills.includes(billKey)) {
            input.classList.add('error');
            if (err) {
                err.innerText = 'Tagihan untuk nomor/ID ini sudah lunas.';
                err.classList.add('show');
            }
            showToast('Tagihan sudah lunas!', 'warning');
            if (resultDiv) resultDiv.classList.remove('show');
            return;
        }

        let foundData = null;
        if (currentCategory === 'PLN') foundData = plnData[value];
        else if (currentCategory === 'PDAM') foundData = pdamData[value];
        else if (currentCategory === 'Internet') foundData = internetData[value];
        else if (currentCategory === 'Seminar') foundData = seminarData[value];

        // Edge Case: ID tidak ditemukan
        if (!foundData) {
            input.classList.add('error');
            if (err) {
                err.innerText = 'Nomor Pelanggan tidak terdaftar di sistem simulasi.';
                err.classList.add('show');
            }
            showToast('Tagihan tidak ditemukan!', 'error');
            if (resultDiv) resultDiv.classList.remove('show');
            return;
        }

        activeBill = {
            id: value,
            category: currentCategory,
            name: foundData.name,
            address: foundData.address,
            period: foundData.period,
            dueDate: foundData.dueDate,
            amount: foundData.amount,
            fine: foundData.fine || 0,
            total: foundData.amount + (foundData.fine || 0),
            detail: foundData.tariff || foundData.package || foundData.event || foundData.zone || ''
        };

        renderBillResult();
        showToast('Tagihan ditemukan.', 'success');
    });
}

function renderBillResult() {
    const resultDiv = document.getElementById('bill-result');
    const contentDiv = document.getElementById('bill-result-content');
    if (!resultDiv || !contentDiv) return;

    let extraLabel = 'Detail';
    if (activeBill.category === 'PLN') extraLabel = 'Tarif / Daya';
    else if (activeBill.category === 'PDAM') extraLabel = 'Zona / Penggunaan';
    else if (activeBill.category === 'Internet') extraLabel = 'Paket Layanan';
    else if (activeBill.category === 'Seminar') extraLabel = 'Nama Event';

    contentDiv.innerHTML = `
        <div class="bill-info" style="margin-top:16px;">
            <div class="bill-info-item">
                <label>Nama Pelanggan</label>
                <span>${escapeHtml(activeBill.name)}</span>
            </div>
            <div class="bill-info-item">
                <label>${extraLabel}</label>
                <span>${escapeHtml(activeBill.detail)}</span>
            </div>
            <div class="bill-info-item">
                <label>Periode Tagihan</label>
                <span>${escapeHtml(activeBill.period)}</span>
            </div>
            <div class="bill-info-item">
                <label>Jatuh Tempo</label>
                <span>${formatDate(activeBill.dueDate)}</span>
            </div>
            <div class="bill-info-item">
                <label>Biaya Pokok</label>
                <span>${formatCurrency(activeBill.amount)}</span>
            </div>
            <div class="bill-info-item">
                <label>Denda</label>
                <span class="${activeBill.fine > 0 ? 'color: #EF4444' : ''}">${formatCurrency(activeBill.fine)}</span>
            </div>
        </div>
        <div class="bill-total">
            <span class="bill-total-label">Total Pembayaran</span>
            <span class="bill-total-amount">${formatCurrency(activeBill.total)}</span>
        </div>
    `;

    renderPaymentMethods('payment-methods');
    resultDiv.classList.add('show');
}

function renderPaymentMethods(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    selectedPaymentMethod = '';
    
    // Clear countdown jika ada
    if (countdownInterval) clearInterval(countdownInterval);

    container.innerHTML = `
        <div class="payment-option" onclick="selectPaymentMethod('${containerId}', 'VA')">
            <input type="radio" name="payment_method_opt" value="VA" id="${containerId}-va" />
            <div class="pm-icon"><i class="fas fa-university" style="color:var(--primary);"></i></div>
            <div style="flex:1;">
                <div class="pm-label">Virtual Account (VA)</div>
                <div class="pm-desc">Simulasi transfer melalui Bank Mandiri, BNI, BCA, dll.</div>
            </div>
        </div>
        <div class="payment-option" onclick="selectPaymentMethod('${containerId}', 'QRIS')">
            <input type="radio" name="payment_method_opt" value="QRIS" id="${containerId}-qris" />
            <div class="pm-icon"><i class="fas fa-qrcode" style="color:var(--secondary);"></i></div>
            <div style="flex:1;">
                <div class="pm-label">QRIS Instant</div>
                <div class="pm-desc">Bayar instan pakai saldo OVO, GoPay, Dana, LinkAja.</div>
            </div>
        </div>
        <div class="payment-option" onclick="selectPaymentMethod('${containerId}', 'Teller')">
            <input type="radio" name="payment_method_opt" value="Teller" id="${containerId}-teller" />
            <div class="pm-icon"><i class="fas fa-store" style="color:var(--accent);"></i></div>
            <div style="flex:1;">
                <div class="pm-label">Teller / Kasir Mitra</div>
                <div class="pm-desc">Bayar cash via Alfamart, Indomaret, atau Kantor Pos.</div>
            </div>
        </div>
    `;
}

function selectPaymentMethod(containerId, method) {
    selectedPaymentMethod = method;
    const radio = document.getElementById(`${containerId}-${method.toLowerCase()}`);
    if (radio) radio.checked = true;

    // Highlight card
    const options = radio.closest('.payment-methods').querySelectorAll('.payment-option');
    options.forEach(opt => opt.classList.remove('selected'));
    radio.closest('.payment-option').classList.add('selected');

    // Render detail instruksi bayar sesuai method
    const detailAreaId = containerId === 'payment-methods' ? 'payment-detail-area' : 'pulsa-payment-detail-area';
    const detailArea = document.getElementById(detailAreaId);
    if (!detailArea) return;

    detailArea.classList.remove('show');
    
    if (countdownInterval) clearInterval(countdownInterval);

    setTimeout(() => {
        let html = '';
        if (method === 'VA') {
            html = `
                <div class="payment-detail show">
                    <label>Pilih Bank Virtual Account:</label>
                    <select class="form-control" style="margin-bottom:10px;" onchange="updateVaNumber(this.value, '${detailAreaId}')">
                        <option value="">-- Pilih Bank --</option>
                        ${bankList.map(b => `<option value="${b.prefix}">${b.name}</option>`).join('')}
                    </select>
                    <div id="va-display-area" style="display:none;">
                        <span style="font-size:0.8rem;color:var(--text-muted);">Nomor Virtual Account:</span>
                        <div class="va-number" id="va-number-text"></div>
                        <p style="font-size:0.78rem;color:var(--text-muted);"><i class="fas fa-info-circle"></i> Lakukan transfer persis sesuai nominal tagihan agar sistem otomatis mendeteksi.</p>
                    </div>
                </div>
            `;
        } else if (method === 'QRIS') {
            html = `
                <div class="payment-detail show">
                    <div class="qr-wrapper">
                        <div id="qris-canvas" style="display:inline-block;padding:12px;background:#fff;border-radius:12px;"></div>
                        <div class="qr-timer" id="qris-timer">Selesaikan dalam: 05:00</div>
                    </div>
                </div>
            `;
            setTimeout(() => generateQRISCode('qris-canvas'), 50);
        } else if (method === 'Teller') {
            const code = generateKasirCode();
            html = `
                <div class="payment-detail show">
                    <span style="font-size:0.8rem;color:var(--text-muted);">Kode Pembayaran Kasir:</span>
                    <div class="kasir-code">${code}</div>
                    <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:10px;"><i class="fas fa-info-circle"></i> Tunjukkan kode ini ke kasir Alfamart/Indomaret terdekat.</p>
                    <strong>Lokasi Mitra Terdekat:</strong>
                    <div class="location-list">
                        ${tellerLocations.map(l => `
                            <div class="location-item">
                                <strong>${l.name}</strong>
                                <span>${l.address} (Jam Operasional: ${l.hours})</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        detailArea.innerHTML = html;
        detailArea.classList.add('show');
    }, 150);
}

function updateVaNumber(prefix, detailAreaId) {
    const area = document.getElementById('va-display-area');
    const text = document.getElementById('va-number-text');
    if (!prefix) {
        if (area) area.style.display = 'none';
        return;
    }
    const vaNum = generateVirtualAccount(prefix);
    if (text) text.innerText = vaNum;
    if (area) area.style.display = 'block';
}

function generateQRISCode(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    // Generate QR Code menggunakan qrcode.js CDN
    try {
        new QRCode(container, {
            text: `https://bayarkita.web.app/pay?trx=${generateTransactionId()}`,
            width: 150,
            height: 150,
            colorDark : "#1A1A2E",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } catch(e) {
        // Fallback jika lib offline/gagal load
        container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BayarKitaTrx" style="width:150px;height:150px;" alt="QRIS Code"/>`;
    }

    // Countdown Timer 5 menit
    let seconds = 300;
    const timer = document.getElementById('qris-timer');
    
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            if (timer) timer.innerText = 'Kode QR Kadaluwarsa. Silakan segarkan tagihan.';
            const payBtn = document.getElementById('btn-bayar');
            if (payBtn) payBtn.disabled = true;
            return;
        }
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        if (timer) timer.innerText = `Selesaikan dalam: ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 1000);
}

function prosesBayar() {
    const payBtn = document.getElementById('btn-bayar');

    // Edge Case: Belum pilih metode
    if (!selectedPaymentMethod) {
        showToast('Pilih metode pembayaran terlebih dahulu!', 'warning');
        return;
    }

    // Validasi VA terpilih jika method VA
    if (selectedPaymentMethod === 'VA') {
        const vaSelect = document.querySelector('#payment-detail-area select');
        if (vaSelect && !vaSelect.value) {
            showToast('Silakan pilih Bank VA terlebih dahulu.', 'warning');
            return;
        }
    }

    // Cek kecukupan saldo (Edge Case: simulasi debet saldo)
    const userBalance = getBalance();
    if (userBalance < activeBill.total) {
        showToast('Saldo Anda tidak mencukupi untuk pembayaran ini.', 'error');
        return;
    }

    // Konfirmasi pembayaran
    setButtonLoading(payBtn, true, 'Memproses pembayaran...');

    simulateApiCall(() => {
        setButtonLoading(payBtn, false);

        // Kurangi saldo
        const newBalance = userBalance - activeBill.total;
        saveBalance(newBalance);
        updateBalanceDisplay();

        // Simpan status lunas tagihan ke localStorage
        const paidBills = JSON.parse(localStorage.getItem('bayarkita_paid_bills') || '[]');
        const billKey = `${activeBill.category}_${activeBill.id}`;
        paidBills.push(billKey);
        localStorage.setItem('bayarkita_paid_bills', JSON.stringify(paidBills));

        // Buat data transaksi
        const trxId = generateTransactionId();
        const transaction = {
            id: trxId,
            date: new Date().toISOString(),
            category: activeBill.category,
            service: `${activeBill.category} Billing`,
            desc: `${activeBill.id} (${activeBill.name})`,
            method: selectedPaymentMethod,
            amount: activeBill.total,
            status: 'Sukses'
        };

        saveTransaction(transaction);

        // Update limit status di system data (ubah status SPP ke paid jika ini SPP)
        if (activeBill.category === 'SPP') {
            // SPP lunas logic
            if (sppData[activeBill.studentNim]) {
                const bill = sppData[activeBill.studentNim].bills.find(b => b.id === activeBill.billId);
                if (bill) bill.status = 'paid';
            }
        }

        // Tampilkan Bukti Pembayaran / Struk
        showReceipt(transaction, activeBill);
        showToast('Pembayaran berhasil!', 'success');

        // Reset state
        activeBill = null;
        document.getElementById('bill-result').classList.remove('show');
        document.getElementById('customer-number').value = '';
    });
}

// =============================================
// SPP / BIAYA KULIAH LOGIC
// =============================================
let activeSppStudent = null;
let activeSppNim = '';
let activeSppBills = [];

function switchSppTab(tab) {
    currentSppTab = tab;
    document.getElementById('spp-tab-nim').classList.toggle('active', tab === 'nim');
    document.getElementById('spp-tab-code').classList.toggle('active', tab === 'code');
    
    document.getElementById('spp-nim-panel').style.display = tab === 'nim' ? 'block' : 'none';
    document.getElementById('spp-code-panel').style.display = tab === 'code' ? 'block' : 'none';
    
    // Reset hasil
    document.getElementById('spp-result').style.display = 'none';
}

function cekSPP() {
    const nimInput = document.getElementById('input-nim');
    const err = document.getElementById('nim-error');
    const btn = document.getElementById('btn-cek-spp');

    if (!nimInput) return;
    const nim = nimInput.value.trim();

    if (!validateNIM(nim)) {
        nimInput.classList.add('error');
        if (err) {
            err.innerText = 'Format NIM wajib 12 digit angka.';
            err.classList.add('show');
        }
        return;
    }

    nimInput.classList.remove('error');
    if (err) err.classList.remove('show');

    setButtonLoading(btn, true, 'Mencari...');

    simulateApiCall(() => {
        setButtonLoading(btn, false);
        const student = sppData[nim];

        if (!student) {
            nimInput.classList.add('error');
            if (err) {
                err.innerText = 'NIM tidak terdaftar di sistem.';
                err.classList.add('show');
            }
            showToast('Mahasiswa tidak ditemukan!', 'error');
            return;
        }

        activeSppStudent = student;
        activeSppNim = nim;
        
        // Reset Semester Select & Cache
        const selectEl = document.getElementById('spp-semester-select');
        if (selectEl) selectEl.value = '';
        selectedSppSemester = '';
        sppSemesterCache = {};

        activeSppBills = student.bills;

        renderSppTable();
    });
}

function cekBillCode() {
    const codeInput = document.getElementById('input-billcode');
    const err = document.getElementById('billcode-error');
    const btn = document.getElementById('btn-cek-billcode');

    if (!codeInput) return;
    const code = codeInput.value.trim();

    if (!validateBillCode(code)) {
        codeInput.classList.add('error');
        if (err) {
            err.innerText = 'Format Kode Tagihan wajib 15 digit angka.';
            err.classList.add('show');
        }
        return;
    }

    codeInput.classList.remove('error');
    if (err) err.classList.remove('show');

    setButtonLoading(btn, true, 'Mencari...');

    simulateApiCall(() => {
        setButtonLoading(btn, false);
        const billInfo = billCodeData[code];

        if (!billInfo) {
            codeInput.classList.add('error');
            if (err) {
                err.innerText = 'Kode Tagihan tidak terdaftar di sistem.';
                err.classList.add('show');
            }
            showToast('Tagihan tidak ditemukan!', 'error');
            return;
        }

        const student = sppData[billInfo.nim];
        if (!student) {
            showToast('Data mahasiswa bermasalah.', 'error');
            return;
        }

        activeSppStudent = student;
        activeSppNim = billInfo.nim;
        
        // Reset Semester Select & Cache
        const selectEl = document.getElementById('spp-semester-select');
        if (selectEl) selectEl.value = '';
        selectedSppSemester = '';
        sppSemesterCache = {};

        // Saring tagihan khusus yang sesuai dengan billId
        activeSppBills = student.bills.filter(b => b.id === billInfo.billId);

        renderSppTable();
    });
}

function renderSppTable() {
    const resultDiv = document.getElementById('spp-result');
    const infoDiv = document.getElementById('spp-student-info');
    const tbody = document.getElementById('spp-table-body');
    const checkAll = document.getElementById('spp-check-all');

    if (!resultDiv || !infoDiv || !tbody) return;

    // Reset Check All
    if (checkAll) checkAll.checked = false;

    // Tentukan label semester yang dinamis untuk disajikan di info mahasiswa
    let semesterLabel = activeSppStudent.semester;
    if (selectedSppSemester === '20262') semesterLabel = 'GENAP 2026/2027';
    else if (selectedSppSemester === '20261') semesterLabel = 'GANJIL 2026/2027';
    else if (selectedSppSemester === '20252') semesterLabel = 'GENAP 2025/2026';
    else if (selectedSppSemester === '20251') semesterLabel = 'GANJIL 2025/2026';
    else if (selectedSppSemester === '20242') semesterLabel = 'GENAP 2024/2025';
    else if (selectedSppSemester === '20241') semesterLabel = 'GANJIL 2024/2025';

    // Render Student Info
    infoDiv.innerHTML = `
        <div class="info-item">
            <label>Nama Mahasiswa</label>
            <span>${escapeHtml(activeSppStudent.studentName)}</span>
        </div>
        <div class="info-item">
            <label>NIM</label>
            <span>${escapeHtml(activeSppNim)}</span>
        </div>
        <div class="info-item">
            <label>Fakultas / Prodi</label>
            <span>${escapeHtml(activeSppStudent.faculty)} / ${escapeHtml(activeSppStudent.program)}</span>
        </div>
        <div class="info-item">
            <label>Semester</label>
            <span>${escapeHtml(semesterLabel)}</span>
        </div>
    `;

    // Render Bills
    let html = '';
    if (activeSppBills.length === 0) {
        html = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:24px;">Tidak ada tagihan semester.</td></tr>`;
    } else {
        activeSppBills.forEach((b, idx) => {
            const isLunas = b.status === 'paid';
            const channel = b.payChannel || '-';
            const merchant = b.payMerchant || '-';
            
            html += `
                <tr>
                    <td style="font-family: monospace; font-size: 0.9rem; font-weight: 600;">${b.id}</td>
                    <td style="text-align: center;">${idx + 1}</td>
                    <td style="font-weight: 600;">${escapeHtml(b.desc)}</td>
                    <td style="font-weight: 700; color: var(--text);">${formatCurrency(b.amount)}</td>
                    <td style="font-weight: 600; text-transform: uppercase;">${escapeHtml(channel)}</td>
                    <td style="font-weight: 600;">${escapeHtml(merchant)}</td>
                    <td>
                        ${isLunas ? 
                            `<span style="color:#22c55e;font-weight:700;display:inline-flex;align-items:center;gap:6px;"><i class="far fa-check-circle" style="font-size:1.1rem;"></i> LUNAS</span>` : 
                            `<span style="color:#ef4444;font-weight:700;display:inline-flex;align-items:center;gap:6px;"><i class="far fa-times-circle" style="font-size:1.1rem;"></i> BELUM LUNAS</span>`
                        }
                    </td>
                    <td style="color: var(--text-muted);">${b.payDate || '-'}</td>
                </tr>
            `;
        });
    }
    tbody.innerHTML = html;
    calculateSppTotal();
    resultDiv.style.display = 'block';
    
    // Smooth scroll ke tabel
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function handleSemesterFilter(value) {
    if (!activeSppStudent) return;
    
    selectedSppSemester = value;

    // Check if we have this semester cached
    if (sppSemesterCache[value]) {
        activeSppBills = sppSemesterCache[value];
    } else {
        // Ganjil 2025/2026 is the active semester of the student
        if (value === '20251' || value === '') {
            activeSppBills = activeSppStudent.bills;
        } else if (value === '20252' || value === '20242' || value === '20241') {
            // Past Semesters: all bills are already paid
            const generated = activeSppStudent.bills.map((b, idx) => {
                let pastDate = '15 Februari 2025';
                if (value === '20242') pastDate = '15 Agustus 2024';
                else if (value === '20241') pastDate = '15 Februari 2024';
                
                return {
                    ...b,
                    status: 'paid',
                    payDate: idx >= 5 ? pastDate : b.payDate,
                    payChannel: 'TELLER',
                    payMerchant: 'Bank MANDIRI'
                };
            });
            sppSemesterCache[value] = generated;
            activeSppBills = generated;
        } else {
            // Future Semesters: all bills are unpaid
            const generated = activeSppStudent.bills.map(b => ({
                ...b,
                status: 'unpaid',
                payDate: '-',
                payChannel: '-',
                payMerchant: '-'
            }));
            sppSemesterCache[value] = generated;
            activeSppBills = generated;
        }
    }

    renderSppTable();
}

function calculateSppTotal() {
    const nextBill = activeSppBills.find(b => b.status === 'unpaid');
    const total = nextBill ? nextBill.amount : 0;

    const displayTotal = document.getElementById('spp-total');
    if (displayTotal) displayTotal.innerText = formatCurrency(total);

    const payBtn = document.getElementById('btn-bayar-spp');
    if (payBtn) {
        payBtn.disabled = !nextBill;
    }
}

function openSppPayment() {
    const nextBill = activeSppBills.find(b => b.status === 'unpaid');
    if (!nextBill) return;

    let itemsHtml = `
        <div class="receipt-row">
            <span class="key">${escapeHtml(nextBill.desc)}</span>
            <span class="val">${formatCurrency(nextBill.amount)}</span>
        </div>
    `;
    let total = nextBill.amount;

    const content = document.getElementById('spp-payment-content');
    if (content) {
        content.innerHTML = `
            <div style="background:var(--bg);padding:14px;border-radius:var(--radius-sm);margin-bottom:16px;">
                <h4 style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">Detail Mahasiswa:</h4>
                <p style="font-size:0.82rem;color:var(--text-muted);">${escapeHtml(activeSppStudent.studentName)} (${activeSppNim})</p>
                <p style="font-size:0.82rem;color:var(--text-muted);">${escapeHtml(activeSppStudent.program)}</p>
            </div>
            <strong>Daftar Pembayaran:</strong>
            <div style="margin:10px 0;">
                ${itemsHtml}
            </div>
            <div class="bill-total">
                <span class="bill-total-label">Total Tagihan Kuliah</span>
                <span class="bill-total-amount">${formatCurrency(total)}</span>
            </div>
            <div style="margin-top:16px;">
                <h4 style="font-weight:700;font-size:0.92rem;margin-bottom:8px;">Metode Pembayaran</h4>
                <div class="payment-methods" id="spp-payment-methods" role="radiogroup"></div>
                <div id="spp-payment-detail-area"></div>
            </div>
        `;
    }

    renderPaymentMethods('spp-payment-methods');
    openModal('modal-spp-payment');
}

function konfirmasiSPP() {
    const payBtn = document.getElementById('btn-konfirmasi-spp');
    const nextBill = activeSppBills.find(b => b.status === 'unpaid');

    if (!nextBill) {
        showToast('Tidak ada tagihan yang perlu dibayar.', 'warning');
        return;
    }

    if (!selectedPaymentMethod) {
        showToast('Pilih metode pembayaran terlebih dahulu!', 'warning');
        return;
    }

    if (selectedPaymentMethod === 'VA') {
        const vaSelect = document.querySelector('#spp-payment-detail-area select');
        if (vaSelect && !vaSelect.value) {
            showToast('Silakan pilih Bank VA terlebih dahulu.', 'warning');
            return;
        }
    }

    const total = nextBill.amount;
    const descParts = [nextBill.desc];

    const userBalance = getBalance();
    if (userBalance < total) {
        showToast('Saldo Anda tidak mencukupi.', 'error');
        return;
    }

    setButtonLoading(payBtn, true, 'Memproses SPP...');

    simulateApiCall(() => {
        setButtonLoading(payBtn, false);

        // Update Saldo
        saveBalance(userBalance - total);
        updateBalanceDisplay();

        // Tentukan chanel dan tempat bayar dari metode pembayaran
        let channelVal = 'TELLER';
        let merchantVal = 'Bank MANDIRI';

        if (selectedPaymentMethod === 'VA') {
            const vaSelect = document.querySelector('#spp-payment-detail-area select');
            let bankName = 'Bank MANDIRI';
            if (vaSelect && vaSelect.selectedIndex > 0) {
                bankName = vaSelect.options[vaSelect.selectedIndex].text;
            }
            channelVal = 'TELLER';
            merchantVal = bankName;
        } else if (selectedPaymentMethod === 'QRIS') {
            channelVal = 'QRIS';
            merchantVal = 'E-Wallet';
        } else if (selectedPaymentMethod === 'Teller') {
            channelVal = 'TELLER';
            merchantVal = 'Alfamart / Indomaret';
        }

        // Update Status SPP di data dummy ke Lunas
        const bill = activeSppStudent.bills.find(b => b.id === nextBill.id);
        if (bill) {
            bill.status = 'paid';
            bill.payDate = formatDate(new Date());
            bill.payChannel = channelVal;
            bill.payMerchant = merchantVal;
        }

        // Also update in activeSppBills (which might be in sppSemesterCache)
        const billInActive = activeSppBills.find(b => b.id === nextBill.id);
        if (billInActive) {
            billInActive.status = 'paid';
            billInActive.payDate = formatDate(new Date());
            billInActive.payChannel = channelVal;
            billInActive.payMerchant = merchantVal;
        }

        // Save to localStorage
        localStorage.setItem('sppData', JSON.stringify(sppData));
        localStorage.setItem('sppSemesterCache', JSON.stringify(sppSemesterCache));

        // Buat Transaksi
        const trxId = generateTransactionId();
        const transaction = {
            id: trxId,
            date: new Date().toISOString(),
            category: 'SPP',
            service: 'Cicilan Kuliah SPP',
            desc: `${activeSppNim} - ${descParts.join(', ')}`,
            method: selectedPaymentMethod,
            amount: total,
            status: 'Sukses'
        };

        saveTransaction(transaction);
        closeModal('modal-spp-payment');

        // Tampilkan receipt
        const billStub = {
            id: activeSppNim,
            category: 'SPP',
            name: activeSppStudent.studentName,
            detail: activeSppStudent.program,
            period: activeSppStudent.semester,
            dueDate: new Date().toISOString(),
            amount: total,
            fine: 0,
            total: total
        };

        showReceipt(transaction, billStub);
        showToast('Pembayaran Kuliah sukses!', 'success');

        // Render ulang tabel agar status terupdate
        renderSppTable();
    });
}

function printSppList() {
    window.print();
}

// =============================================
// PULSA & PAKET DATA LOGIC
// =============================================
function renderProviders() {
    const grid = document.getElementById('provider-grid');
    if (!grid) return;

    const providers = [
        { name: 'Telkomsel', icon: '<i class="fas fa-signal" style="color:#FF4B4B;"></i>' },
        { name: 'XL Axiata', icon: '<i class="fas fa-signal" style="color:#005BFF;"></i>' },
        { name: 'Indosat Ooredoo', icon: '<i class="fas fa-signal" style="color:#FF9F00;"></i>' },
        { name: 'Tri (3)', icon: '<i class="fas fa-signal" style="color:#B300FF;"></i>' },
        { name: 'Smartfren', icon: '<i class="fas fa-signal" style="color:#FF005B;"></i>' },
        { name: 'Axis', icon: '<i class="fas fa-signal" style="color:#A600FF;"></i>' }
    ];

    grid.innerHTML = providers.map(p => `
        <div class="provider-card" id="provider-${p.name.replace(/\s+/g, '')}" onclick="selectProvider('${p.name}')">
            <div class="provider-logo">${p.icon}</div>
            <div class="provider-name">${p.name}</div>
        </div>
    `).join('');
}

function selectProvider(name) {
    selectedProvider = name;
    
    // Highlight
    document.querySelectorAll('.provider-card').forEach(c => c.classList.remove('selected'));
    const safeName = name.replace(/\s+/g, '');
    const card = document.getElementById(`provider-${safeName}`);
    if (card) card.classList.add('selected');

    // Filter nominal/paket data
    renderNominalGrids();
}

function onPhoneInput(input) {
    const phone = input.value.trim();
    const detectDiv = document.getElementById('provider-detected');
    const detectName = document.getElementById('provider-detected-name');
    const err = document.getElementById('phone-error');

    if (phone.length >= 4) {
        const provider = detectProvider(phone);
        if (provider) {
            selectProvider(provider);
            if (detectDiv && detectName) {
                detectName.innerText = `Provider Terdeteksi: ${provider}`;
                detectDiv.classList.add('show');
            }
            if (err) err.classList.remove('show');
            input.classList.remove('error');
        } else {
            if (detectDiv) detectDiv.classList.remove('show');
        }
    } else {
        if (detectDiv) detectDiv.classList.remove('show');
    }
}

function switchPulsaType(type) {
    currentPulsaType = type;
    document.getElementById('pulsa-tab-pulsa').classList.toggle('active', type === 'pulsa');
    document.getElementById('pulsa-tab-data').classList.toggle('active', type === 'data');
    
    document.getElementById('pulsa-nominal-panel').style.display = type === 'pulsa' ? 'block' : 'none';
    document.getElementById('pulsa-data-panel').style.display = type === 'data' ? 'block' : 'none';

    renderNominalGrids();
}

function renderNominalGrids() {
    const pulsaGrid = document.getElementById('pulsa-grid');
    const dataGrid = document.getElementById('data-grid');

    if (currentPulsaType === 'pulsa' && pulsaGrid) {
        selectedPulsaIndex = -1;
        pulsaGrid.innerHTML = pulsaPackages.pulsa.map((p, idx) => `
            <div class="nominal-btn" id="pulsa-pkg-${idx}" onclick="selectPulsaPackage(${idx}, ${p.price})">
                <strong>${p.label}</strong>
                <div class="price">Harga: ${formatCurrency(p.price)}</div>
            </div>
        `).join('');
    } else if (currentPulsaType === 'data' && dataGrid) {
        selectedDataIndex = -1;
        dataGrid.innerHTML = pulsaPackages.data.map((p, idx) => `
            <div class="nominal-btn" id="data-pkg-${idx}" onclick="selectDataPackage(${idx}, ${p.price})">
                <strong>${p.quota}</strong>
                <div class="price">${p.validity} • ${formatCurrency(p.price)}</div>
            </div>
        `).join('');
    }
}

function selectPulsaPackage(idx, price) {
    selectedPulsaIndex = idx;
    document.querySelectorAll('#pulsa-grid .nominal-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.getElementById(`pulsa-pkg-${idx}`);
    if (btn) btn.classList.add('selected');

    // Reset Custom Pulsa
    const custom = document.getElementById('pulsa-custom');
    if (custom) custom.value = '';
}

function selectDataPackage(idx, price) {
    selectedDataIndex = idx;
    document.querySelectorAll('#data-grid .nominal-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.getElementById(`data-pkg-${idx}`);
    if (btn) btn.classList.add('selected');
}

function previewPulsa() {
    const phoneInput = document.getElementById('input-phone');
    const err = document.getElementById('phone-error');

    if (!phoneInput) return;
    const phone = phoneInput.value.trim();

    // Validasi HP
    if (!validatePhone(phone)) {
        phoneInput.classList.add('error');
        if (err) {
            err.innerText = 'Nomor HP tidak valid. Wajib 10-13 digit & diawali 08.';
            err.classList.add('show');
        }
        return;
    }

    phoneInput.classList.remove('error');
    if (err) err.classList.remove('show');

    // Validasi Provider
    if (!selectedProvider) {
        showToast('Pilih atau masukkan nomor HP agar provider terdeteksi.', 'warning');
        return;
    }

    // Ambil nominal terpilih
    let packageLabel = '';
    let price = 0;
    let customVal = 0;

    if (currentPulsaType === 'pulsa') {
        const customInput = document.getElementById('pulsa-custom');
        if (customInput && customInput.value) {
            customVal = parseInt(customInput.value);
            if (customVal < 5000) {
                showToast('Nominal pulsa minimal Rp 5.000', 'warning');
                return;
            }
            packageLabel = `Pulsa Rp ${customVal.toLocaleString('id-ID')}`;
            price = customVal + 1500; // Markup admin Rp 1500
        } else if (selectedPulsaIndex !== -1) {
            const pkg = pulsaPackages.pulsa[selectedPulsaIndex];
            packageLabel = `Pulsa ${pkg.label}`;
            price = pkg.price;
        }
    } else {
        if (selectedDataIndex !== -1) {
            const pkg = pulsaPackages.data[selectedDataIndex];
            packageLabel = `Paket Data ${pkg.label}`;
            price = pkg.price;
        }
    }

    if (!packageLabel) {
        showToast('Silakan pilih nominal atau paket data.', 'warning');
        return;
    }

    // Load Preview Modal
    const previewContent = document.getElementById('pulsa-preview-content');
    if (previewContent) {
        previewContent.innerHTML = `
            <div class="receipt-header" style="border:none;margin:0;padding-bottom:10px;">
                <span style="font-size:0.82rem;color:var(--text-muted);">Preview Transaksi:</span>
            </div>
            <div class="receipt-row">
                <span class="key">Provider</span>
                <span class="val">${selectedProvider}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Nomor Tujuan</span>
                <span class="val">${phone}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Produk</span>
                <span class="val">${packageLabel}</span>
            </div>
            <div class="bill-total">
                <span class="bill-total-label">Total Harga</span>
                <span class="bill-total-amount">${formatCurrency(price)}</span>
            </div>
        `;
    }

    // Set temp state active bill
    activeBill = {
        id: phone,
        category: 'Pulsa',
        name: selectedProvider,
        detail: packageLabel,
        period: 'Top-Up Instan',
        dueDate: new Date().toISOString(),
        amount: price,
        fine: 0,
        total: price
    };

    renderPaymentMethods('pulsa-payment-methods');
    openModal('modal-pulsa-preview');
}

function prosesBayarPulsa() {
    const payBtn = document.getElementById('btn-bayar-pulsa');

    if (!selectedPaymentMethod) {
        showToast('Pilih metode pembayaran terlebih dahulu!', 'warning');
        return;
    }

    if (selectedPaymentMethod === 'VA') {
        const vaSelect = document.querySelector('#pulsa-payment-detail-area select');
        if (vaSelect && !vaSelect.value) {
            showToast('Silakan pilih Bank VA.', 'warning');
            return;
        }
    }

    const userBalance = getBalance();
    if (userBalance < activeBill.total) {
        showToast('Saldo Anda tidak mencukupi.', 'error');
        return;
    }

    setButtonLoading(payBtn, true, 'Memproses Top-Up...');

    simulateApiCall(() => {
        setButtonLoading(payBtn, false);

        // Update Saldo
        saveBalance(userBalance - activeBill.total);
        updateBalanceDisplay();

        // Buat Transaksi
        const trxId = generateTransactionId();
        const transaction = {
            id: trxId,
            date: new Date().toISOString(),
            category: 'Pulsa',
            service: 'Isi Pulsa / Data',
            desc: `${activeBill.id} (${activeBill.name} - ${activeBill.detail})`,
            method: selectedPaymentMethod,
            amount: activeBill.total,
            status: 'Sukses'
        };

        saveTransaction(transaction);
        closeModal('modal-pulsa-preview');

        // Struk
        showReceipt(transaction, activeBill);
        showToast('Top-Up Pulsa sukses!', 'success');

        // Reset
        activeBill = null;
        document.getElementById('input-phone').value = '';
        document.getElementById('provider-detected').classList.remove('show');
        document.querySelectorAll('.provider-card').forEach(c => c.classList.remove('selected'));
        selectedProvider = '';
        renderNominalGrids();
    });
}

// =============================================
// RIWAYAT TRANSAKSI LOGIC
// =============================================
function renderHistory() {
    const filterCat = document.getElementById('filter-kategori').value;
    const filterStat = document.getElementById('filter-status').value;
    const tbody = document.getElementById('history-tbody');
    const emptyDiv = document.getElementById('history-empty');
    const table = document.getElementById('history-table');

    if (!tbody) return;

    let txs = getTransactions();

    // Filter Kategori
    if (filterCat) {
        txs = txs.filter(t => t.category === filterCat);
    }
    // Filter Status
    if (filterStat) {
        txs = txs.filter(t => t.status === filterStat);
    }

    if (txs.length === 0) {
        tbody.innerHTML = '';
        if (table) table.style.display = 'none';
        if (emptyDiv) emptyDiv.style.display = 'block';
        return;
    }

    if (table) table.style.display = 'table';
    if (emptyDiv) emptyDiv.style.display = 'none';

    tbody.innerHTML = txs.map(t => `
        <tr>
            <td style="font-weight:700;">${t.id}</td>
            <td>${formatDateTime(t.date)}</td>
            <td><span class="badge" style="background:var(--bg);color:var(--text);border:1px solid var(--border);">${t.category}</span></td>
            <td>${escapeHtml(t.desc)}</td>
            <td>${t.method}</td>
            <td style="font-weight:700;color:var(--primary);">${formatCurrency(t.amount)}</td>
            <td><span class="badge ${t.status === 'Sukses' ? 'badge-success' : t.status === 'Pending' ? 'badge-pending' : 'badge-fail'}">${t.status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="cetakUlangStruk('${t.id}')" aria-label="Lihat detail struk">
                    <i class="fas fa-eye"></i> Struk
                </button>
            </td>
        </tr>
    `).join('');
}

function konfirmasiHapusRiwayat() {
    openModal('modal-confirm-clear');
}

function hapusRiwayat() {
    clearTransactions();
    localStorage.removeItem('bayarkita_paid_bills'); // Reset status lunas tagihan umum
    
    // Reset status SPP ke kondisi awal simulasi
    if (typeof sppData !== 'undefined') {
        if (sppData["221011402463"]) {
            sppData["221011402463"].bills.forEach((b, idx) => {
                if (idx >= 5) {
                    b.status = 'unpaid';
                    b.payDate = '-';
                    b.payChannel = '-';
                    b.payMerchant = '-';
                } else {
                    b.status = 'paid';
                    b.payChannel = 'TELLER';
                    b.payMerchant = 'Bank MANDIRI';
                }
            });
        }
        if (sppData["221011402465"]) {
            sppData["221011402465"].bills.forEach((b, idx) => {
                if (idx >= 4) {
                    b.status = 'unpaid';
                    b.payDate = '-';
                    b.payChannel = '-';
                    b.payMerchant = '-';
                } else {
                    b.status = 'paid';
                    b.payChannel = 'TELLER';
                    b.payMerchant = 'Bank MANDIRI';
                }
            });
        }
        if (sppData["221011402467"]) {
            sppData["221011402467"].bills.forEach((b, idx) => {
                if (idx >= 7) {
                    b.status = 'unpaid';
                    b.payDate = '-';
                    b.payChannel = '-';
                    b.payMerchant = '-';
                } else {
                    b.status = 'paid';
                    b.payChannel = 'TELLER';
                    b.payMerchant = 'Bank MANDIRI';
                }
            });
        }
        localStorage.setItem('sppData', JSON.stringify(sppData));
        localStorage.removeItem('sppSemesterCache');
    }

    // Refresh tabel SPP jika sedang terbuka
    const sppResult = document.getElementById('spp-result');
    if (sppResult && sppResult.style.display === 'block') {
        // Reset filter semester select
        const sppSemesterSelect = document.getElementById('spp-semester-select');
        if (sppSemesterSelect) sppSemesterSelect.value = '';
        selectedSppSemester = '';
        sppSemesterCache = {};
        activeSppBills = activeSppStudent.bills;
        renderSppTable();
    }

    closeModal('modal-confirm-clear');
    renderHistory();
    showToast('Seluruh riwayat berhasil dihapus.', 'info');
}

function cetakUlangStruk(trxId) {
    const txs = getTransactions();
    const trx = txs.find(t => t.id === trxId);
    if (!trx) return;

    // Rekonstruksi activeBill mock
    const billMock = {
        id: trx.desc.split(' ')[0],
        category: trx.category,
        name: trx.category === 'Pulsa' ? 'Provider' : 'Pelanggan',
        detail: trx.desc,
        period: '-',
        dueDate: trx.date,
        amount: trx.amount,
        fine: 0,
        total: trx.amount
    };

    showReceipt(trx, billMock);
}

function exportCSV() {
    const txs = getTransactions();
    if (txs.length === 0) {
        showToast('Tidak ada data riwayat untuk di-export.', 'warning');
        return;
    }

    let csv = 'ID Transaksi,Waktu,Kategori,Layanan/Keterangan,Metode,Total,Status\n';
    txs.forEach(t => {
        csv += `"${t.id}","${t.date}","${t.category}","${t.desc.replace(/"/g, '""')}","${t.method}",${t.amount},"${t.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Riwayat_Transaksi_BayarKita_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ekspor CSV sukses!', 'success');
}

// =============================================
// MODAL & RECEIPT LOGIC
// =============================================
let activeReceipt = null;

function showReceipt(trx, bill) {
    const content = document.getElementById('receipt-content');
    if (!content) return;

    activeReceipt = { trx, bill };

    if (trx.category === 'SPP') {
        const cleanDesc = trx.desc ? trx.desc.split(' - ').slice(1).join(' - ') : 'Cicilan Kuliah SPP';
        content.innerHTML = `
            <div class="receipt-success">
                <i class="fas fa-check-circle" style="color: #22c55e;"></i>
                <h3 style="color: #10b981;">Pembayaran SPP Berhasil</h3>
                <span style="font-size:0.8rem;color:var(--text-muted);">${formatDateTime(trx.date)}</span>
            </div>
            
            <!-- Kop Kwitansi Resmi -->
            <div style="border-bottom: 2px double var(--border); padding-bottom: 12px; margin-bottom: 16px; text-align: center;">
                <div style="font-weight: 800; font-size: 1.1rem; color: var(--primary); letter-spacing: 1px; text-transform: uppercase;">UNIVERSITAS BAYARKITA</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 4px;">Jl. Raya Puspiptek No. 463, Tangerang Selatan</div>
                <div style="font-weight: 700; font-size: 0.85rem; color: var(--text); border-top: 1px solid var(--border); padding-top: 6px; margin-top: 6px; letter-spacing: 0.5px;">BUKTI PEMBAYARAN SPP RESMI</div>
            </div>
            
            <div class="receipt-row">
                <span class="key">No. Ref Transaksi</span>
                <span class="val" style="font-family: monospace; font-weight: 600;">${trx.id}</span>
            </div>
            <div class="receipt-row">
                <span class="key">NIM Mahasiswa</span>
                <span class="val" style="font-weight: 600;">${bill.id}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Nama Mahasiswa</span>
                <span class="val">${escapeHtml(bill.name)}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Program Studi</span>
                <span class="val">${escapeHtml(bill.detail)}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Semester</span>
                <span class="val">${escapeHtml(bill.period)}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Deskripsi</span>
                <span class="val" style="font-weight: 600; color: var(--primary);">${escapeHtml(cleanDesc)}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Metode Pembayaran</span>
                <span class="val">${trx.method}</span>
            </div>
            
            <div class="receipt-total" style="margin-top: 18px; border-top: 1px dashed var(--border); padding-top: 12px;">
                <span>TOTAL PELUNASAN</span>
                <span style="color: #10b981;">${formatCurrency(trx.amount)}</span>
            </div>
            
            <!-- Stempel Lunas & QR Code Validasi -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding: 12px; background: rgba(16, 185, 129, 0.05); border: 1px dashed #10b981; border-radius: 8px;">
                <div style="text-align: left;">
                    <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Status Dokumen</div>
                    <div style="font-weight: 900; font-size: 0.95rem; color: #10b981; letter-spacing: 1px;"><i class="fas fa-stamp"></i> LUNAS / PAID</div>
                    <div style="font-size: 0.6rem; color: var(--text-muted); margin-top: 2px;">Terverifikasi secara Elektronik</div>
                </div>
                <div>
                    <!-- Mini SVG QR Code placeholder -->
                    <svg width="45" height="45" viewBox="0 0 29 29" style="background: white; padding: 2px; border-radius: 4px; border: 1px solid #e5e7eb; display: block;">
                        <path d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 0h1v1h-1zm1 0h2v1h-2zm3 0h1v1h-1zm2 0h3v1h-3zm4 0h2v1h-2zm-12 2h1v1H9zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h2v1h-2zm-9 2h1v1H9zm3 0h1v1h-1zm2 0h1v1h-1zm1 0h2v1h-2zm4 0h1v1H-1zm-11 2h1v1H9zm3 0h2v1h-2zm3 0h1v1h-1zm1 0h3v1h-3zm-16 1h7v7H0zm1 1v5h5v-5zm16 0h1v2h-1zm2 0h1v1h-1zm1 0h2v1h-2zm-3 2h2v1h-2zm3 0h1v1h-1zm-3 2h1v1h-1zm2 0h2v1h-2zm-14 1h1v1H9zm2 0h1v1h-1zm1 0h2v1h-2zm4 0h1v1h-1zm2 0h1v1h-1z" fill="#111827"/>
                    </svg>
                </div>
            </div>
            
            <p style="text-align:center;font-size:0.68rem;color:var(--text-muted);margin-top:16px;">Kwitansi ini diterbitkan secara resmi oleh Universitas BayarKita dan merupakan bukti pembayaran yang sah.</p>
        `;
    } else {
        content.innerHTML = `
            <div class="receipt-success">
                <i class="fas fa-check-circle"></i>
                <h3>Pembayaran Berhasil</h3>
                <span style="font-size:0.8rem;color:var(--text-muted);">${formatDateTime(trx.date)}</span>
            </div>
            <div class="receipt-header">
                <div class="receipt-logo">BayarKita</div>
                <span style="font-size:0.75rem;color:var(--text-muted);">Aplikasi Pembayaran Multi-Layanan</span>
            </div>
            
            <div class="receipt-row">
                <span class="key">ID Transaksi</span>
                <span class="val">${trx.id}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Metode Bayar</span>
                <span class="val">${trx.method}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Layanan</span>
                <span class="val">${trx.category}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Nomor/ID Pelanggan</span>
                <span class="val">${bill.id}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Nama</span>
                <span class="val">${escapeHtml(bill.name)}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Detail</span>
                <span class="val">${escapeHtml(bill.detail)}</span>
            </div>
            <div class="receipt-row">
                <span class="key">Periode</span>
                <span class="val">${escapeHtml(bill.period)}</span>
            </div>
            
            <div class="receipt-total">
                <span>TOTAL BAYAR</span>
                <span>${formatCurrency(trx.amount)}</span>
            </div>
            <p style="text-align:center;font-size:0.72rem;color:var(--text-muted);margin-top:16px;">Terima kasih atas pembayaran Anda. Simpan struk ini sebagai bukti sah.</p>
        `;
    }

    openModal('modal-receipt');
}

function downloadPDF() {
    if (!activeReceipt) return;

    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        showToast('Library PDF gagal dimuat. Gunakan fitur cetak.', 'error');
        return;
    }

    const { trx, bill } = activeReceipt;

    if (trx.category === 'SPP') {
        const doc = new jsPDF({
            unit: 'mm',
            format: [100, 160]
        });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(13, 148, 136); // Teal
        doc.text("UNIVERSITAS BAYARKITA", 50, 12, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text("Jl. Raya Puspiptek No. 463, Tangerang Selatan", 50, 16, { align: "center" });
        doc.setDrawColor(200, 200, 200);
        doc.line(10, 19, 90, 19);
        doc.line(10, 20, 90, 20);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text("BUKTI PEMBAYARAN SPP RESMI", 50, 25, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`No. Ref Transaksi  : ${trx.id}`, 10, 33);
        doc.text(`Tanggal Transaksi  : ${formatDateTime(trx.date)}`, 10, 38);
        doc.text(`NIM Mahasiswa      : ${bill.id}`, 10, 43);
        doc.text(`Nama Mahasiswa     : ${bill.name}`, 10, 48);
        doc.text(`Program Studi      : ${bill.detail}`, 10, 53);
        doc.text(`Semester           : ${bill.period}`, 10, 58);
        
        const cleanDesc = trx.desc ? trx.desc.split(' - ').slice(1).join(' - ') : 'Cicilan Kuliah SPP';
        doc.text(`Deskripsi          : ${cleanDesc}`, 10, 63);
        doc.text(`Metode Bayar       : ${trx.method}`, 10, 68);

        doc.line(10, 73, 90, 73);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL PELUNASAN", 10, 79);
        doc.setTextColor(16, 185, 129); // green
        doc.text(formatCurrency(trx.amount), 90, 79, { align: "right" });

        doc.setTextColor(50, 50, 50);
        doc.line(10, 83, 90, 83);

        // Stamp Box
        doc.setFillColor(240, 253, 250);
        doc.rect(10, 88, 80, 20, "F");
        doc.setDrawColor(16, 185, 129);
        doc.rect(10, 88, 80, 20, "S");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(16, 185, 129);
        doc.text("STATUS: LUNAS / PAID", 50, 96, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text("Terverifikasi secara Elektronik oleh Sistem Keuangan", 50, 101, { align: "center" });

        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.text("Dokumen ini merupakan bukti pembayaran kuliah yang sah.", 50, 114, { align: "center" });

        doc.save(`Kwitansi_SPP_${trx.id}.pdf`);
        showToast('Kwitansi PDF berhasil diunduh.', 'success');
    } else {
        const doc = new jsPDF({
            unit: 'mm',
            format: [80, 150] // Struk struk thermal
        });

        doc.setFont("courier", "bold");
        doc.setFontSize(14);
        doc.text("   BayarKita   ", 40, 10, { align: "center" });
        
        doc.setFont("courier", "normal");
        doc.setFontSize(8);
        doc.text("-------------------------", 40, 14, { align: "center" });
        doc.text("  BUKTI PEMBAYARAN SAH  ", 40, 17, { align: "center" });
        doc.text("-------------------------", 40, 20, { align: "center" });

        doc.text(`TANGGAL  : ${formatDateTime(trx.date)}`, 5, 26);
        doc.text(`TRX ID   : ${trx.id}`, 5, 31);
        doc.text(`METODE   : ${trx.method}`, 5, 36);
        doc.text(`LAYANAN  : ${trx.category}`, 5, 41);
        doc.text(`NO/ID    : ${bill.id}`, 5, 46);
        doc.text(`NAMA     : ${bill.name.substring(0, 18)}`, 5, 51);
        doc.text(`DETAIL   : ${bill.detail.substring(0, 18)}`, 5, 56);
        doc.text(`PERIODE  : ${bill.period.substring(0, 18)}`, 5, 61);

        doc.text("-------------------------", 40, 68, { align: "center" });
        doc.setFont("courier", "bold");
        doc.text(`TOTAL    : ${formatCurrency(trx.amount)}`, 5, 74);
        doc.setFont("courier", "normal");
        doc.text("-------------------------", 40, 80, { align: "center" });
        
        doc.text("Simpan struk ini sebagai", 40, 88, { align: "center" });
        doc.text("bukti pembayaran sah.", 40, 92, { align: "center" });
        doc.text("Terima kasih.", 40, 96, { align: "center" });

        doc.save(`Struk_BayarKita_${trx.id}.pdf`);
        showToast('PDF berhasil diunduh.', 'success');
    }
}

// =============================================
// MODAL GENERAL HELPERS
// =============================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
    
    // Clear countdown interval if closing payment modal
    if (id === 'modal-receipt' || id === 'modal-pulsa-preview') {
        if (countdownInterval) clearInterval(countdownInterval);
    }
}

// Close modal if clicked outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }
});

// =============================================
// FAKE LOGIN & FAQ HELPERS
// =============================================
function switchDemoUser(nim) {
    if (!demoUsers[nim]) return;
    activeUserNim = nim;
    
    // Update profile view
    updateProfileView();
    showToast(`Berhasil login sebagai ${demoUsers[nim].name}`, 'success');
}

function updateProfileView() {
    const user = demoUsers[activeUserNim];
    const nameEl = document.getElementById('profile-name');
    const roleEl = document.getElementById('profile-role');
    const avatarEl = document.getElementById('profile-avatar');
    const balanceEl = document.getElementById('profile-balance');
    const userSelect = document.getElementById('demo-user-select');

    if (nameEl) nameEl.innerText = user.name;
    if (roleEl) roleEl.innerHTML = `<i class="fas fa-graduation-cap"></i> ${user.role}`;
    if (avatarEl) {
        // Ambil inisial nama
        const parts = user.name.split(' ');
        const initials = parts.map(p => p[0]).join('').substring(0, 2);
        avatarEl.innerText = initials.toUpperCase();
    }
    if (balanceEl) balanceEl.innerText = formatCurrency(getBalance());
    if (userSelect) userSelect.value = activeUserNim;
    
    // Auto-fill NIM di SPP
    const nimInput = document.getElementById('input-nim');
    if (nimInput) nimInput.value = activeUserNim;

    // Auto-fill No HP di Pulsa
    const phoneInput = document.getElementById('input-phone');
    if (phoneInput) {
        phoneInput.value = user.phone;
        onPhoneInput(phoneInput); // trigger deteksi provider otomatis
    }
}

function processTopUp() {
    const amountInput = document.getElementById('topup-amount');
    if (!amountInput) return;
    const amount = parseInt(amountInput.value);

    if (isNaN(amount) || amount < 10000) {
        showToast('Minimal top up adalah Rp 10.000', 'warning');
        return;
    }

    const currentBal = getBalance();
    saveBalance(currentBal + amount);
    updateBalanceDisplay();
    updateProfileView();
    amountInput.value = '';
    showToast(`Top up berhasil! Saldo bertambah ${formatCurrency(amount)}`, 'success');
}

function toggleFaq(card) {
    const answer = card.querySelector('.faq-answer');
    const icon = card.querySelector('i');
    
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
    
    // Tutup FAQ lainnya terlebih dahulu
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-answer').style.maxHeight = '0px';
        item.querySelector('.faq-answer').style.marginTop = '0px';
        item.querySelector('i').style.transform = 'rotate(0deg)';
    });

    if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.marginTop = '12px';
        icon.style.transform = 'rotate(180deg)';
    }
}
