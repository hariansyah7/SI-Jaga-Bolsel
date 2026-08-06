import { Complaint, User, AuditLog, CategoryMaster, AgencyMaster } from '../types/wbs';

export const INITIAL_AGENCIES: AgencyMaster[] = [
  { id: 'opd-1', code: 'SETDA', name: 'Sekretariat Daerah Kab. Bolaang Mongondow Selatan', acronym: 'SETDA' },
  { id: 'opd-2', code: 'INSP', name: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan', acronym: 'INSPEKTORAT' },
  { id: 'opd-3', code: 'DISDIK', name: 'Dinas Pendidikan dan Kebudayaan', acronym: 'DISDIKBUD' },
  { id: 'opd-4', code: 'DINKES', name: 'Dinas Kesehatan', acronym: 'DINKES' },
  { id: 'opd-5', code: 'PUPR', name: 'Dinas Pekerjaan Umum dan Penataan Ruang', acronym: 'DINAS PUPR' },
  { id: 'opd-6', code: 'BKPSDM', name: 'Badan Kepegawaian dan Pengembangan SDM', acronym: 'BKPSDM' },
  { id: 'opd-7', code: 'BPKPD', name: 'Badan Pengelola Keuangan dan Pendapatan Daerah', acronym: 'BPKPD' },
  { id: 'opd-8', code: 'DPMD', name: 'Dinas Pemberdayaan Masyarakat dan Desa', acronym: 'DPMD' },
  { id: 'opd-9', code: 'DISKOMINFO', name: 'Dinas Komunikasi dan Informatika', acronym: 'DISKOMINFO' },
  { id: 'opd-10', code: 'SATPOLPP', name: 'Satuan Polisi Pamong Praja & Damkar', acronym: 'SATPOL PP' },
];

export const BOLSEL_DISTRICTS = [
  {
    name: 'Kecamatan Bolaang Uki',
    villages: ['Molibagu', 'Tabilaa', 'Sondana', 'Tolondadu', 'Salongo', 'Popodu', 'Toluaya', 'Pintadia']
  },
  {
    name: 'Kecamatan Posigadan',
    villages: ['Momalia', 'Pilolahunga', 'Maluaya', 'Luwoo', 'Lion', 'Sinombayag', 'Iluanga']
  },
  {
    name: 'Kecamatan Pinolosian',
    villages: ['Komangaan', 'Lungkap', 'Linawan', 'Tolongon', 'Ilomata', 'Nunuk']
  },
  {
    name: 'Kecamatan Pinolosian Tengah',
    villages: ['Adow', 'Tobayagan', 'Deaga', 'Toriu']
  },
  {
    name: 'Kecamatan Pinolosian Timur',
    villages: ['Dumagin A', 'Dumagin B', 'Iligon', 'Dayow', 'Pusian']
  }
];

export const INITIAL_CATEGORIES: CategoryMaster[] = [
  { id: 'cat-1', code: 'KOR', name: 'Korupsi', description: 'Penyalahgunaan dana APBD, anggaran proyek, atau keuangan daerah untuk memperkaya diri/orang lain.', iconName: 'Coins', activeCount: 14 },
  { id: 'cat-2', code: 'GRA', name: 'Gratifikasi', description: 'Penerimaan hadiah, uang, fasilitas, atau kompensasi tidak sah terkait jabatan.', iconName: 'Gift', activeCount: 8 },
  { id: 'cat-3', code: 'SUP', name: 'Suap', description: 'Pemberian atau penerimaan suap untuk mempengaruhi kebijakan, ijin, atau keputusan dinas.', iconName: 'Handshake', activeCount: 6 },
  { id: 'cat-4', code: 'WEN', name: 'Penyalahgunaan Wewenang', description: 'Tindakan mencederai integritas atau mengambil keputusan di luar kewenangan kewenangan dinas.', iconName: 'ShieldAlert', activeCount: 11 },
  { id: 'cat-5', code: 'KON', name: 'Konflik Kepentingan', description: 'Keterlibatan urusan pribadi/keluarga dalam pengadaan barang/jasa atau keputusan dinas.', iconName: 'Scale', activeCount: 4 },
  { id: 'cat-6', code: 'PUN', name: 'Pungutan Liar', description: 'Pungutan tidak sah dalam pelayanan publik, perizinan, atau administrasi kependudukan/sekolah.', iconName: 'Banknote', activeCount: 19 },
  { id: 'cat-7', code: 'DIS', name: 'Pelanggaran Disiplin ASN', description: 'Penyimpangan jam kerja, bolos kerja, penyalahgunaan wewenang kepegawaian, atau pelanggaran etika ASN.', iconName: 'UserCheck', activeCount: 15 },
  { id: 'cat-8', code: 'PBJ', name: 'Penyimpangan Pengadaan', description: 'Rekayasa lelang, mark-up harga, proyek fiktif, atau manipulasi tender barang & jasa.', iconName: 'Briefcase', activeCount: 9 },
  { id: 'cat-9', code: 'AST', name: 'Penyalahgunaan Aset Daerah', description: 'Penggunaan kendaraan dinas, rumah dinas, atau tanah daerah untuk kepentingan pribadi/illegal.', iconName: 'Building', activeCount: 7 },
  { id: 'cat-10', code: 'LNN', name: 'Lainnya', description: 'Bentuk pelanggaran integritas pemerintahan lainnya yang merugikan publik.', iconName: 'HelpCircle', activeCount: 3 },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    nip: '199111122022031003',
    name: 'Hariansah Noviyanto, SE',
    email: 'hariansyah25@gmail.com',
    role: 'admin',
    position: 'Pranata Komputer Ahli Muda / System Admin WBS',
    agency: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
    phone: '0812-4455-8899',
    isActive: true,
    lastLogin: '2026-08-03 21:40'
  },
  {
    id: 'usr-op1',
    nip: '199008252014022001',
    name: 'Siti Aminah Gobel, S.Kom',
    email: 'operator.wbs@bolselkab.go.id',
    role: 'operator',
    position: 'Operator Pengelola Laporan Masyarakat',
    agency: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
    phone: '0852-9988-7711',
    isActive: true,
    lastLogin: '2026-08-03 20:15'
  },
  {
    id: 'usr-insp',
    nip: '197603151998031005',
    name: 'Drs. H. Rolly Podomi, ME',
    email: 'inspektur@bolselkab.go.id',
    role: 'inspektur',
    position: 'Inspektur Daerah Kabupaten Bolaang Mongondow Selatan',
    agency: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
    phone: '0813-5678-9012',
    isActive: true,
    lastLogin: '2026-08-03 19:30'
  },
  {
    id: 'usr-auditor1',
    nip: '198811042011011003',
    name: 'Irwan Hasania, SE, Ak, CA',
    email: 'auditor.irwan@bolselkab.go.id',
    role: 'auditor',
    position: 'Auditor Ahli Muda / Ketua Tim Investigasi 1',
    agency: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
    phone: '0821-3344-5566',
    isActive: true,
    lastLogin: '2026-08-03 18:50'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-145',
    ticketCode: 'WBS-2026-000145',
    secretPin: '8492',
    title: 'Dugaan Pungutan Liar Pengurusan Sertifikat Tanah dan Izin Bagunan di Kecamatan Bolaang Uki',
    category: 'Pungutan Liar',
    chronology: `Pada tanggal 15 Juli 2026, saya mendatangi kantor pelayanan umum unit kerja setempat untuk mengurus berkas verifikasi administrasi. Oknum pejabat yang bersangkutan meminta uang tunai sebesar Rp 1.500.000 tanpa kuitansi resmi, dengan ancaman jika tidak membayar maka berkas permohonan akan diperlambat hingga 3 bulan. Kejadian ini disaksikan oleh 2 orang warga lainnya dan ada bukti rekaman audio serta foto kwitansi tidak resmi bertuliskan 'biaya taktis'. Mohon Inspektorat Daerah Kabupaten Bolaang Mongondow Selatan menindak tegas oknum yang merusak citra ASN ini.`,
    reporter: {
      isAnonymous: true,
      occupation: 'Wiraswasta / Masyarakat Umumn'
    },
    reportedParty: {
      name: 'Oknum Kasi Pelayanan Umum (Inisial SM)',
      position: 'Kepala Seksi Pelayanan Publik',
      agency: 'Dinas Pekerjaan Umum dan Penataan Ruang',
      unit: 'Bidang Tata Ruang & Perizinan',
      location: 'Kecamatan Bolaang Uki, Kab. Bolsel'
    },
    occurrence: {
      date: '2026-07-15',
      time: '10:30 WITA',
      district: 'Kecamatan Bolaang Uki',
      village: 'Molibagu',
      addressDetails: 'Ruang Pelayanan Teknis Gedung B Kompleks Perkantoran Panango',
      coordinates: { lat: 0.3854, lng: 123.8643 }
    },
    attachments: [
      {
        id: 'att-101',
        name: 'Bukti_Kwitansi_Tidak_Resmi.pdf',
        size: 2450000,
        type: 'application/pdf',
        url: '#',
        uploadDate: '2026-07-16 14:20',
        isEncrypted: true
      },
      {
        id: 'att-102',
        name: 'Foto_Pemberian_Uang_Taktis.jpg',
        size: 3800000,
        type: 'image/jpeg',
        url: '#',
        uploadDate: '2026-07-16 14:21',
        isEncrypted: true
      }
    ],
    status: 'investigasi',
    priority: 'Tinggi',
    riskScore: 85,
    createdAt: '2026-07-16 14:22 WITA',
    updatedAt: '2026-08-01 11:00 WITA',
    timeline: [
      {
        id: 'tl-1',
        status: 'dalam_verifikasi',
        title: 'Laporan Masuk & Terregistrasi',
        description: 'Laporan telah diterima sistem WBS Inspektorat dengan kode tiket WBS-2026-000145.',
        timestamp: '2026-07-16 14:22 WITA',
        actor: 'Sistem WBS',
        role: 'pelapor'
      },
      {
        id: 'tl-2',
        status: 'terverifikasi',
        title: 'Verifikasi Berkas & Kelengkapan Bukti',
        description: 'Operator mengonfirmasi kelengkapan bukti awal berupa kwitansi tidak resmi & keterangan lokasi.',
        timestamp: '2026-07-18 09:15 WITA',
        actor: 'Siti Aminah Gobel, S.Kom',
        role: 'operator'
      },
      {
        id: 'tl-3',
        status: 'disposisi',
        title: 'Disposisi Inspektur Daerah',
        description: 'Inspektur mendisposisikan laporan ke Tim Auditor 1 untuk dilakukan Investigasi Khusus.',
        timestamp: '2026-07-22 14:00 WITA',
        actor: 'Drs. H. Rolly Podomi, ME',
        role: 'inspektur'
      },
      {
        id: 'tl-4',
        status: 'investigasi',
        title: 'Pelaksanaan Investigasi Khusus & Pemeriksaan Terlapor',
        description: 'Tim Auditor sedang mengumpulkan keterangan klarifikasi dan pemeriksaan lapangan di Molibagu.',
        timestamp: '2026-08-01 11:00 WITA',
        actor: 'Irwan Hasania, SE, Ak, CA',
        role: 'auditor'
      }
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Siti Aminah Gobel, S.Kom',
        role: 'operator',
        text: 'Bukti fisik kwitansi dan foto pendukung terverifikasi valid dan keterbacaan tinggi.',
        timestamp: '2026-07-18 09:20 WITA',
        isInternalOnly: true
      },
      {
        id: 'c-2',
        author: 'Irwan Hasania, SE, Ak, CA',
        role: 'auditor',
        text: 'Tim sudah menjadwalkan konfrontasi data dengan Kepala Dinas PUPR terkait prosedur resmi penerbitan izin.',
        timestamp: '2026-08-01 11:05 WITA',
        isInternalOnly: true
      }
    ],
    aiSummary: {
      priority: 'Tinggi',
      riskScore: 85,
      summary: 'Dugaan pungutan liar sebesar Rp 1.500.000 dalam layanan perizinan publik di PUPR Bolsel. Bukti fisik kwitansi non-resmi berpotensi kuat melanggar Perpres No 87 Tahun 2016 tentang Kategori Pungli.',
      recommendedActions: [
        'Melakukan uji petik transaksi administrasi di unit kerja pelayanan PUPR',
        'Meminta klarifikasi resmi terlapor oknum Kasi SM',
        'Menyiapkan LHP rekomendasi sanksi disiplin ASN'
      ],
      integrityImpact: 'Berpotensi merusak Indeks Persepsi Korupsi (IPK) Pemkab Bolsel dan merugikan kepastian layanan masyarakat.',
      aiGenerated: true
    },
    assignedAuditor: 'Irwan Hasania, SE, Ak, CA',
    assignedInspector: 'Drs. H. Rolly Podomi, ME',
    dispositionNotes: 'Segera lakukan investigasi mendalam dan pastikan perlindungan penuh terhadap kerahasiaan identitas saksi.'
  },
  {
    id: 'cmp-144',
    ticketCode: 'WBS-2026-000144',
    secretPin: '3109',
    title: 'Dugaan Pengadaan Fiktif Komputer dan Printer di Dinas Pendidikan dan Kebudayaan',
    category: 'Penyimpangan Pengadaan',
    chronology: `Ditemukan ketidaksesuaian laporan realisasi belanja modal peralatan komputer sekolah senilai Rp 450.000.000 pada Triwulan II 2026. Barang unit fisik komputer PC yang terdaftar dalam Berita Acara Serah Terima (BAST) tidak pernah didistribusikan ke 5 SD Negeri di Kecamatan Pinolosian. Penyedia barang diduga merupakan perusahaan kerabat dekat oknum Pejabat Pembuat Komitmen (PPK).`,
    reporter: {
      isAnonymous: false,
      fullName: 'Hendra Saputra, S.Pd',
      nik: '7103041209880001',
      email: 'hendra.guru@gmail.com',
      phone: '0813-8877-6655',
      address: 'Desa Linawan, Kecamatan Pinolosian',
      occupation: 'Guru Tenaga Honorer'
    },
    reportedParty: {
      name: 'PPK Kegiatan Pengadaan (Inisial AP)',
      position: 'Pejabat Pembuat Komitmen (PPK)',
      agency: 'Dinas Pendidikan dan Kebudayaan',
      unit: 'Bidang Sarana dan Prasarana',
      location: 'Sekretariat Disdikbud Kab. Bolsel'
    },
    occurrence: {
      date: '2026-06-20',
      time: '09:00 WITA',
      district: 'Kecamatan Pinolosian',
      village: 'Linawan',
      addressDetails: 'SD Negeri 1 Linawan & Gedung Dinas Pendidikan',
      coordinates: { lat: 0.3512, lng: 123.9510 }
    },
    attachments: [
      {
        id: 'att-201',
        name: 'Dokumen_BAST_Fiktif.pdf',
        size: 5100000,
        type: 'application/pdf',
        url: '#',
        uploadDate: '2026-07-10 16:00',
        isEncrypted: true
      }
    ],
    status: 'disposisi',
    priority: 'Tinggi',
    riskScore: 92,
    createdAt: '2026-07-10 16:05 WITA',
    updatedAt: '2026-07-25 10:00 WITA',
    timeline: [
      {
        id: 'tl-201',
        status: 'dalam_verifikasi',
        title: 'Laporan Masuk',
        description: 'Laporan pengadaan fiktif terdaftar.',
        timestamp: '2026-07-10 16:05 WITA',
        actor: 'Pelapor Terbuka',
        role: 'pelapor'
      },
      {
        id: 'tl-202',
        status: 'terverifikasi',
        title: 'Validasi Berkas Disdikbud',
        description: 'Verifikasi awal kelengkapan dokumen BAST pengadaan sekolah.',
        timestamp: '2026-07-12 11:30 WITA',
        actor: 'Siti Aminah Gobel, S.Kom',
        role: 'operator'
      },
      {
        id: 'tl-203',
        status: 'disposisi',
        title: 'Disposisi ke Tim Audit Khusus PBJ',
        description: 'Instruksi audit fisik ke 5 lokasi sekolah penerima BAST.',
        timestamp: '2026-07-25 10:00 WITA',
        actor: 'Drs. H. Rolly Podomi, ME',
        role: 'inspektur'
      }
    ],
    comments: [],
    assignedAuditor: 'Irwan Hasania, SE, Ak, CA',
    assignedInspector: 'Drs. H. Rolly Podomi, ME'
  },
  {
    id: 'cmp-143',
    ticketCode: 'WBS-2026-000143',
    secretPin: '1256',
    title: 'Penyalahgunaan Mobil Dinas Operasional untuk Acara Keluarga Ke Luar Daerah',
    category: 'Penyalahgunaan Aset Daerah',
    chronology: `Mobil dinas plat merah nomor DB 12xx N milik OPD Sekretariat Daerah kedapatan digunakan untuk keperluan liburan keluarga oknum pejabat selama 4 hari penuh ke luar wilayah provinsi tanpa surat perintah tugas resmi. Penggunaan BBM dinas juga ditagihkan ke anggaran kas operasional dinas.`,
    reporter: {
      isAnonymous: true,
      occupation: 'Masyarakat Umum'
    },
    reportedParty: {
      name: 'Oknum Kabag Umum (Inisial RK)',
      position: 'Kepala Bagian Umum',
      agency: 'Sekretariat Daerah Kab. Bolaang Mongondow Selatan',
      unit: 'Bagian Perlengkapan & Rumah Tangga',
      location: 'Kompleks Perkantoran Panango'
    },
    occurrence: {
      date: '2026-06-01',
      time: '08:00 WITA',
      district: 'Kecamatan Bolaang Uki',
      village: 'Tabilaa',
      addressDetails: 'Halaman Perkantoran Panango'
    },
    attachments: [
      {
        id: 'att-301',
        name: 'Foto_Kendaraan_Di_Lokasi.jpg',
        size: 1900000,
        type: 'image/jpeg',
        url: '#',
        uploadDate: '2026-06-05 08:30',
        isEncrypted: true
      }
    ],
    status: 'selesai',
    priority: 'Sedang',
    riskScore: 60,
    createdAt: '2026-06-05 08:35 WITA',
    updatedAt: '2026-07-02 15:00 WITA',
    timeline: [
      {
        id: 'tl-301',
        status: 'dalam_verifikasi',
        title: 'Laporan Diterima',
        description: 'Laporan tercatat dalam sistem.',
        timestamp: '2026-06-05 08:35 WITA',
        actor: 'Sistem WBS',
        role: 'pelapor'
      },
      {
        id: 'tl-302',
        status: 'selesai',
        title: 'Selesai - Sanksi Disiplin Ringan & Pengembalian Kas',
        description: 'Terlapor telah diberikan teguran tertulis oleh Inspektur dan mengembalikan dana BBM ke Kas Daerah.',
        timestamp: '2026-07-02 15:00 WITA',
        actor: 'Drs. H. Rolly Podomi, ME',
        role: 'inspektur'
      }
    ],
    comments: [],
    inspectionReportUrl: 'LHP-INSP-2026-088.pdf',
    recommendationNote: 'Terlapor telah menyelesaikan sanksi administratif dan pengembalian ganti rugi keuangan daerah.'
  },
  {
    id: 'cmp-142',
    ticketCode: 'WBS-2026-000142',
    secretPin: '9921',
    title: 'Indikasi Pemotongan Dana Desa (ADD) untuk Kegiatan Seremonial Non-Anggaran',
    category: 'Korupsi',
    chronology: `Dugaan pemotongan Alokasi Dana Desa (ADD) sebesar 5% dari tiap desa di Kecamatan Posigadan oleh oknum staf kecamatan untuk pembiayaan acara seremonial di luar APBD. Pemotongan tidak memiliki dasar hukum dan tidak tercantum dalam APBDDes.`,
    reporter: {
      isAnonymous: true
    },
    reportedParty: {
      name: 'Oknum Kasi PMD Kecamatan Posigadan',
      position: 'Kepala Seksi Pemberdayaan Masyarakat Desa',
      agency: 'Dinas Pemberdayaan Masyarakat dan Desa',
      unit: 'Kecamatan Posigadan',
      location: 'Kecamatan Posigadan, Kab. Bolsel'
    },
    occurrence: {
      date: '2026-05-12',
      time: '14:00 WITA',
      district: 'Kecamatan Posigadan',
      village: 'Momalia',
      addressDetails: 'Kantor Camat Posigadan'
    },
    attachments: [],
    status: 'terverifikasi',
    priority: 'Tinggi',
    riskScore: 88,
    createdAt: '2026-05-15 10:20 WITA',
    updatedAt: '2026-05-20 16:00 WITA',
    timeline: [
      {
        id: 'tl-401',
        status: 'dalam_verifikasi',
        title: 'Laporan Diterima',
        description: 'Laporan pemotongan ADD terdaftar.',
        timestamp: '2026-05-15 10:20 WITA',
        actor: 'Sistem WBS',
        role: 'pelapor'
      },
      {
        id: 'tl-402',
        status: 'terverifikasi',
        title: 'Laporan Terverifikasi Valid',
        description: 'Telah divalidasi oleh Operator dan disiapkan untuk disposisi Inspektur.',
        timestamp: '2026-05-20 16:00 WITA',
        actor: 'Siti Aminah Gobel, S.Kom',
        role: 'operator'
      }
    ],
    comments: []
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-03 21:40 WITA',
    user: 'Rahmat Mokoginta, S.STP, M.Si',
    role: 'admin',
    action: 'LOGIN',
    target: 'System Auth',
    details: 'Berhasil login ke Dashboard Administrator WBS',
    ipAddress: '180.252.12.98',
    browser: 'Chrome 127.0 (macOS)'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-03 20:15 WITA',
    user: 'Siti Aminah Gobel, S.Kom',
    role: 'operator',
    action: 'VERIFY',
    target: 'WBS-2026-000145',
    details: 'Memverifikasi status kelengkapan berkas fisik & lampiran laporan',
    ipAddress: '180.252.14.102',
    browser: 'Firefox 128.0 (Windows 11)'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-03 19:30 WITA',
    user: 'Drs. H. Rolly Podomi, ME',
    role: 'inspektur',
    action: 'DISPOSITION',
    target: 'WBS-2026-000145',
    details: 'Mendisposisikan laporan ke Tim Auditor 1 untuk Investigasi Khusus',
    ipAddress: '180.252.15.44',
    browser: 'Safari 17.5 (iOS / iPad)'
  },
  {
    id: 'log-4',
    timestamp: '2026-08-02 16:10 WITA',
    user: 'Rahmat Mokoginta, S.STP, M.Si',
    role: 'admin',
    action: 'EXPORT',
    target: 'Laporan Statistik Triwulan',
    details: 'Mengekspor rekapitulasi data WBS format PDF & Excel',
    ipAddress: '180.252.12.98',
    browser: 'Chrome 127.0 (macOS)'
  },
  {
    id: 'log-5',
    timestamp: '2026-08-01 11:00 WITA',
    user: 'Irwan Hasania, SE, Ak, CA',
    role: 'auditor',
    action: 'UPDATE',
    target: 'WBS-2026-000145',
    details: 'Memperbarui timeline investigasi & mengunggah catatan pemeriksaan awal',
    ipAddress: '180.252.88.19',
    browser: 'Chrome 126.0 (Windows 10)'
  }
];

