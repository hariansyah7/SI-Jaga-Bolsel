import React from 'react';
import { 
  FileText, CheckCircle2, ShieldAlert, Clock, AlertCircle, BarChart3, 
  PieChart as PieIcon, Sparkles, TrendingUp, Users, ArrowUpRight, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Complaint, User } from '../../types/wbs';

interface DashboardOverviewProps {
  complaints: Complaint[];
  currentUser: User;
  setActiveView: (view: string) => void;
  setSelectedComplaintId?: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  complaints,
  currentUser,
  setActiveView,
  setSelectedComplaintId
}) => {
  const total = complaints.length;
  const verifikasi = complaints.filter(c => c.status === 'dalam_verifikasi' || c.status === 'terverifikasi').length;
  const disposisi = complaints.filter(c => c.status === 'disposisi').length;
  const investigasi = complaints.filter(c => c.status === 'investigasi').length;
  const selesai = complaints.filter(c => c.status === 'selesai').length;

  // Monthly trend mock data
  const monthlyData = [
    { month: 'Jan', total: 4, selesai: 3 },
    { month: 'Feb', total: 6, selesai: 5 },
    { month: 'Mar', total: 8, selesai: 6 },
    { month: 'Apr', total: 5, selesai: 4 },
    { month: 'Mei', total: 9, selesai: 7 },
    { month: 'Jun', total: 11, selesai: 9 },
    { month: 'Jul', total: 14, selesai: 10 },
    { month: 'Agu', total: complaints.length, selesai: selesai }
  ];

  // Category chart data
  const categoryCounts: Record<string, number> = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const pieData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  const CATEGORY_COLORS: Record<string, string> = {
    'Korupsi': '#EF4444', // Merah Terang (Bright Red)
    'Pungutan Liar': '#C2410C', // Oranye Tua (Dark Orange)
    'Pungutan Liar (Pungli)': '#C2410C', // Oranye Tua (Dark Orange)
    'Gratifikasi': '#3B82F6',
    'Penyalahgunaan Wewenang': '#EC4899',
    'Pelanggaran Disiplin ASN': '#10B981',
    'Penyimpangan Pengadaan': '#8B5CF6', // KHUSUS: Jangan diubah
    'Penyalahgunaan Aset Daerah': '#0EA5E9', // KHUSUS: Jangan diubah
  };

  const DEFAULT_COLORS = ['#EF4444', '#C2410C', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#0EA5E9'];

  const highPriorityList = complaints.filter(c => c.priority === 'Tinggi' || c.riskScore >= 80);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#C62828] via-[#B71C1C] to-[#991B1B] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selamat Datang Kembali, {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Pengawasan & Integritas WBS
          </h1>
          <p className="text-xs text-red-100 leading-relaxed">
            Inspektorat Daerah Kabupaten Bolaang Mongondow Selatan — Pantau & verifikasi setiap laporan dugaan pelanggaran secara objektif dan akuntabel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0">
          <button
            onClick={() => setActiveView('reports')}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-red-50 text-[#C62828] font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Kelola {total} Laporan</span>
          </button>
        </div>
      </div>

      {/* SUMMARY STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setActiveView('reports')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pengaduan</span>
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#C62828] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{total}</p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +12% Bulan ini
            </p>
          </div>
        </div>

        <div 
          onClick={() => setActiveView('verification')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dalam Verifikasi</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-amber-600">{verifikasi}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Perlu validasi operator</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveView('investigation')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Investigasi Aktif</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-600">{investigasi + disposisi}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tim Auditor bergerak</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveView('reports')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Laporan Selesai</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-600">{selesai}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Telah diterbitkan LHP</p>
          </div>
        </div>

      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Trend Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#C62828]" />
                <span>Tren Pengaduan WBS 2026 (Per Bulan)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Perbandingan jumlah laporan masuk vs penanganan selesai</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">2026</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="total" fill="#C62828" radius={[6, 6, 0, 0]} name="Total Laporan" />
                <Bar dataKey="selesai" fill="#10B981" radius={[6, 6, 0, 0]} name="Selesai Ditindaklanjuti" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#C62828]" />
              <span>Sebaran Kategori Pelanggaran</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Persentase jenis kasus dilaporkan masyarakat</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* HIGH PRIORITY ALERTS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* High Priority Cases (AI Risk Score >= 80) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Kasus Prioritas Tinggi (Risk Score &gt; 80)
              </h3>
            </div>
            <span className="text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              {highPriorityList.length} Perhatian Khusus
            </span>
          </div>

          <div className="space-y-3">
            {highPriorityList.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  if (setSelectedComplaintId) setSelectedComplaintId(c.id);
                  setActiveView('reports');
                }}
                className="p-4 rounded-2xl bg-red-50/40 border border-red-100 hover:border-[#C62828] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-[#C62828] bg-white px-2 py-0.5 rounded border border-red-200">
                      {c.ticketCode}
                    </span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Terlapor: {c.reportedParty.name} ({c.reportedParty.agency})
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">RISK SCORE</span>
                    <span className="text-sm font-black text-red-600 font-mono">{c.riskScore}/100</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 text-[#C62828] transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick System Status & Notification Stream */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Status Sistem & Enkripsi Server</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">Modul AI Analis Triage</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Aktif (Gemini 3.6 Flash)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">Enkripsi Berkas WBS</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">AES-256 Bit SSL</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">Zona Integritas WBK/WBBM</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Kab. Bolsel 2026</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
