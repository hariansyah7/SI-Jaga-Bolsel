import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, FileText, Search, Lock, UserX, CheckCircle2, 
  Coins, Gift, Handshake, Scale, Banknote, UserCheck, Briefcase, Building, HelpCircle,
  ArrowRight, ShieldCheck, HelpCircle as HelpIcon, ChevronDown, ChevronUp,
  BarChart3, RefreshCw, Sparkles, LockKeyhole
} from 'lucide-react';
import { Complaint } from '../types/wbs';
import { INITIAL_FAQS } from '../data/mockData';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  complaints?: Complaint[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab, complaints = [] }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSearch, setTicketSearch] = useState('');

  // Minimalist text animation ticker for Hero Badge
  const heroAnnouncements = [
    'Pemerintah Kab. Bolaang Mongondow Selatan',
    '100% Proteksi Kerahasiaan Identitas Pelapor',
    'Sistem Integritas & Jaringan Aduan Gratifikasi',
  ];

  const headlineDynamicPhrases = [
    'Daerah Kita.',
    'Pelayanan Publik.',
    'Keuangan Kita.',
  ];

  const [tickerIndex, setTickerIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % heroAnnouncements.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroAnnouncements.length]);

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % headlineDynamicPhrases.length);
    }, 3000);
    return () => clearInterval(phraseTimer);
  }, [headlineDynamicPhrases.length]);

  // Dynamic statistics
  const totalReports = (complaints?.length || 0) + 1248;
  const inProcessing = complaints.filter(c => c.status === 'disposisi' || c.status === 'investigasi').length + 42;
  const completed = complaints.filter(c => c.status === 'selesai').length + 1196;

  const quickCategories = [
    { name: 'Dugaan Korupsi APBD', icon: Coins, color: 'bg-red-100 text-red-600 border border-red-200' },
    { name: 'Gratifikasi ASN', icon: Gift, color: 'bg-amber-100 text-amber-700 border border-amber-200' },
    { name: 'Disiplin & Etika', icon: UserCheck, color: 'bg-blue-100 text-blue-600 border border-blue-200' },
    { name: 'Pungutan Liar', icon: Banknote, color: 'bg-orange-100 text-orange-800 border border-orange-200' },
  ];

  const allCategories = [
    { name: 'Korupsi', icon: Coins, desc: 'Penyalahgunaan anggaran APBD, keuangan daerah, atau dana proyek.' },
    { name: 'Gratifikasi', icon: Gift, desc: 'Penerimaan hadiah/uang tidak sah terkait kewenangan jabatan ASN.' },
    { name: 'Suap', icon: Handshake, desc: 'Pemberian atau penerimaan suap untuk mempengaruhi kebijakan dinas.' },
    { name: 'Penyalahgunaan Wewenang', icon: Shield, desc: 'Tindakan mencederai integritas di luar kewenangan kedinasan.' },
    { name: 'Konflik Kepentingan', icon: Scale, desc: 'Keterlibatan urusan pribadi/keluarga dalam keputusan dinas.' },
    { name: 'Pungutan Liar', icon: Banknote, desc: 'Pungutan tak sah pada perizinan & pelayanan umum masyarakat.' },
    { name: 'Pelanggaran Disiplin ASN', icon: UserCheck, desc: 'Ketidakdisiplinan jam kerja, pembolosan, atau pelanggaran kode etika.' },
    { name: 'Penyimpangan Pengadaan', icon: Briefcase, desc: 'Rekayasa lelang, mark-up harga, atau tender barang/jasa fiktif.' },
    { name: 'Penyalahgunaan Aset Daerah', icon: Building, desc: 'Penggunaan kendaraan/rumah dinas atau tanah untuk keperluan ilegal.' },
    { name: 'Lainnya', icon: HelpCircle, desc: 'Bentuk penyimpangan integritas aparatur daerah lainnya.' },
  ];

  return (
    <div className="bg-white text-slate-800 space-y-12 pb-16">
      
      {/* HERO SECTION - SLEEK INTERFACE THEME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          
          {/* Hero Left Column */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center space-y-6">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Indicator Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200/80 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C62828]"></span>
                </span>
                <span className="text-[11px] font-bold text-[#C62828] uppercase tracking-wider">
                  Kanal Resmi & Aman
                </span>
              </div>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight"
            >
              Lindungi Integritas <br/>
              <span className="inline-block min-h-[1.2em] relative overflow-hidden align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -22, filter: 'blur(4px)' }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="inline-block whitespace-nowrap bg-gradient-to-r from-[#C62828] via-red-600 to-amber-600 bg-clip-text text-transparent pb-1"
                  >
                    {headlineDynamicPhrases[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
              Laporkan dugaan korupsi, gratifikasi, dan pelanggaran etika secara aman. Identitas Anda dijamin kerahasiaannya 100% berdasarkan ketentuan hukum.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={() => setActiveTab('report')}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-[#C62828] text-white rounded-2xl font-bold text-base shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Buat Laporan</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveTab('tracking')}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all"
              >
                <span>Cek Status</span>
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-2xl font-bold text-[#C62828]">{totalReports}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Laporan</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-2xl font-bold text-orange-500">{inProcessing}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Proses Investigasi</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-2xl font-bold text-green-600">{completed}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Selesai Ditindak</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-2xl font-bold text-blue-500">99%</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pelapor Anonim</div>
              </div>
            </div>

          </div>

          {/* Info Right Column */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <div className="bg-slate-50 rounded-[2rem] p-6 sm:p-8 h-full flex flex-col justify-between space-y-6 border border-slate-100">
              
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Jenis Pelanggaran Utama</h3>
                <button 
                  onClick={() => setActiveTab('report')}
                  className="text-xs font-semibold text-[#C62828] hover:underline"
                >
                  Pilih & Laporkan
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 gap-3">
                {quickCategories.map((cat, i) => {
                  const Icon = cat.icon;
                  return (
                    <div 
                      key={i}
                      onClick={() => setActiveTab('report')}
                      className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex items-center space-x-3 cursor-pointer hover:border-[#C62828] transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{cat.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Flow Process Box */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alur Pelaporan Ringkas</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-[#C62828] text-white flex items-center justify-center text-xs font-bold shrink-0">01</div>
                    <div className="flex-1 h-[2px] bg-slate-100"></div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">02</div>
                    <div className="flex-1 h-[2px] bg-slate-100"></div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">03</div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    <span className="text-[#C62828]">Isi Formulir</span>
                    <span>Verifikasi Bukti</span>
                    <span>Investigasi</span>
                  </div>
                  
                  <div className="pt-2 flex items-start space-x-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <LockKeyhole className="w-4 h-4 text-[#C62828] mt-0.5 shrink-0" />
                    <p className="text-xs text-red-800 leading-relaxed font-medium">
                      Semua data laporan dienkripsi standar militer AES-256 & kerahasiaan identitas terjamin hukum.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* QUICK TRACKING CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              Lacak Pengaduan Anda
            </span>
            <h3 className="text-xl font-bold text-slate-900">Punya Kode Tiket Laporan?</h3>
            <p className="text-xs text-slate-500">Masukkan kode tiket untuk memeriksa perkembangan proses investigasi secara real-time.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              placeholder="WBS-2026-XXXXXX"
              className="w-full sm:w-64 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-[#C62828] outline-none"
            />
            <button
              onClick={() => setActiveTab('tracking')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#C62828] hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-200 transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Cek Status</span>
            </button>
          </div>
        </div>
      </section>


      {/* 10 JENIS PELANGGARAN GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Klasifikasi Pengaduan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            10 Kategori Pelanggaran Yang Dapat Dilaporkan
          </h2>
          <p className="text-xs text-slate-500">
            Tim Auditor Inspektorat menindaklanjuti laporan berdasarkan klasifikasi jenis pelanggaran berikut.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {allCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab('report')}
                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-[#C62828] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C62828] flex items-center justify-center group-hover:bg-[#C62828] group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#C62828] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 text-[10px] font-bold text-[#C62828] flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <span>Laporkan Kasus Ini</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
            FAQ & Panduan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Pertanyaan Sering Diajukan
          </h2>
        </div>

        <div className="space-y-3">
          {INITIAL_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#C62828] text-xs sm:text-sm transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpIcon className="w-4 h-4 text-[#C62828] shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

