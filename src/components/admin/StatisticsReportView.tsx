import React from 'react';
import { 
  BarChart3, Download, TrendingUp, ShieldCheck, Award, 
  Coins, FileCheck, Activity, CheckCircle2, AlertTriangle, PieChart as PieIcon 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend, Cell, PieChart, Pie 
} from 'recharts';
import { Complaint } from '../../types/wbs';

interface StatisticsReportViewProps {
  complaints: Complaint[];
}

export const StatisticsReportView: React.FC<StatisticsReportViewProps> = ({ complaints }) => {
  // Mock data for Indeks Persepsi Korupsi (IPK) trend (Scale 0 - 4.00)
  const ipkTrendData = [
    { year: '2022', ipk: 3.42, integritas: 78.4 },
    { year: '2023', ipk: 3.58, integritas: 81.2 },
    { year: '2024', ipk: 3.69, integritas: 84.0 },
    { year: '2025', ipk: 3.78, integritas: 86.5 },
    { year: '2026 (YTD)', ipk: 3.88, integritas: 89.2 },
  ];

  // Financial Recovery (Kerugian Negara vs TGR)
  const financialRecoveryData = [
    { triwulan: 'TW I 2025', potensi: 80, pengembalian: 65 },
    { triwulan: 'TW II 2025', potensi: 120, pengembalian: 110 },
    { triwulan: 'TW III 2025', potensi: 95, pengembalian: 88 },
    { triwulan: 'TW IV 2025', potensi: 150, pengembalian: 135 },
    { triwulan: 'TW I 2026', potensi: 160, pengembalian: 142.5 },
  ];

  // Sectoral breakdown of Corruption Risk
  const corruptionRiskBySector = [
    { sector: 'Pengadaan (PBJ)', count: 18, color: '#8B5CF6' }, // Penyimpangan Pengadaan (tidak diubah)
    { sector: 'Korupsi APBD', count: 14, color: '#EF4444' }, // Korupsi (Merah Terang)
    { sector: 'Pungutan Liar (Pungli)', count: 19, color: '#C2410C' }, // Pungutan Liar (Oranye Tua)
    { sector: 'Aset & Keuangan Daerah', count: 9, color: '#0EA5E9' }, // Penyalahgunaan Aset (tidak diubah)
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#C62828]" />
            <span>Laporan Statistik Eksekutif & Kinerja Inspektorat</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi Indeks Korupsi, Indeks Integritas, & Pemulihan Kerugian Keuangan Daerah Kabupaten Bolaang Mongondow Selatan.
          </p>
        </div>

        <button
          onClick={() => alert('Mengunduh Laporan Statistik Tahunan WBS (PDF)...')}
          className="px-4 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Cetak Laporan Eksekutif PDF</span>
        </button>
      </div>

      {/* Top Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Indeks Korupsi / IPK (BRIGHT RED THEME) */}
        <div className="bg-white p-5 rounded-3xl border border-red-200/80 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 opacity-60"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Indeks Persepsi Korupsi</span>
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-red-600 tracking-tight">3.88</p>
              <span className="text-xs text-red-500 font-bold">/ 4.00</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold border border-red-200">
              <ShieldCheck className="w-3 h-3 text-red-600" />
              <span>Sangat Baik (Bebas Korupsi)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Pengembalian Kerugian Negara (Nominal sized to never overflow box) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-all overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pengembalian Kerugian</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            {/* Carefully sized and wrapped nominal text so it never overflows card container */}
            <p className="text-lg sm:text-xl lg:text-2xl font-black text-blue-600 tracking-tight leading-snug break-words max-w-full">
              Rp 142.500.000
            </p>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              TGR dari hasil tindak lanjut rekomendasi LHP
            </p>
          </div>
        </div>

        {/* Metric 3: Tingkat Penyelesaian Kasus */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tingkat Penyelesaian</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-600 tracking-tight">84.5%</p>
            <p className="text-[11px] text-slate-500 font-medium">Rata-rata SLA balasan: 3.2 Hari Kerja</p>
          </div>
        </div>

        {/* Metric 4: Persentase Pelapor Anonim */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pelapor Anonim</span>
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#C62828] flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-[#C62828] tracking-tight">78%</p>
            <p className="text-[11px] text-slate-500 font-medium">Perlindungan Kerahasiaan 100%</p>
          </div>
        </div>

      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Indeks Persepsi Korupsi (IPK) Trend Chart (BRIGHT RED ACCENTED) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-red-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <h3 className="text-base font-bold text-slate-900">
                  Tren Indeks Persepsi Korupsi (IPK) Pemkab Bolsel
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perkembangan skor Indeks Persepsi Korupsi & Penilaian Integritas (Skala 0 - 4.00)
              </p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 self-start sm:self-auto">
              Skor IPK 2026: 3.88
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ipkTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="redIpkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#991B1B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`${val} / 4.00`, 'Indeks Persepsi Korupsi']}
                />
                <Area 
                  type="monotone" 
                  dataKey="ipk" 
                  stroke="#EF4444" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#redIpkGradient)" 
                  name="Indeks Korupsi (IPK)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kerugian Negara vs Pengembalian (TGR) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-600" />
              <span>Pengembalian TGR Kerugian Negara</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Perbandingan potensi nominal vs realisasi penyetoran ke Kas Daerah (Juta Rp)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialRecoveryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="triwulan" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`Rp ${val} Juta`, 'Nominal']}
                />
                <Bar dataKey="potensi" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Potensi Kerugian (Jt)" />
                <Bar dataKey="pengembalian" fill="#2563EB" radius={[4, 4, 0, 0]} name="Pengembalian TGR (Jt)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Sectoral Corruption Risk Analysis */}
      <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Analisis Pemetaan Risiko Korupsi Per Sektor</h3>
              <p className="text-xs text-slate-500">Pemantauan area rawan tindak pidana korupsi di lingkungan Pemkab Bolsel</p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Zona Integritas Inspektorat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {corruptionRiskBySector.map((sec, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">{sec.sector}</span>
                <span className="text-xs font-bold text-purple-700 bg-purple-200/80 px-2 py-0.5 rounded-full">
                  {sec.count} Kasus
                </span>
              </div>
              <div className="w-full bg-purple-200/60 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(sec.count / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