export const INITIAL_FAQS = [
  {
    q: 'Apa itu Whistleblower System (WBS) Inspektorat Kab. Bolaang Mongondow Selatan?',
    a: 'Whistleblower System (WBS) adalah media pelaporan resmi berbasis digital yang disediakan oleh Inspektorat Daerah Kabupaten Bolaang Mongondow Selatan untuk memfasilitasi penyingkapan dugaan tindak pidana korupsi, gratifikasi, pungutan liar, penyalahgunaan wewenang, penyimpangan pengadaan, serta pelanggaran etika dan disiplin ASN.'
  },
  {
    q: 'Apakah kerahasiaan identitas pelapor terjamin?',
    a: 'Ya, 100% TERJAMIN! Pelapor diberikan pilihan penuh untuk melapor secara ANONIM (tanpa mengisi data pribadi sama sekali). Jika melapor dengan identitas terbuka, sistem kami menggunakan perlindungan enkripsi data tingkat tinggi dan dilindungi oleh Undang-Undang No. 13 Tahun 2006 jo. UU No. 31 Tahun 2014 tentang Perlindungan Saksi dan Korban.'
  },
  {
    q: 'Informasi apa saja yang wajib disiapkan saat melapor?',
    a: 'Untuk mempercepat tindak lanjut, pelapor disarankan memenuhi unsur 5W+2H: What (apa yang terjadi), Who (siapa terlapor & instansi), Where (lokasi kejadian), When (waktu kejadian), Why (penyebab/modus), How (kronologi jelas), dan How Much (perkiraan potensi nilai/kerugian).'
  },
  {
    q: 'Bagaimana cara memantau perkembangan laporan saya?',
    a: 'Setelah mengirimkan laporan, Anda akan mendapatkan KODE UNIK (contoh: WBS-2026-000145) dan PIN RAHASIA. Gunakan kode tersebut di fitur "Cek Status Laporan" pada menu utama untuk melihat timeline verifikasi, investigasi, hingga tindak lanjut Inspektorat.'
  },
  {
    q: 'Jenis berkas bukti apa saja yang dapat diunggah?',
    a: 'Sistem mendukung unggah berkas foto (JPG, PNG), dokumen (PDF, Word, Excel), rekaman video/audio (MP4, MP3), dan arsip kompresi (ZIP/RAR) dengan ukuran maksimal 100 MB per pengiriman.'
  }
];
