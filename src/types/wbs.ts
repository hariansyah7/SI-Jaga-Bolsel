export type Role = 'admin' | 'operator' | 'inspektur' | 'auditor' | 'pelapor';

export type ViolationCategory =
  | 'Korupsi'
  | 'Gratifikasi'
  | 'Suap'
  | 'Penyalahgunaan Wewenang'
  | 'Konflik Kepentingan'
  | 'Pungutan Liar'
  | 'Pelanggaran Disiplin ASN'
  | 'Penyimpangan Pengadaan'
  | 'Penyalahgunaan Aset Daerah'
  | 'Lainnya';

export type ComplaintStatus =
  | 'dalam_verifikasi'
  | 'terverifikasi'
  | 'disposisi'
  | 'investigasi'
  | 'selesai'
  | 'ditolak';

export interface ReporterInfo {
  isAnonymous: boolean;
  fullName?: string;
  nik?: string;
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
}

export interface ReportedParty {
  name: string;
  position: string;
  agency: string; // OPD (Organisasi Perangkat Daerah)
  unit: string;
  location: string;
}

export interface OccurrenceLocation {
  date: string;
  time: string;
  district: string; // Kecamatan
  village: string; // Desa
  addressDetails: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Attachment {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  url: string;
  uploadDate: string;
  isEncrypted: boolean;
}

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  role: Role;
  notes?: string;
}

export interface InternalComment {
  id: string;
  author: string;
  role: Role;
  text: string;
  timestamp: string;
  isInternalOnly: boolean;
}

export interface AiSummary {
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  riskScore: number;
  summary: string;
  recommendedActions: string[];
  integrityImpact?: string;
  aiGenerated: boolean;
}

export interface Complaint {
  id: string;
  ticketCode: string; // e.g. WBS-2026-000145
  secretPin: string; // PIN for access tracking
  title: string;
  category: ViolationCategory;
  chronology: string;
  reporter: ReporterInfo;
  reportedParty: ReportedParty;
  occurrence: OccurrenceLocation;
  attachments: Attachment[];
  status: ComplaintStatus;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  comments: InternalComment[];
  aiSummary?: AiSummary;
  assignedAuditor?: string;
  assignedInspector?: string;
  dispositionNotes?: string;
  inspectionReportUrl?: string; // LHP (Laporan Hasil Pemeriksaan)
  recommendationNote?: string;
}

export interface User {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: Role;
  position: string;
  agency: string;
  phone: string;
  isActive: boolean;
  avatarUrl?: string;
  lastLogin?: string;
  password?: string;
}

export interface CategoryMaster {
  id: string;
  code: string;
  name: ViolationCategory;
  description: string;
  iconName: string;
  activeCount: number;
}

export interface AgencyMaster {
  id: string;
  code: string;
  name: string;
  acronym: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'VERIFY' | 'DISPOSITION';
  target: string;
  details: string;
  ipAddress: string;
  browser: string;
}

export interface SystemStats {
  total: number;
  verifikasi: number;
  disposisi: number;
  investigasi: number;
  selesai: number;
  ditolak: number;
  byCategory: Record<string, number>;
  monthlyTrends: { month: string; total: number; selesai: number }[];
}
