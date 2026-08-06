import React, { useState } from 'react';
import { 
  Award, FileText, Upload, CheckCircle2, ShieldAlert, Clock, Download, Sparkles 
} from 'lucide-react';
import { Complaint, User } from '../../types/wbs';

interface InvestigationViewProps {
  complaints: Complaint[];
  currentUser: User;
  onUpdateComplaint: (updated: Complaint) => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  complaints,
  currentUser,
  onUpdateComplaint
}) => {
  const activeCases = complaints.filter(
    c => c.status === 'investigasi' || c.status === 'disposisi'
  );

  const [selectedCase, setSelectedCase] = useState<Complaint | null>(
    activeCases[0] || null
  );

  const [lhpNumber, setLhpNumber] = useState('700/LHP-INSP/VIII/2026/042');
  const [recommendationNotes, setRecommendationNotes] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinishInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    const updatedTimeline = [
      ...selectedCase.timeline,
      {
        id: `tl-${Date.now()}`,
        status: 'selesai',
        title: 'Investigasi Selesai & LHP Diterbitkan',
        description: `Laporan Hasil Pemeriksaan (LHP No: ${lhpNumber}) diterbitkan. Rekomendasi: ${recommendationNotes}`,
        timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
        actor: currentUser.name,
        role: currentUser.role
      }
    ];

    const updated: Complaint = {
      ...selectedCase,
      status: 'selesai',
      recommendationNote: recommendationNotes,
      updatedAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
      timeline: updatedTimeline
    };

    onUpdateComplaint(updated);
    setSelectedCase(null);
    setRecommendationNotes('');
    alert(`Investigasi ${selectedCase.ticketCode} resmi SELESAI dan LHP diterbitkan!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#C62828]" />
            <span>Workspace Investigasi & Penyusunan LHP Auditor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemeriksaan khusus, verifikasi lapangan, dan penyusunan Laporan Hasil Pemeriksaan (LHP).
          </p>
        </div>

        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 self-start sm:self-auto">
          {activeCases.length} Kasus Berjalan
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-2 pt-2">
            Kasus Aktif Tim Auditor ({activeCases.length})
          </h3>

          {activeCases.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-medium">Tidak ada investigasi aktif saat ini.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {activeCases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-[#C62828] bg-red-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#C62828] text-xs">
                        {c.ticketCode}
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                        {c.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</p>

                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>Auditor: {c.assignedAuditor || 'Tim 1'}</span>
                      <span className="font-bold text-[#C62828]">{c.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Details & LHP Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          {selectedCase ? (
            <div className="space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <span className="font-mono font-bold text-[#C62828] text-xs bg-red-50 px-2.5 py-1 rounded">
                  {selectedCase.ticketCode}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  {selectedCase.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Terlapor: {selectedCase.reportedParty.name} ({selectedCase.reportedParty.agency})
                </p>
              </div>

              {/* Disposition Note from Inspector */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">Catatan Disposisi Inspektur:</p>
                <p className="italic">{selectedCase.dispositionNotes || 'Segera jadwalkan verifikasi lapangan dan pemanggilan saksi-saksi.'}</p>
              </div>

              {/* LHP Entry Form */}
              <form onSubmit={handleFinishInvestigation} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C62828]" />
                  <span>Penerbitan Laporan Hasil Pemeriksaan (LHP)</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nomor Surat Resmi LHP *
                  </label>
                  <input
                    type="text"
                    required
                    value={lhpNumber}
                    onChange={(e) => setLhpNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Catatan Rekomendasi Sanksi / Tindak Lanjut *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={recommendationNotes}
                    onChange={(e) => setRecommendationNotes(e.target.value)}
                    placeholder="Contoh: Terbukti melanggar PP 94 Tahun 2021. Direkomendasikan penjatuhan sanksi disiplin sedang berupa pemotongan TTP 25% selama 6 bulan..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#C62828] outline-none leading-relaxed"
                  ></textarea>
                </div>

                <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 text-center bg-white cursor-pointer hover:border-[#C62828]">
                  <Upload className="w-6 h-6 text-[#C62828] mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-800">Unggah Berkas LHP Ter-Tanda Tangan (PDF)</p>
                  <span className="text-[10px] text-slate-400">Ukuran maks 25 MB</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>FINALISASI INVESTIGASI & TERBITKAN LHP</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <Award className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Pilih salah satu kasus aktif untuk memproses LHP.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
