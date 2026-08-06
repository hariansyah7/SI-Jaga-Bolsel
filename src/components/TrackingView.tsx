import React, { useState } from 'react';
import { 
  Search, Shield, KeyRound, CheckCircle2, Clock, FileText, Lock, 
  UserCheck, AlertCircle, Calendar, MapPin, Download, ArrowRight, Send, MessageSquare
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Complaint } from '../types/wbs';

interface TrackingViewProps {
  complaints: Complaint[];
  initialTicketCode?: string;
  onAddComment?: (ticketCode: string, commentText: string) => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ 
  complaints, 
  initialTicketCode = '',
  onAddComment
}) => {
  const [ticketInput, setTicketInput] = useState(initialTicketCode || 'WBS-2026-000145');
  const [pinInput, setPinInput] = useState('8492');
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null>(
    complaints.find(c => c.ticketCode === (initialTicketCode || 'WBS-2026-000145')) || null
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [newPublicComment, setNewPublicComment] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const found = complaints.find(
      c => c.ticketCode.trim().toUpperCase() === ticketInput.trim().toUpperCase()
    );

    if (!found) {
      setErrorMsg('Kode tiket pengaduan tidak ditemukan. Mohon periksa kembali kode Anda.');
      setSearchedComplaint(null);
      return;
    }

    if (pinInput && found.secretPin && found.secretPin !== pinInput.trim()) {
      setErrorMsg('PIN Rahasia yang Anda masukkan salah. Akses ditolak.');
      setSearchedComplaint(null);
      return;
    }

    setSearchedComplaint(found);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPublicComment || !searchedComplaint) return;

    if (onAddComment) {
      onAddComment(searchedComplaint.ticketCode, newPublicComment);
    } else {
      searchedComplaint.comments.push({
        id: `c-${Date.now()}`,
        author: searchedComplaint.reporter.isAnonymous ? 'Pelapor (Anonim)' : 'Pelapor',
        role: 'pelapor',
        text: newPublicComment,
        timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
        isInternalOnly: false
      });
    }

    setNewPublicComment('');
  };

  const downloadReceiptPdf = (complaint: Complaint) => {
    const doc = new jsPDF();
    doc.setFillColor(198, 40, 40);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PEMERINTAH KABUPATEN BOLAANG MONGONDOW SELATAN', 105, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('INSPEKTORAT DAERAH - TRACKING WHISTLEBLOWER SYSTEM', 105, 18, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('REKAPITULASI PROGRES PENANGANAN WBS', 105, 38, { align: 'center' });

    doc.setDrawColor(198, 40, 40);
    doc.rect(15, 45, 180, 20);
    doc.setFontSize(12);
    doc.setTextColor(198, 40, 40);
    doc.text(`TIKET: ${complaint.ticketCode}`, 20, 57);
    doc.text(`STATUS: ${complaint.status.toUpperCase()}`, 130, 57);

    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    let y = 75;

    const addRow = (label: string, val: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(val.length > 55 ? val.substring(0, 55) + '...' : val, 70, y);
      y += 8;
    };

    addRow('Judul Laporan', complaint.title);
    addRow('Kategori', complaint.category);
    addRow('Terlapor', `${complaint.reportedParty.name} (${complaint.reportedParty.agency})`);
    addRow('Tanggal Terdaftar', complaint.createdAt);
    addRow('Terakhir Diperbarui', complaint.updatedAt);

    doc.line(15, y + 5, 195, y + 5);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('RIWAYAT TIMELINE PROCESS:', 20, y);
    y += 8;

    complaint.timeline.forEach((tl, i) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`${i + 1}. [${tl.timestamp}] ${tl.title}`, 25, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`   ${tl.description}`, 25, y);
      y += 8;
    });

    doc.save(`Progres_WBS_${complaint.ticketCode}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dalam_verifikasi':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full">Dalam Verifikasi</span>;
      case 'terverifikasi':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-1 rounded-full">Terverifikasi Valid</span>;
      case 'disposisi':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold px-3 py-1 rounded-full">Disposisi Inspektur</span>;
      case 'investigasi':
        return <span className="bg-red-100 text-red-800 border border-red-300 text-xs font-bold px-3 py-1 rounded-full">Dalam Investigasi Khusus</span>;
      case 'selesai':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full">Laporan Selesai</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Search Header Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C62828] flex items-center justify-center font-bold">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Pelacakan Status Laporan (Tracking WBS)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau progres investigasi Inspektorat secara akurat menggunakan Kode Tiket & PIN.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kode Tiket Pelaporan *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="Contoh: WBS-2026-000145"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono font-bold tracking-wider text-sm focus:ring-2 focus:ring-[#C62828] outline-none uppercase"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              PIN Rahasia *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="4 Digit PIN"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Lacak</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* RESULT DETAILS */}
      {searchedComplaint && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Status Stepper Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-extrabold text-[#C62828] tracking-widest bg-red-50 px-2.5 py-1 rounded-md">
                  {searchedComplaint.ticketCode}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {searchedComplaint.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(searchedComplaint.status)}
                <button
                  onClick={() => downloadReceiptPdf(searchedComplaint)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Unduh Rekap PDF"
                >
                  <Download className="w-4 h-4 text-[#C62828]" />
                  <span className="hidden sm:inline">Cetak PDF</span>
                </button>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="grid grid-cols-4 gap-2 text-center pt-2">
              {[
                { key: 'dalam_verifikasi', label: '1. Verifikasi' },
                { key: 'disposisi', label: '2. Disposisi' },
                { key: 'investigasi', label: '3. Investigasi' },
                { key: 'selesai', label: '4. Selesai' },
              ].map((step, idx) => {
                const statusOrder = ['dalam_verifikasi', 'terverifikasi', 'disposisi', 'investigasi', 'selesai'];
                const currentIdx = statusOrder.indexOf(searchedComplaint.status);
                const stepTargetIdx = statusOrder.indexOf(step.key);

                const isDone = currentIdx >= stepTargetIdx;
                const isCurrent = currentIdx === stepTargetIdx;

                return (
                  <div key={step.key} className="space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-md'
                          : isCurrent
                          ? 'bg-[#C62828] text-white ring-4 ring-red-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <p className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Details & Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Summary Data */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Ringkasan Informasi Laporan
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Kategori Pelanggaran</span>
                    <span className="font-bold text-[#C62828] text-sm">{searchedComplaint.category}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Pihak Terlapor</span>
                    <span className="font-bold text-slate-900">{searchedComplaint.reportedParty.name}</span>
                    <span className="text-slate-500 block">{searchedComplaint.reportedParty.position} - {searchedComplaint.reportedParty.agency}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Waktu & Lokasi Kejadian</span>
                    <span className="font-bold text-slate-800">{searchedComplaint.occurrence.village}, {searchedComplaint.occurrence.district}</span>
                    <span className="text-slate-500 block">{searchedComplaint.occurrence.date} ({searchedComplaint.occurrence.time})</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Status Identitas Pelapor</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {searchedComplaint.reporter.isAnonymous ? 'ANONIM (Identitas Terlindung)' : 'TERBUKA'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Berkas Bukti Terlampir</span>
                    <span className="font-bold text-slate-700">{searchedComplaint.attachments.length} Berkas (Terenkripsi AES-256)</span>
                  </div>
                </div>
              </div>

              {/* Inspector Recommendation Note if finished */}
              {searchedComplaint.recommendationNote && (
                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 space-y-2 text-emerald-900">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Catatan Hasil Inspektorat</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {searchedComplaint.recommendationNote}
                  </p>
                </div>
              )}

            </div>

            {/* Right: Timeline & Discussion Stream */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Timeline Tree */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Riwayat Timeline Proses Investigasi</span>
                  <span className="text-xs text-slate-400 font-normal">{searchedComplaint.timeline.length} Tahapan</span>
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
                  {searchedComplaint.timeline.map((event) => (
                    <div key={event.id} className="relative flex items-start gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-[#C62828] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md ring-4 ring-white z-10">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{event.title}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">{event.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                        <div className="pt-1 text-[10px] text-[#C62828] font-bold">
                          Oleh: {event.actor}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Public Discussion Thread with Inspektorat */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#C62828]" />
                  <span>Klarifikasi & Pesan Daring (Pelapor & Tim Inspektorat)</span>
                </h3>

                {/* Comment History */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {searchedComplaint.comments.filter(c => !c.isInternalOnly).length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4 italic">
                      Belum ada pesan klarifikasi tambahan.
                    </p>
                  ) : (
                    searchedComplaint.comments.filter(c => !c.isInternalOnly).map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                          <span className="text-[#C62828]">{c.author}</span>
                          <span className="text-slate-400">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add New Message */}
                <form onSubmit={submitComment} className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={newPublicComment}
                    onChange={(e) => setNewPublicComment(e.target.value)}
                    placeholder="Tulis pesan klarifikasi atau pertanyaan ke tim..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#C62828] text-white font-bold text-xs hover:bg-[#B71C1C] transition-all flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
