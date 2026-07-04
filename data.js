/**
 * data.js - BayarKita Dummy Data
 * Berisi semua data simulasi untuk tagihan, SPP, dan provider HP
 */

// =============================================
// DATA TAGIHAN PLN (Listrik)
// =============================================
const plnData = {
    "123456789012": {
        name: "Budi Santoso",
        address: "Jl. Merdeka No. 12, Jakarta Pusat",
        amount: 245000,
        fine: 0,
        period: "Juni 2026",
        dueDate: "2026-07-20",
        usage: "185 kWh",
        tariff: "R1/TR 1300 VA"
    },
    "234567890123": {
        name: "Siti Rahayu",
        address: "Jl. Pahlawan No. 45, Bandung",
        amount: 189000,
        fine: 5000,
        period: "Juni 2026",
        dueDate: "2026-07-20",
        usage: "142 kWh",
        tariff: "R1/TR 900 VA"
    },
    "345678901234": {
        name: "Ahmad Fauzi",
        address: "Jl. Sudirman No. 78, Surabaya",
        amount: 512000,
        fine: 25000,
        period: "Juni 2026",
        dueDate: "2026-07-20",
        usage: "384 kWh",
        tariff: "R2/TR 2200 VA"
    },
    "456789012345": {
        name: "Dewi Lestari",
        address: "Jl. Diponegoro No. 99, Yogyakarta",
        amount: 98000,
        fine: 0,
        period: "Juni 2026",
        dueDate: "2026-07-20",
        usage: "73 kWh",
        tariff: "R1/TR 450 VA"
    },
    "567890123456": {
        name: "Rizal Firmansyah",
        address: "Jl. Ahmad Yani No. 33, Medan",
        amount: 876000,
        fine: 50000,
        period: "Mei 2026",
        dueDate: "2026-07-20",
        usage: "657 kWh",
        tariff: "R3/TR 6600 VA"
    }
};

// =============================================
// DATA TAGIHAN PDAM (Air)
// =============================================
const pdamData = {
    "88001234": {
        name: "Hendra Wijaya",
        address: "Jl. Gatot Subroto No. 15, Jakarta Selatan",
        amount: 75000,
        fine: 0,
        period: "Juni 2026",
        dueDate: "2026-07-25",
        usage: "15 m³",
        zone: "Zona A"
    },
    "88005678": {
        name: "Rina Marlina",
        address: "Jl. Antasari No. 67, Banjarmasin",
        amount: 112000,
        fine: 10000,
        period: "Juni 2026",
        dueDate: "2026-07-25",
        usage: "22 m³",
        zone: "Zona B"
    },
    "88009012": {
        name: "Bambang Priyono",
        address: "Jl. Veteran No. 8, Semarang",
        amount: 54000,
        fine: 0,
        period: "Juni 2026",
        dueDate: "2026-07-25",
        usage: "11 m³",
        zone: "Zona A"
    }
};

// =============================================
// DATA TAGIHAN INTERNET
// =============================================
const internetData = {
    "INT-2024-001": {
        name: "Keluarga Santoso",
        address: "Jl. Kenanga No. 21, Depok",
        amount: 299000,
        fine: 0,
        period: "Juli 2026",
        dueDate: "2026-07-15",
        package: "IndiHome 50 Mbps",
        provider: "Telkom"
    },
    "INT-2024-002": {
        name: "Agus Setiawan",
        address: "Jl. Mawar No. 5, Bekasi",
        amount: 450000,
        fine: 15000,
        period: "Juli 2026",
        dueDate: "2026-07-15",
        package: "First Media 100 Mbps",
        provider: "First Media"
    },
    "INT-2024-003": {
        name: "Yuni Astuti",
        address: "Jl. Melati No. 33, Tangerang",
        amount: 199000,
        fine: 0,
        period: "Juli 2026",
        dueDate: "2026-07-15",
        package: "MyRepublic 20 Mbps",
        provider: "MyRepublic"
    }
};

