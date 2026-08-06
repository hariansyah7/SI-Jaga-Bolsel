import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, FileText, ShieldAlert, Eye, Lock, Clock, Sparkles 
} from 'lucide-react';
import { Complaint, User } from '../../types/wbs';

interface VerificationViewProps {
  complaints: Complaint[];
  currentUser: User;
  onUpdateComplaint: (updated: Complaint) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  complaints,
  currentUser,
  onUpdateComplaint
}) => {
  const pendingVerification = complaints.filter(
    c => c.status === 'dalam_verifikasi'
  );

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    pendingVerification[0] || null
  );

  const [verificationNote, setVerificationNote] = useState('');

  const handleVerify = (isValid: boolean) => {
    if (!selectedComplaint) return;

    const newStatus = isValid ? 'terverifikasi' : 'ditolak';
    const updatedTimeline = [
      ...selectedComplaint.timeline,
      {
        id: `tl-${Date.now()}`,
        status: newStatus,
        title: isValid ? 'Laporan Terverifikasi Valid' : 'Laporan Ditolak (Tidak Memenuhi Syarat)',
        description: verificationNote || (isValid ? 'Dokumen & bukti awal dinyatakan lengkap dan valid.' : 'Laporan belum memenuhi syarat verifikasi awal.'),
        timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
        actor: currentUser.name,
        role: currentUser.role
      }
    ];

    const updated: Complaint = {
      ...selectedComplaint,
      status: newStatus,
      updatedAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
      timeline: updatedTimeline
    };

    onUpdateComplaint(updated);
    setSelectedComplaint(null);
    setVerificationNote('');
    alert(`Laporan ${selectedComplaint.ticketCode} berhasil di-${isValid ? 'Verifikasi Valid' : 'Tolak'}!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-amber-500" />
            <span>Portal Verifikasi Berkas & Validasi WBS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tinjau keabsahan bukti pendukung dan kelengkapan kronologi laporan baru.
          </p>
        </div>

        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 self-start sm:self-auto">
          {pendingVerification.length} Antrean Verifikasi
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-2 pt-2">
            Antrean Belum Diverifikasi ({pendingVerification.length})
          </h3>

          {pendingVerification.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-medium">Semua laporan telah diverifikasi!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {pendingVerification.map((c) => {
                const isSelected = selectedComplaint?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
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
                      <span className="text-[10px] text-slate-400">{c.createdAt.split(' ')[0]}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</p>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">{c.reportedParty.agency}</span>
                      <span className="font-bold text-red-600">{c.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          {selectedComplaint ? (
            <div className="space-y-6">
              
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-[#C62828] text-xs bg-red-50 px-2.5 py-1 rounded">
                    {selectedComplaint.ticketCode}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    {selectedComplaint.title}
                  </h2>
                </div>

                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                  Menunggu Verifikasi Operator
                </span>
              </div>

              {/* Data Terlapor */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold">Terlapor</span>
                  <span className="font-bold text-slate-900">{selectedComplaint.reportedParty.name}</span>
                  <span className="text-slate-500 block">{selectedComplaint.reportedParty.position}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Perangkat Daerah</span>
                  <span className="font-bold text-red-600">{selectedComplaint.reportedParty.agency}</span>
                </div>
              </div>

              {/* Kronologi */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Uraian Kronologi Laporan:
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-line">
                  {selectedComplaint.chronology}
                </div>
              </div>

              {/* Action Form */}
              <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Keputusan Verifikasi Operator
                </h4>

                <textarea
                  rows={3}
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="Masukkan catatan verifikasi (alasan disetujui atau ditolak)..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#C62828] outline-none"
                ></textarea>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerify(false)}
                    className="w-1/2 py-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak Laporan</span>
                  </button>

                  <button
                    onClick={() => handleVerify(true)}
                    className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi Valid & Teruskan</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Pilih salah satu laporan di sebelah kiri untuk ditinjau.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
