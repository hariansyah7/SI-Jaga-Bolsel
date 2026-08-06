import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Download, Printer, Eye, Lock, ShieldAlert, 
  CheckCircle2, Clock, UserCheck, UserX, MapPin, Calendar, Sparkles, X, 
  FileSpreadsheet, ArrowRight, Check, Send, AlertCircle 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Complaint, ComplaintStatus, Role, User } from '../../types/wbs';
import { INITIAL_USERS } from '../../data/mockData';

interface ReportManagementProps {
  complaints: Complaint[];
  currentUser: User;
  onUpdateComplaint: (updated: Complaint) => void;
  selectedComplaintId?: string | null;
}

export const ReportManagement: React.FC<ReportManagementProps> = ({
  complaints,
  currentUser,
  onUpdateComplaint,
  selectedComplaintId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');

  const [activeModalComplaint, setActiveModalComplaint] = useState<Complaint | null>(
    selectedComplaintId ? (complaints.find(c => c.id === selectedComplaintId) || null) : null
  );
  const [activeTabInModal, setActiveTabInModal] = useState<'ringkasan' | 'kronologi' | 'bukti' | 'ai' | 'disposisi' | 'timeline'>('ringkasan');

  // Form states inside disposition tab
  const [dispositionNotesInput, setDispositionNotesInput] = useState('');
  const [assignedAuditorInput, setAssignedAuditorInput] = useState(INITIAL_USERS.find(u => u.role === 'auditor')?.name || 'Irwan Hasania, SE, Ak, CA');
  const [newStatusInput, setNewStatusInput] = useState<ComplaintStatus>('investigasi');

  // AI loading state
  const [analyzingAi, setAnalyzingAi] = useState(false);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch = 
      c.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reportedParty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reportedParty.agency.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesAgency = agencyFilter === 'all' || c.reportedParty.agency.includes(agencyFilter);

    return matchesSearch && matchesStatus && matchesCategory && matchesAgency;
  });

  const handleOpenDetail = (complaint: Complaint) => {
    setActiveModalComplaint(complaint);
    setDispositionNotesInput(complaint.dispositionNotes || '');
    setAssignedAuditorInput(complaint.assignedAuditor || 'Irwan Hasania, SE, Ak, CA');
    setNewStatusInput(complaint.status);
    setActiveTabInModal('ringkasan');
  };

  const handleSaveDisposition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalComplaint) return;

    const updatedTimeline = [...activeModalComplaint.timeline];
    if (newStatusInput !== activeModalComplaint.status) {
      updatedTimeline.push({
        id: `tl-${Date.now()}`,
        status: newStatusInput,
        title: `Status Diperbarui Menjadi ${newStatusInput.toUpperCase()}`,
        description: dispositionNotesInput || `Pembaruan status oleh ${currentUser.name} (${currentUser.role}).`,
        timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
        actor: currentUser.name,
        role: currentUser.role
      });
    }

    const updated: Complaint = {
      ...activeModalComplaint,
      status: newStatusInput,
      assignedAuditor: assignedAuditorInput,
      dispositionNotes: dispositionNotesInput,
      updatedAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
      timeline: updatedTimeline
    };

    onUpdateComplaint(updated);
    setActiveModalComplaint(updated);
    alert('Perubahan status & disposisi berhasil disimpan!');
  };

  const runAiAnalysis = async (complaint: Complaint) => {
    setAnalyzingAi(true);
    try {
      const res = await fetch('/api/ai/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: complaint.category,
          title: complaint.title,
          chronology: complaint.chronology,
          location: `${complaint.occurrence.village}, ${complaint.occurrence.district}`,
          reportedParty: complaint.reportedParty
        })
      });
      const data = await res.json();
      
      const updated: Complaint = {
        ...complaint,
        aiSummary: data,
        priority: data.priority || complaint.priority,
        riskScore: data.riskScore || complaint.riskScore
      };

      onUpdateComplaint(updated);
      setActiveModalComplaint(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const exportExcel = () => {
    const dataToExport = filtered.map(c => ({
      'Kode Tiket': c.ticketCode,
      'Tanggal Melapor': c.createdAt,
      'Kategori': c.category,
      'Judul Laporan': c.title,
      'Terlapor': c.reportedParty.name,
      'Jabatan Terlapor': c.reportedParty.position,
      'Instansi OPD': c.reportedParty.agency,
      'Kecamatan': c.occurrence.district,
      'Desa': c.occurrence.village,
      'Status': c.status,
      'Prioritas': c.priority,
      'Risk Score': c.riskScore,
      'Identitas Pelapor': c.reporter.isAnonymous ? 'ANONIM' : c.reporter.fullName
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data WBS Bolsel');
    XLSX.writeFile(wb, `Rekapitulasi_WBS_Bolsel_${new Date().toISOString().substring(0, 10)}.xlsx`);
  };

  const printOfficialBeritaAcara = (complaint: Complaint) => {
    const doc = new jsPDF();
    
    // Header Government Seal
    doc.setFillColor(198, 40, 40);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('PEMERINTAH KABUPATEN BOLAANG MONGONDOW SELATAN', 105, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('INSPEKTORAT DAERAH - LEMBAR DISPOSISI PENANGANAN WBS', 105, 18, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BERITA ACARA DISPOSISI INSPEKTUR DAERAH', 105, 38, { align: 'center' });

    doc.setFontSize(10);
    let y = 50;

    const addRow = (lbl: string, val: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(lbl, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(val.length > 55 ? val.substring(0, 55) + '...' : val, 70, y);
      y += 8;
    };

    addRow('Nomor Registrasi Tiket', complaint.ticketCode);
    addRow('Kategori Pelanggaran', complaint.category);
    addRow('Tanggal Penerimaan', complaint.createdAt);
    addRow('Nama Terlapor', complaint.reportedParty.name);
    addRow('Jabatan Terlapor', complaint.reportedParty.position);
    addRow('Perangkat Daerah (OPD)', complaint.reportedParty.agency);
    addRow('Tim Auditor Ditunjuk', complaint.assignedAuditor || 'Tim Auditor 1 Inspektorat');
    addRow('Status Penanganan', complaint.status.toUpperCase());

    doc.rect(15, y + 5, 180, 45);
    doc.setFont('helvetica', 'bold');
    doc.text('PETUNJUK / INTRUKSI DISPOSISI INSPEKTUR DAERAH:', 20, y + 15);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(complaint.dispositionNotes || 'Segera lakukan investigasi awal dan verifikasi lapangan secara cermat.', 170);
    doc.text(splitNotes, 20, y + 23);

    y += 60;

    // Tanda tangan
    doc.text('Bolaang Uki, ' + new Date().toLocaleDateString('id-ID'), 130, y);
    doc.text('Inspektur Daerah Kab. Bolsel', 130, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.text('Drs. H. Rolly Podomi, ME', 130, y + 35);
    doc.setFont('helvetica', 'normal');
    doc.text('NIP. 19760315 199803 1 005', 130, y + 40);

    doc.save(`Berita_Acara_Disposisi_${complaint.ticketCode}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Kelola Pengaduan Whistleblower System</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar seluruh laporan dugaan pelanggaran integritas ASN Kab. Bolsel
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportExcel}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode/terlapor/judul..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-[#C62828] outline-none"
          >
            <option value="all">Semua Status Penanganan</option>
            <option value="dalam_verifikasi">Dalam Verifikasi</option>
            <option value="terverifikasi">Terverifikasi Valid</option>
            <option value="disposisi">Disposisi Inspektur</option>
            <option value="investigasi">Dalam Investigasi</option>
            <option value="selesai">Selesai</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-[#C62828] outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="Korupsi">Korupsi</option>
            <option value="Gratifikasi">Gratifikasi</option>
            <option value="Pungutan Liar">Pungutan Liar</option>
            <option value="Penyimpangan Pengadaan">Penyimpangan Pengadaan</option>
            <option value="Pelanggaran Disiplin ASN">Pelanggaran Disiplin</option>
            <option value="Penyalahgunaan Aset Daerah">Penyalahgunaan Aset</option>
          </select>

          <div className="text-xs text-slate-500 font-bold flex items-center justify-end">
            Menampilkan {filtered.length} dari {complaints.length} Laporan
          </div>
        </div>
      </div>

      {/* COMPLAINTS DATA TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="p-4">Kode Tiket / Waktu</th>
                <th className="p-4">Judul & Kategori</th>
                <th className="p-4">Terlapor & Instansi</th>
                <th className="p-4">Identitas</th>
                <th className="p-4">Status</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-[#C62828] block text-sm">
                      {c.ticketCode}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{c.createdAt}</span>
                  </td>

                  <td className="p-4 max-w-xs">
                    <p className="font-bold text-slate-900 line-clamp-1">{c.title}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-50 text-[#C62828] text-[10px] font-bold border border-red-200">
                      {c.category}
                    </span>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-slate-800">{c.reportedParty.name}</p>
                    <p className="text-[11px] text-slate-500">{c.reportedParty.position}</p>
                    <p className="text-[10px] text-[#C62828] font-semibold">{c.reportedParty.agency}</p>
                  </td>

                  <td className="p-4">
                    {c.reporter.isAnonymous ? (
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center gap-1 w-fit">
                        <UserX className="w-3 h-3 text-slate-500" /> Anonim
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center gap-1 w-fit border border-emerald-200">
                        <UserCheck className="w-3 h-3 text-emerald-600" /> Terbuka
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      c.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'investigasi' ? 'bg-red-100 text-red-800' :
                      c.status === 'disposisi' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-sm">
                    <span className={c.riskScore >= 80 ? 'text-red-600 font-extrabold' : 'text-slate-700'}>
                      {c.riskScore}/100
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenDetail(c)}
                        className="p-1.5 rounded-lg bg-red-50 text-[#C62828] hover:bg-[#C62828] hover:text-white transition-all font-bold text-xs flex items-center gap-1"
                        title="Detail & Disposisi"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>

                      <button
                        onClick={() => printOfficialBeritaAcara(c)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                        title="Cetak Berita Acara"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLAINT DETAIL & DISPOSITION MODAL */}
      {activeModalComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400 text-lg">
                    {activeModalComplaint.ticketCode}
                  </span>
                  <span className="bg-[#C62828] px-2 py-0.5 rounded text-[10px] font-bold">
                    {activeModalComplaint.category}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  {activeModalComplaint.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveModalComplaint(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto text-xs font-bold">
              {[
                { id: 'ringkasan', label: 'Ringkasan & Terlapor' },
                { id: 'kronologi', label: 'Kronologi & Lokasi' },
                { id: 'bukti', label: `Bukti (${activeModalComplaint.attachments.length})` },
                { id: 'ai', label: 'Analisis AI Triage' },
                { id: 'disposisi', label: 'Disposisi Inspektur' },
                { id: 'timeline', label: 'Timeline Process' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTabInModal(t.id as any)}
                  className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTabInModal === t.id
                      ? 'border-[#C62828] text-[#C62828]'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* TAB 1: RINGKASAN */}
              {activeTabInModal === 'ringkasan' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Data Terlapor & Instansi</h3>
                    <div className="space-y-2 text-slate-700">
                      <p><strong>Nama Terlapor:</strong> {activeModalComplaint.reportedParty.name}</p>
                      <p><strong>Jabatan:</strong> {activeModalComplaint.reportedParty.position}</p>
                      <p><strong>Perangkat Daerah (OPD):</strong> {activeModalComplaint.reportedParty.agency}</p>
                      <p><strong>Unit Kerja:</strong> {activeModalComplaint.reportedParty.unit || '-'}</p>
                      <p><strong>Lokasi Kerja:</strong> {activeModalComplaint.reportedParty.location || '-'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Status & Identitas Pelapor</h3>
                    <div className="space-y-2 text-slate-700">
                      <p><strong>Status Kerahasiaan:</strong> {activeModalComplaint.reporter.isAnonymous ? 'ANONIM (Identitas Tersembunyi)' : 'TERBUKA'}</p>
                      {!activeModalComplaint.reporter.isAnonymous && (
                        <>
                          <p><strong>Nama Pelapor:</strong> {activeModalComplaint.reporter.fullName}</p>
                          <p><strong>NIK:</strong> {activeModalComplaint.reporter.nik}</p>
                          <p><strong>Email:</strong> {activeModalComplaint.reporter.email}</p>
                          <p><strong>Telepon/WA:</strong> {activeModalComplaint.reporter.phone}</p>
                        </>
                      )}
                      <p><strong>Waktu Terdaftar:</strong> {activeModalComplaint.createdAt}</p>
                      <p><strong>Risk Score:</strong> <span className="text-red-600 font-bold">{activeModalComplaint.riskScore}/100</span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KRONOLOGI */}
              {activeTabInModal === 'kronologi' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Detail Kronologi Kejadian</h3>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed font-sans whitespace-pre-line text-slate-800">
                    {activeModalComplaint.chronology}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1">
                    <p className="font-bold">Lokasi Kejadian di Map:</p>
                    <p>{activeModalComplaint.occurrence.village}, {activeModalComplaint.occurrence.district}, Kabupaten Bolaang Mongondow Selatan</p>
                    <p className="text-slate-400 text-[10px]">Waktu: {activeModalComplaint.occurrence.date} ({activeModalComplaint.occurrence.time})</p>
                  </div>
                </div>
              )}

              {/* TAB 3: BUKTI TERLAMPIR */}
              {activeTabInModal === 'bukti' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Daftar Berkas Terlampir (AES-256)</h3>
                  {activeModalComplaint.attachments.length === 0 ? (
                    <p className="text-slate-400 italic">Tidak ada berkas lampiran yang diunggah.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeModalComplaint.attachments.map((att) => (
                        <div key={att.id} className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#C62828]" />
                            <div>
                              <p className="font-bold text-slate-800">{att.name}</p>
                              <span className="text-[10px] text-slate-400">{(att.size / 1024 / 1024).toFixed(2)} MB • Terenkripsi</span>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(`Membuka berkas ${att.name} dari secure cloud storage...`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                          >
                            Unduh / Lihat
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: AI TRIAGE */}
              {activeTabInModal === 'ai' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Analisis AI Triage & Ringkasan Cerdas</span>
                    </h3>
                    <button
                      onClick={() => runAiAnalysis(activeModalComplaint)}
                      disabled={analyzingAi}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                    >
                      {analyzingAi ? 'Menganalisis Gemini...' : 'Jalankan Ulang AI Analysis'}
                    </button>
                  </div>

                  {activeModalComplaint.aiSummary ? (
                    <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3 text-purple-950">
                      <p className="font-bold">Prioritas Kasus AI: <span className="text-[#C62828]">{activeModalComplaint.aiSummary.priority}</span> (Score: {activeModalComplaint.aiSummary.riskScore})</p>
                      <p className="leading-relaxed">{activeModalComplaint.aiSummary.summary}</p>
                      
                      <div>
                        <p className="font-bold text-xs uppercase tracking-wider mb-1">Rekomendasi Tindakan AI:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {activeModalComplaint.aiSummary.recommendedActions?.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Klik tombol di atas untuk menganalisis laporan menggunakan Gemini AI.</p>
                  )}
                </div>
              )}

              {/* TAB 5: DISPOSISI INSPEKTUR */}
              {activeTabInModal === 'disposisi' && (
                <form onSubmit={handleSaveDisposition} className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Formulir Disposisi Inspektur & Tim Auditor</h3>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pilih Status Penanganan Terbaru</label>
                    <select
                      value={newStatusInput}
                      onChange={(e) => setNewStatusInput(e.target.value as ComplaintStatus)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value="dalam_verifikasi">Dalam Verifikasi</option>
                      <option value="terverifikasi">Terverifikasi Valid</option>
                      <option value="disposisi">Disposisi Inspektur</option>
                      <option value="investigasi">Dalam Investigasi Khusus</option>
                      <option value="selesai">Selesai Ditindaklanjuti</option>
                      <option value="ditolak">Ditolak / Berkas Tidak Memenuhi Syarat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tunjuk Tim Auditor Khusus</label>
                    <select
                      value={assignedAuditorInput}
                      onChange={(e) => setAssignedAuditorInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value="Irwan Hasania, SE, Ak, CA">Irwan Hasania, SE, Ak, CA (Tim 1)</option>
                      <option value="Siti Aminah Gobel, S.Kom">Siti Aminah Gobel, S.Kom (Tim 2)</option>
                      <option value="Rahmat Mokoginta, S.STP, M.Si">Rahmat Mokoginta, S.STP (Tim 3)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Catatan Disposisi / Petunjuk Inspektur</label>
                    <textarea
                      rows={4}
                      value={dispositionNotesInput}
                      onChange={(e) => setDispositionNotesInput(e.target.value)}
                      placeholder="Tuliskan petunjuk khusus pemeriksaan..."
                      className="w-full p-3 rounded-xl border border-slate-300"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-md"
                  >
                    Simpan Disposisi & Update Status
                  </button>
                </form>
              )}

              {/* TAB 6: TIMELINE */}
              {activeTabInModal === 'timeline' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Riwayat Timeline Aktivitas</h3>
                  <div className="space-y-3">
                    {activeModalComplaint.timeline.map((tl) => (
                      <div key={tl.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>{tl.title}</span>
                          <span className="text-slate-400">{tl.timestamp}</span>
                        </div>
                        <p className="text-slate-700">{tl.description}</p>
                        <span className="text-[10px] text-[#C62828] font-semibold">Oleh: {tl.actor} ({tl.role})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