// =============================================
// DATA TAGIHAN SEMINAR / EVENT
// =============================================
const seminarData = {
    "SEM2026001": {
        name: "Dr. Budi Prasetyo",
        address: "Universitas Teknologi Nusantara",
        amount: 350000,
        fine: 0,
        period: "Seminar Nasional AI 2026",
        dueDate: "2026-07-10",
        event: "Seminar Nasional Kecerdasan Buatan 2026",
        category: "Peserta Umum"
    },
    "SEM2026002": {
        name: "Mahasiswi Cantika",
        address: "Institut Bisnis & Informatika",
        amount: 150000,
        fine: 0,
        period: "Workshop UI/UX Design",
        dueDate: "2026-07-12",
        event: "Workshop UI/UX Design Masterclass",
        category: "Peserta Mahasiswa"
    },
    "CONF2026A": {
        name: "PT. Maju Bersama",
        address: "Jl. Sudirman Kav. 52, Jakarta",
        amount: 2500000,
        fine: 0,
        period: "Tech Conference 2026",
        dueDate: "2026-07-20",
        event: "Indonesia Tech Conference 2026",
        category: "Corporate Sponsor"
    }
};

// =============================================
// DATA SPP / BIAYA KULIAH MAHASISWA
// =============================================
const sppData = {
    "221011402463": {
        studentName: "M. Farid Zulianto",
        faculty: "Fakultas Teknik Informatika",
        program: "S1 Teknik Informatika",
        semester: "Ganjil 2025/2026",
        year: "2023",
        bills: [
            { id: "2520122644802201", desc: "REGISTRASI", amount: 500000, status: "paid", payDate: "28 Januari 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802301", desc: "ANGSURAN KE-2", amount: 300000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802401", desc: "ANGSURAN KE-3", amount: 300000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644800501", desc: "UTS", amount: 350000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802501", desc: "ANGSURAN KE-4", amount: 300000, status: "paid", payDate: "06 Juni 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802601", desc: "ANGSURAN KE-5", amount: 300000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" },
            { id: "2520122644802701", desc: "ANGSURAN KE-6", amount: 300000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" },
            { id: "2520122644800401", desc: "PRAKTEK", amount: 150000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" },
            { id: "2520122644800601", desc: "UAS", amount: 350000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" }
        ]
    },
    "221011402465": {
        studentName: "Nandi Mulyana",
        faculty: "Fakultas Ekonomi & Bisnis",
        program: "S1 Manajemen",
        semester: "Ganjil 2025/2026",
        year: "2023",
        bills: [
            { id: "2520122644802202", desc: "REGISTRASI", amount: 500000, status: "paid", payDate: "28 Januari 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802302", desc: "ANGSURAN KE-2", amount: 300000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802402", desc: "ANGSURAN KE-3", amount: 300000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644800502", desc: "UTS", amount: 350000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802502", desc: "ANGSURAN KE-4", amount: 300000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" },
            { id: "2520122644802602", desc: "ANGSURAN KE-5", amount: 300000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" },
            { id: "2520122644802702", desc: "ANGSURAN KE-6", amount: 300000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" },
            { id: "2520122644800402", desc: "PRAKTEK", amount: 150000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" },
            { id: "2520122644800602", desc: "UAS", amount: 350000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" }
        ]
    },
    "221011402467": {
        studentName: "Salsabilla",
        faculty: "Fakultas Ilmu Komputer",
        program: "S1 Sistem Informasi",
        semester: "Ganjil 2025/2026",
        year: "2022",
        bills: [
            { id: "2520122644802203", desc: "REGISTRASI", amount: 500000, status: "paid", payDate: "28 Januari 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802303", desc: "ANGSURAN KE-2", amount: 300000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802403", desc: "ANGSURAN KE-3", amount: 300000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644800503", desc: "UTS", amount: 350000, status: "paid", payDate: "29 April 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802503", desc: "ANGSURAN KE-4", amount: 300000, status: "paid", payDate: "06 Juni 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802603", desc: "ANGSURAN KE-5", amount: 300000, status: "paid", payDate: "06 Juni 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644802703", desc: "ANGSURAN KE-6", amount: 300000, status: "paid", payDate: "06 Juni 2026", payChannel: "TELLER", payMerchant: "Bank MANDIRI" },
            { id: "2520122644800403", desc: "PRAKTEK", amount: 150000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" },
            { id: "2520122644800603", desc: "UAS", amount: 350000, status: "unpaid", payDate: "-", payChannel: "-", payMerchant: "-" }
        ]
    }
};

// =============================================
// DATA KODE TAGIHAN SPP (Alternatif)
// =============================================
const billCodeData = {
    "986248962486438": {
        nim: "221011402463",
        billId: "SPP-2301-003",
        desc: "Biaya UTS",
        semester: "20252",
        amount: 500000,
        status: "unpaid"
    },
    "774125963258741": {
        nim: "221011402465",
        billId: "SPP-2302-003",
        desc: "Biaya UTS",
        semester: "20252",
        amount: 450000,
        status: "unpaid"
    },
    "553698741258963": {
        nim: "221011402467",
        billId: "SPP-2203-005",
        desc: "Biaya UAS",
        semester: "20252",
        amount: 500000,
        status: "unpaid"
    }
};

// =============================================
// MAPPING PREFIX HP → PROVIDER
// =============================================
const phoneProviders = {
    // Telkomsel
    "0811": "Telkomsel", "0812": "Telkomsel", "0813": "Telkomsel",
    "0821": "Telkomsel", "0822": "Telkomsel", "0823": "Telkomsel",
    "0851": "Telkomsel", "0852": "Telkomsel", "0853": "Telkomsel",
    "0855": "Telkomsel", "0856": "Telkomsel", "0857": "Telkomsel",
    "0858": "Telkomsel",
    // XL Axiata
    "0817": "XL Axiata", "0818": "XL Axiata", "0819": "XL Axiata",
    "0859": "XL Axiata", "0877": "XL Axiata", "0878": "XL Axiata",
    // Indosat Ooredoo
    "0814": "Indosat Ooredoo", "0815": "Indosat Ooredoo", "0816": "Indosat Ooredoo",
    "0855": "Indosat Ooredoo", "0856": "Indosat Ooredoo", "0857": "Indosat Ooredoo",
    "0858": "Indosat Ooredoo",
    // Tri (3)
    "0895": "Tri (3)", "0896": "Tri (3)", "0897": "Tri (3)",
    "0898": "Tri (3)", "0899": "Tri (3)",
    // Smartfren
    "0881": "Smartfren", "0882": "Smartfren", "0883": "Smartfren",
    "0884": "Smartfren", "0885": "Smartfren", "0886": "Smartfren",
    "0887": "Smartfren", "0888": "Smartfren", "0889": "Smartfren",
    // Axis
    "0831": "Axis", "0832": "Axis", "0833": "Axis", "0838": "Axis"
};

// =============================================
// PAKET PULSA & DATA
// =============================================
const pulsaPackages = {
    pulsa: [
        { value: 10000, label: "Rp 10.000", price: 11000 },
        { value: 25000, label: "Rp 25.000", price: 26500 },
        { value: 50000, label: "Rp 50.000", price: 52000 },
        { value: 100000, label: "Rp 100.000", price: 103000 },
        { value: 200000, label: "Rp 200.000", price: 205000 }
    ],
    data: [
        { id: "d1", label: "1 GB / 7 Hari", price: 15000, quota: "1 GB", validity: "7 hari" },
        { id: "d2", label: "3 GB / 30 Hari", price: 35000, quota: "3 GB", validity: "30 hari" },
        { id: "d3", label: "6 GB / 30 Hari", price: 60000, quota: "6 GB", validity: "30 hari" },
        { id: "d4", label: "12 GB / 30 Hari", price: 110000, quota: "12 GB", validity: "30 hari" },
        { id: "d5", label: "25 GB / 30 Hari", price: 195000, quota: "25 GB", validity: "30 hari" },
        { id: "d6", label: "50 GB / 30 Hari", price: 350000, quota: "50 GB", validity: "30 hari" }
    ]
};

// =============================================
// DAFTAR BANK VIRTUAL ACCOUNT
// =============================================
const bankList = [
    { code: "BCA", name: "Bank BCA", prefix: "1234" },
    { code: "BNI", name: "Bank BNI", prefix: "8888" },
    { code: "Mandiri", name: "Bank Mandiri", prefix: "8880" },
    { code: "BRI", name: "Bank BRI", prefix: "7777" },
    { code: "CIMB", name: "CIMB Niaga", prefix: "9999" }
];

// =============================================
// LOKASI KANTOR / KASIR (Untuk Bayar di Teller)
// =============================================
const tellerLocations = [
    { name: "Kantor Pusat BayarKita", address: "Jl. Sudirman Kav. 1, Jakarta Pusat", hours: "08:00 – 17:00" },
    { name: "Agen BayarKita – Alfamart", address: "Seluruh outlet Alfamart Indonesia", hours: "07:00 – 22:00" },
    { name: "Agen BayarKita – Indomaret", address: "Seluruh outlet Indomaret Indonesia", hours: "07:00 – 22:00" },
    { name: "Kantor Pos Indonesia", address: "Seluruh kantor pos Indonesia", hours: "08:00 – 16:00" }
];
