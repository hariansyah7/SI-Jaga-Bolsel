import React, { useState } from 'react';
import { 
  Shield, UserX, UserCheck, FileText, UploadCloud, MapPin, Calendar, Clock, 
  CheckCircle2, AlertCircle, Trash2, Eye, Lock, FileSpreadsheet, FileArchive, 
  Image, Video, Sparkles, HelpCircle, ArrowRight, ArrowLeft, ShieldCheck, Download, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { Complaint, ViolationCategory, Attachment } from '../types/wbs';
import { INITIAL_AGENCIES, BOLSEL_DISTRICTS } from '../data/mockData';

interface ReportFormProps {
  onAddComplaint: (complaint: Complaint) => void;
  setActiveTab: (tab: string) => void;
  setSelectedTicketForTracking?: (code: string) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ 
  onAddComplaint, 
  setActiveTab,
  setSelectedTicketForTracking
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Identitas
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterNik, setReporterNik] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterAddress, setReporterAddress] = useState('');
  const [reporterOccupation, setReporterOccupation] = useState('');

  // Step 2: Data Terlapor
  const [reportedName, setReportedName] = useState('');
  const [reportedPosition, setReportedPosition] = useState('');
  const [reportedAgency, setReportedAgency] = useState(INITIAL_AGENCIES[0].name);
  const [customAgency, setCustomAgency] = useState('');
  const [reportedUnit, setReportedUnit] = useState('');
  const [reportedLocation, setReportedLocation] = useState('');

  // Step 3: Jenis Pelanggaran
  const [category, setCategory] = useState<ViolationCategory>('Pungutan Liar');

  // Step 4: Kronologi
  const [title, setTitle] = useState('');
  const [chronology, setChronology] = useState('');
  const [aiFormatting, setAiFormatting] = useState(false);

  // Step 5: Lokasi Kejadian
  const [occurrenceDate, setOccurrenceDate] = useState(new Date().toISOString().split('T')[0]);
  const [occurrenceTime, setOccurrenceTime] = useState('10:00 WITA');
  const [selectedDistrict, setSelectedDistrict] = useState(BOLSEL_DISTRICTS[0].name);
  const [selectedVillage, setSelectedVillage] = useState(BOLSEL_DISTRICTS[0].villages[0]);
  const [addressDetails, setAddressDetails] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 0.3854, lng: 123.8643 });

  // Step 6: Upload Bukti
  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([
    {
      id: 'att-user-1',
      name: 'Dokumen_Pendukung_Laporan.pdf',
      size: 1450000,
      type: 'application/pdf',
      url: '#',
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isEncrypted: true
    }
  ]);
  const [isDragging, setIsDragging] = useState(false);

  // Step 7: Persetujuan
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Success Modal State
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [stepError, setStepError] = useState('');

  // Validation helper per step
  const validateStep = (step: number): boolean => {
    setStepError('');
    if (step === 1) {
      if (!isAnonymous) {
        if (!reporterName.trim()) {
          setStepError('Nama lengkap pelapor wajib diisi untuk identitas terbuka!');
          return false;
        }
        if (!reporterNik.trim() || reporterNik.trim().length < 16) {
          setStepError('NIK pelapor wajib diisi 16 digit angka!');
          return false;
        }
        if (!reporterEmail.trim()) {
          setStepError('Alamat email aktif pelapor wajib diisi!');
          return false;
        }
      }
    } else if (step === 2) {
      if (!reportedName.trim()) {
        setStepError('Nama terlapor (atau inisial oknum) wajib diisi!');
        return false;
      }
      if (!reportedPosition.trim()) {
        setStepError('Jabatan terlapor wajib diisi!');
        return false;
      }
      if (reportedAgency === 'Lainnya' && !customAgency.trim()) {
        setStepError('Silakan sebutkan nama Instansi / OPD tempat terlapor bertugas!');
        return false;
      }
    } else if (step === 3) {
      if (!category) {
        setStepError('Silakan pilih kategori pelanggaran!');
        return false;
      }
    } else if (step === 4) {
      if (!title.trim()) {
        setStepError('Judul / Pokok Pengaduan wajib diisi!');
        return false;
      }
      if (!chronology.trim() || chronology.trim().length < 15) {
        setStepError('Rincian kronologi uraian kejadian wajib diisi minimal 15 karakter!');
        return false;
      }
    } else if (step === 5) {
      if (!occurrenceDate) {
        setStepError('Tanggal kejadian wajib dipilih!');
        return false;
      }
      if (!selectedDistrict || !selectedVillage) {
        setStepError('Kecamatan dan Desa lokasi kejadian wajib dipilih!');
        return false;
      }
    }
    return true;
  };

  const currentDistObj = BOLSEL_DISTRICTS.find(d => d.name === selectedDistrict) || BOLSEL_DISTRICTS[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files) as File[];
    
    filesArray.forEach(file => {
      const newAtt: Attachment = {
        id: `att-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: '#',
        uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isEncrypted: true
      };
      setUploadedFiles(prev => [...prev, newAtt]);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatChronologyAI = () => {
    if (!chronology) return;
    setAiFormatting(true);
    setTimeout(() => {
      const formatted = `[INFORMASI KRONOLOGI FORMAT STANDARD 5W+2H]:
- WHAT (Peristiwa): ${title || 'Dugaan Pelanggaran Integritas ASN'}
- WHO (Terlapor): ${reportedName} (${reportedPosition} - ${reportedAgency})
- WHERE (Lokasi): ${selectedVillage}, ${selectedDistrict}, Kab. Bolsel
- WHEN (Waktu): ${occurrenceDate} Pukul ${occurrenceTime}
- HOW (Modus/Kronologi): ${chronology}

Uraian Kejadian Lengkap:
${chronology}`;
      setChronology(formatted);
      setAiFormatting(false);
    }, 400);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all steps pass validation
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(5)) {
      return;
    }

    if (!agreedTerms || !captchaVerified) {
      setStepError('Anda wajib menyetujui pernyataan integritas dan verifikasi keamanan.');
      return;
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newTicketCode = `WBS-2026-${randomNum}`;
    const newSecretPin = Math.floor(1000 + Math.random() * 9000).toString();

    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      ticketCode: newTicketCode,
      secretPin: newSecretPin,
      title: title || `Laporan Dugaan ${category}`,
      category: category,
      chronology: chronology,
      reporter: {
        isAnonymous,
        fullName: isAnonymous ? undefined : reporterName,
        nik: isAnonymous ? undefined : reporterNik,
        email: isAnonymous ? undefined : reporterEmail,
        phone: isAnonymous ? undefined : reporterPhone,
        address: isAnonymous ? undefined : reporterAddress,
        occupation: isAnonymous ? undefined : reporterOccupation
      },
      reportedParty: {
        name: reportedName,
        position: reportedPosition,
        agency: reportedAgency === 'Lainnya' ? (customAgency.trim() || 'Lainnya') : reportedAgency,
        unit: reportedUnit,
        location: reportedLocation
      },
      occurrence: {
        date: occurrenceDate,
        time: occurrenceTime,
        district: selectedDistrict,
        village: selectedVillage,
        addressDetails: addressDetails,
        coordinates: coordinates
      },
      attachments: uploadedFiles,
      status: 'dalam_verifikasi',
      priority: category === 'Korupsi' || category === 'Gratifikasi' ? 'Tinggi' : 'Sedang',
      riskScore: category === 'Korupsi' ? 88 : 70,
      createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
      updatedAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: 'dalam_verifikasi',
          title: 'Laporan Diterima Sistem WBS',
          description: `Laporan berhasil terdaftar dengan kode tiket ${newTicketCode}.`,
          timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA',
          actor: isAnonymous ? 'Pelapor Anonim' : (reporterName || 'Pelapor Terbuka'),
          role: 'pelapor'
        }
      ],
      comments: [],
      aiSummary: {
        priority: category === 'Korupsi' ? 'Tinggi' : 'Sedang',
        riskScore: 78,
        summary: `Laporan dugaan ${category} mengenai ${title}. Memerlukan verifikasi berkas awal oleh Operator WBS.`,
        recommendedActions: [
          'Verifikasi keabsahan dokumen bukti',
          'Tinjau lokasi kejadian di ' + selectedDistrict,
          'Jadwalkan klarifikasi awal'
        ],
        aiGenerated: false
      }
    };

    onAddComplaint(newComplaint);
    setSubmittedComplaint(newComplaint);

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const downloadReceiptPdf = (complaint: Complaint) => {
    const doc = new jsPDF();

    // Header Government
    doc.setFillColor(198, 40, 40); // #C62828
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PEMERINTAH KABUPATEN BOLAANG MONGONDOW SELATAN', 105, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('INSPEKTORAT DAERAH - WHISTLEBLOWER SYSTEM (WBS)', 105, 18, { align: 'center' });

    // Document Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BUKTI REGISTRASI PENGADUAN WBS', 105, 38, { align: 'center' });

    // Ticket Box
    doc.setDrawColor(198, 40, 40);
    doc.setLineWidth(0.5);
    doc.rect(15, 45, 180, 25);
    doc.setFontSize(12);
    doc.setTextColor(198, 40, 40);
    doc.text(`KODE TIKET: ${complaint.ticketCode}`, 20, 56);
    doc.text(`PIN RAHASIA: ${complaint.secretPin}`, 130, 56);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Simpan kode tiket & PIN ini dengan aman untuk mengecek status tindak lanjut.', 20, 64);

    // Table details
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    let y = 80;

    const addRow = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value.length > 55 ? value.substring(0, 55) + '...' : value, 70, y);
      y += 8;
    };

    addRow('Tanggal Melapor', complaint.createdAt);
    addRow('Kategori Pelanggaran', complaint.category);
    addRow('Status Pelapor', complaint.reporter.isAnonymous ? 'ANONIM (Identitas Terlindung)' : 'TERBUKA');
    addRow('Judul Laporan', complaint.title);
    addRow('Terlapor', `${complaint.reportedParty.name} (${complaint.reportedParty.position})`);
    addRow('Instansi / OPD', complaint.reportedParty.agency);
    addRow('Lokasi Kejadian', `${complaint.occurrence.village}, ${complaint.occurrence.district}`);
    addRow('Jumlah Lampiran', `${complaint.attachments.length} Berkas (Terenkripsi)`);

    // Footer Stamp Note
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y + 10, 195, y + 10);

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Dokumen ini dihasilkan secara otomatis oleh Whistleblower System Inspektorat Kabupaten Bolaang Mongondow Selatan.', 20, y + 18);
    doc.text('Kerahasiaan data dilindungi oleh UU No. 31 Tahun 2014 tentang Perlindungan Saksi dan Korban.', 20, y + 23);

    doc.save(`Bukti_WBS_Bolsel_${complaint.ticketCode}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Title & Progress Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C62828] flex items-center justify-center font-bold">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Formulir Pengaduan Pelanggaran WBS
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspektorat Kabupaten Bolaang Mongondow Selatan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-red-50 text-[#C62828] text-xs font-bold px-3 py-1.5 rounded-full border border-red-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Kerahasiaan 100% Terjamin</span>
          </div>
        </div>

        {/* Step Numbers Indicators */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          {[
            { s: 1, label: 'Identitas' },
            { s: 2, label: 'Terlapor' },
            { s: 3, label: 'Kategori' },
            { s: 4, label: 'Kronologi' },
            { s: 5, label: 'Lokasi' },
            { s: 6, label: 'Upload' },
            { s: 7, label: 'Kirim' },
          ].map((item) => {
            const isCompleted = item.s < currentStep;
            const isCurrent = item.s === currentStep;

            return (
              <button
                key={item.s}
                onClick={() => {
                  if (item.s < currentStep) {
                    setStepError('');
                    setCurrentStep(item.s);
                  } else if (item.s > currentStep) {
                    if (validateStep(currentStep)) {
                      setCurrentStep(item.s);
                    }
                  }
                }}
                className={`flex flex-col items-center gap-1 group transition-all ${
                  isCurrent
                    ? 'text-[#C62828] font-bold'
                    : isCompleted
                    ? 'text-emerald-600 font-semibold cursor-pointer'
                    : 'text-slate-400 font-medium cursor-pointer hover:text-slate-600'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                    isCurrent
                      ? 'bg-[#C62828] text-white ring-4 ring-red-100 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : item.s}
                </div>
                <span className="hidden sm:inline text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#C62828] h-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          ></div>
        </div>

      </div>


      {/* FORM BODY */}
      <form onSubmit={handleSubmitReport} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 space-y-8">
        
        {/* STEP 1: IDENTITAS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-[#C62828] text-xs flex items-center justify-center font-bold">1</span>
                Pilih Jenis Identitas Pelapor
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Anda dapat memilih untuk melapor secara anonim tanpa membuka data diri sama sekali.
              </p>
            </div>

            {/* Radio Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setIsAnonymous(true)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  isAnonymous
                    ? 'border-[#C62828] bg-red-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`p-3 rounded-xl ${isAnonymous ? 'bg-[#C62828] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <UserX className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pelapor Anonim (Disarankan)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Seluruh identitas diri disembunyikan total. Anda akan menerima Kode Tiket & PIN rahasia untuk melacak pengaduan.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setIsAnonymous(false)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  !isAnonymous
                    ? 'border-[#C62828] bg-red-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`p-3 rounded-xl ${!isAnonymous ? 'bg-[#C62828] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Identitas Terbuka</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mengisi data pribadi untuk mempermudah klarifikasi tim Inspektorat. Dilindungi UU Perlindungan Saksi.
                  </p>
                </div>
              </div>
            </div>

            {/* Conditional Form Inputs if Terbuka */}
            {!isAnonymous ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 pt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap Pelapor *
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Contoh: Ahmad Podomi"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NIK (Nomor Induk Kependudukan) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={reporterNik}
                    onChange={(e) => setReporterNik(e.target.value)}
                    placeholder="16 digit angka NIK"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor Telepon / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    value={reporterAddress}
                    onChange={(e) => setReporterAddress(e.target.value)}
                    placeholder="Desa/Kecamatan/Kabupaten"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Mode Anonim Aktif:</strong> Tidak ada data nama, NIK, email, atau HP yang disimpan dalam sistem. Identitas Anda aman 100%.
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: DATA TERLAPOR */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-[#C62828] text-xs flex items-center justify-center font-bold">2</span>
                Data Terlapor (Pihak Yang Dilaporkan)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Isi data oknum pejabat, ASN, atau unit kerja yang diduga melakukan pelanggaran.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Terlapor / Inisial *
                </label>
                <input
                  type="text"
                  required
                  value={reportedName}
                  onChange={(e) => setReportedName(e.target.value)}
                  placeholder="Contoh: Oknum Kasi SM / Ahmad (Inisial)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jabatan Terlapor *
                </label>
                <input
                  type="text"
                  required
                  value={reportedPosition}
                  onChange={(e) => setReportedPosition(e.target.value)}
                  placeholder="Contoh: Kepala Seksi / Pejabat Pembuat Komitmen"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instansi / Perangkat Daerah (OPD) Kab. Bolsel *
                </label>
                <select
                  value={reportedAgency}
                  onChange={(e) => setReportedAgency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none bg-white font-medium"
                >
                  {INITIAL_AGENCIES.map((opd) => (
                    <option key={opd.id} value={opd.name}>
                      {opd.name} ({opd.acronym})
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya (Isi Sendiri)</option>
                </select>

                {reportedAgency === 'Lainnya' && (
                  <div className="mt-2.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-[#C62828] uppercase tracking-wider mb-1">
                      Nama Instansi / Perangkat Daerah Lainnya *
                    </label>
                    <input
                      type="text"
                      required
                      value={customAgency}
                      onChange={(e) => setCustomAgency(e.target.value)}
                      placeholder="Ketik nama instansi / OPD jika tidak ada dalam daftar..."
                      className="w-full px-4 py-2.5 rounded-xl border border-red-300 focus:border-[#C62828] text-sm focus:ring-2 focus:ring-[#C62828] outline-none bg-red-50/30 font-medium text-slate-900"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Unit Kerja / Bidang
                </label>
                <input
                  type="text"
                  value={reportedUnit}
                  onChange={(e) => setReportedUnit(e.target.value)}
                  placeholder="Contoh: Bidang Bina Marga / Sekretariat"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lokasi Tempat Kerja
                </label>
                <input
                  type="text"
                  value={reportedLocation}
                  onChange={(e) => setReportedLocation(e.target.value)}
                  placeholder="Contoh: Kompleks Perkantoran Panango"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: JENIS PELANGGARAN */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-[#C62828] text-xs flex items-center justify-center font-bold">3</span>
                Pilih Kategori Jenis Pelanggaran
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pilih salah satu dari 10 kategori klasifikasi tindak penyimpangan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Korupsi', 'Gratifikasi', 'Suap', 'Penyalahgunaan Wewenang', 'Konflik Kepentingan',
                'Pungutan Liar', 'Pelanggaran Disiplin ASN', 'Penyimpangan Pengadaan', 'Penyalahgunaan Aset Daerah', 'Lainnya'
              ].map((catName) => {
                const isSelected = category === catName;
                return (
                  <div
                    key={catName}
                    onClick={() => setCategory(catName as ViolationCategory)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#C62828] bg-red-50/60 font-bold text-[#C62828]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-sm">{catName}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#C62828]" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: KRONOLOGI KEJADIAN */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-[#C62828] text-xs flex items-center justify-center font-bold">4</span>
                  Kronologi Pelaporan Kejadian
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Uraikan perbuatan dugaan pelanggaran secara jelas minimal 300 karakter.
                </p>
              </div>

              <button
                type="button"
                onClick={formatChronologyAI}
                disabled={aiFormatting || !chronology}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:opacity-95 disabled:opacity-40 transition-all self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{aiFormatting ? 'Memformat...' : 'Auto Format (5W+2H)'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Ringkas Pengaduan *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Dugaan Pungutan Liar Pengurusan Sertifikat di Dinas PUPR"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Uraian Kronologi Detail *
                  </label>
                  <span className={`text-xs font-mono font-bold ${chronology.length < 300 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {chronology.length} / 300 Karakter Minimal
                  </span>
                </div>
                <textarea
                  required
                  rows={8}
                  value={chronology}
                  onChange={(e) => setChronology(e.target.value)}
                  placeholder="Jelaskan secara runtut: Apa yang terjadi, siapa saja yang terlibat, berapa nominal (jika ada), kapan kejadian, bagaimana modus operandi, serta bukti pendukung yang Anda miliki..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none leading-relaxed font-sans"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: LOKASI & WAKTU KEJADIAN */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-[#C62828] text-xs flex items-center justify-center font-bold">5</span>
                Waktu & Lokasi Kejadian (Kab. Bolsel)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tentukan lokasi pasti di wilayah Kabupaten Bolaang Mongondow Selatan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanggal Kejadian *
                </label>
                <input
                  type="date"
                  required
                  value={occurrenceDate}
                  onChange={(e) => setOccurrenceDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jam Kejadian (WITA)
                </label>
                <input
                  type="text"
                  value={occurrenceTime}
                  onChange={(e) => setOccurrenceTime(e.target.value)}
                  placeholder="Contoh: 10:30 WITA"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kecamatan di Kab. Bolsel *
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    const found = BOLSEL_DISTRICTS.find(d => d.name === e.target.value);
                    if (found && found.villages.length > 0) {
                      setSelectedVillage(found.villages[0]);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none bg-white font-medium"
                >
                  {BOLSEL_DISTRICTS.map((dist) => (
                    <option key={dist.name} value={dist.name}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Desa / Kelurahan *
                </label>
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none bg-white font-medium"
                >
                  {currentDistObj.villages.map((v) => (
                    <option key={v} value={v}>
                      Desa {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detail Alamat / Nama Gedung / Ruangan
                </label>
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="Contoh: Ruang Pelayanan Publik Gedung B Perkantoran Panango"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>
            </div>

            {/* Simulated Interactive Coordinate Map Picker */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="font-bold">Koordinat Peta Lokasi Kejadian (Google Maps GPS)</span>
                </div>
                <span className="text-slate-400 font-mono">
                  {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
                </span>
              </div>
              <div className="w-full h-32 bg-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-700">
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                <div className="z-10 text-center space-y-1">
                  <MapPin className="w-8 h-8 text-red-500 animate-bounce mx-auto" />
                  <p className="text-xs font-bold text-white">
                    {selectedVillage}, {selectedDistrict}
                  </p>
                  <p className="text-[10px] text-slate-400">Kabupaten Bolaang Mongondow Selatan</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 6: UPLOAD BUKTI */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-[#C62828] text-xs flex items-center justify-center font-bold">6</span>
                Unggah Berkas Bukti Pendukung
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Dukung laporan Anda dengan foto, rekaman audio, video, dokumen PDF, Excel, atau ZIP. (Maks 100 MB).
              </p>
            </div>

            {/* Drag and Drop Container */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) {
                  const filesArray = Array.from(e.dataTransfer.files) as File[];
                  filesArray.forEach(file => {
                    setUploadedFiles(prev => [...prev, {
                      id: `att-${Date.now()}-${Math.random()}`,
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      url: '#',
                      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
                      isEncrypted: true
                    }]);
                  });
                }
              }}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                isDragging ? 'border-[#C62828] bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
              }`}
            >
              <UploadCloud className="w-12 h-12 text-[#C62828] mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">
                Tarik & Lepaskan berkas bukti di sini, atau <label className="text-[#C62828] underline cursor-pointer">Pilih Berkas<input type="file" multiple onChange={handleFileUpload} className="hidden" /></label>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Format yang didukung: PDF, JPG, PNG, MP4, DOCX, XLSX, ZIP (Maksimal 100 MB per pengiriman)
              </p>
            </div>

            {/* Uploaded File List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Berkas Terunggah ({uploadedFiles.length})
                </h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-red-50 text-[#C62828]">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{file.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                              <Lock className="w-3 h-3" /> Enkripsi AES-256
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: PERSETUJUAN & KIRIM */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-[#C62828] text-xs flex items-center justify-center font-bold">7</span>
                Persetujuan & Pengiriman Laporan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Periksa kembali data pengaduan Anda sebelum memproses pengiriman resmi.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">Judul Laporan:</span>
                <span className="font-semibold text-right">{title || 'Dugaan Pelanggaran'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">Kategori:</span>
                <span className="font-semibold text-red-600">{category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">Status Identitas:</span>
                <span className="font-semibold">{isAnonymous ? 'ANONIM (Rahasia 100%)' : reporterName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">Terlapor & Instansi:</span>
                <span className="font-semibold">{reportedName} ({reportedAgency === 'Lainnya' ? (customAgency || 'Lainnya') : reportedAgency})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-900">Jumlah Lampiran:</span>
                <span className="font-semibold">{uploadedFiles.length} Berkas</span>
              </div>
            </div>

            {/* Declaration Terms */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#C62828] rounded focus:ring-[#C62828]"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  <strong>Pernyataan Integritas:</strong> Saya menyatakan bahwa data dan informasi yang saya sampaikan dalam pengaduan ini adalah benar adanya sesuai pengetahuan saya, serta diisi tanpa maksud fitnah atau pencemaran nama baik yang tidak berdasar.
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={captchaVerified}
                  onChange={(e) => setCaptchaVerified(e.target.checked)}
                  className="w-4 h-4 text-[#C62828] rounded focus:ring-[#C62828]"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Saya bukan robot (Verifikasi Keamanan Captcha System WBS)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP ERROR ALERT BANNER */}
        {stepError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#C62828] text-xs font-bold flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-[#C62828] shrink-0" />
            <span className="flex-1">{stepError}</span>
          </div>
        )}

        {/* CONTROLS & NAVIGATION BUTTONS */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => {
                setStepError('');
                setCurrentStep(prev => prev - 1);
              }}
              className="px-6 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          ) : <div></div>}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => {
                if (validateStep(currentStep)) {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              className="px-8 py-3.5 rounded-2xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!agreedTerms || !captchaVerified}
              className="px-8 py-3.5 rounded-2xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>KIRIM LAPORAN SEKARANG</span>
            </button>
          )}
        </div>

      </form>

      {/* SUCCESS MODAL POPUP */}
      {submittedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-center shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pengaduan Berhasil Terdaftar!
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                Terima Kasih Atas Laporan Anda
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Laporan Anda telah masuk ke sistem Inspektorat Kabupaten Bolaang Mongondow Selatan.
              </p>
            </div>

            {/* Ticket Code Box */}
            <div className="p-5 rounded-2xl bg-red-50 border-2 border-dashed border-[#C62828] space-y-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  KODE UNIK TIKET PELAPORAN
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-2xl font-black text-[#C62828] font-mono tracking-wider">
                    {submittedComplaint.ticketCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(submittedComplaint.ticketCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    title="Salin Kode"
                    className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-[#C62828] shadow-xs"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-red-200 flex justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">PIN RAHASIA</span>
                  <span className="font-mono font-bold text-slate-900 text-base">{submittedComplaint.secretPin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">STATUS</span>
                  <span className="font-bold text-[#C62828]">Dalam Verifikasi</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic leading-relaxed">
              Catat atau unduh bukti registrasi ini. Kode tiket & PIN rahasia digunakan untuk mengecek status tindak lanjut pengaduan Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => downloadReceiptPdf(submittedComplaint)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Unduh Bukti PDF</span>
              </button>

              <button
                onClick={() => {
                  if (setSelectedTicketForTracking) {
                    setSelectedTicketForTracking(submittedComplaint.ticketCode);
                  }
                  setActiveTab('tracking');
                }}
                className="w-full py-3 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Eye className="w-4 h-4" />
                <span>Cek Status Sekarang</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
