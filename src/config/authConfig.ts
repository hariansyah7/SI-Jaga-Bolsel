// =========================================================================
// KONTROL KREDENSIAL DAN KATA SANDI ADMIN (SIMPLE AUTH CONFIG)
// =========================================================================
// Halaman/file ini berfungsi sebagai pusat pengaturan Akun Admin Sederhana.
//
// CARA MENGGANTI USERNAME / NIP / EMAIL DAN PASSWORD ADMIN:
// 
// 1. BARIS 22: Ubah 'ADMIN_NIP' jika ingin mengganti NIP admin.
// 2. BARIS 23: Ubah 'ADMIN_EMAIL' jika ingin mengganti Email admin.
// 3. BARIS 24: Ubah 'ADMIN_NAME' jika ingin mengganti Nama Lengkap admin.
// 4. BARIS 25: Ubah 'ADMIN_PASSWORD' jika ingin mengganti Kata Sandi (Password).
// =========================================================================

import { User } from '../types/wbs';

// -------------------------------------------------------------------------
// BARIS 20-25: ATUR KREDENSIAL UTAMA ADMIN DI SINI
// -------------------------------------------------------------------------
export const ADMIN_CONFIG = {
  nip: import.meta.env.VITE_ADMIN_NIP || '199111122022031003',                  // NIP Admin
  email: import.meta.env.VITE_ADMIN_EMAIL || 'hariansyah25@gmail.com',          // Email Admin
  name: import.meta.env.VITE_ADMIN_NAME || 'Hariansah Noviyanto, SE',           // Nama Admin
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'superadmin1A',               // Password Admin
  role: 'admin' as const,
  position: import.meta.env.VITE_ADMIN_POSITION || 'Pranata Komputer Ahli Muda / System Admin WBS',
  agency: import.meta.env.VITE_ADMIN_AGENCY || 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
  phone: import.meta.env.VITE_ADMIN_PHONE || '082190877680'
};

// Key penyimpanan di LocalStorage browser
const STORAGE_KEY_PASS = 'wbs_admin_hashed_pass';
const STORAGE_KEY_CONFIG = 'wbs_admin_custom_profile';

/**
 * Fungsi Hashing Sederhana (Base64 + Salt Obfuscation)
 * Mencegah kata sandi tersimpan sebagai teks biasa di Inspect Element / LocalStorage.
 */
export const hashPassword = (plainText: string): string => {
  if (!plainText) return '';
  const salt = 'WBS_BOLSEL_SECURE_SALT_2026';
  const combined = `${salt}_${plainText.trim()}_${salt}`;
  try {
    return btoa(unescape(encodeURIComponent(combined)));
  } catch (e) {
    return btoa(plainText);
  }
};

/**
 * Mendapatkan Password Hash Aktif (dari LocalStorage jika ada, atau dari ADMIN_CONFIG)
 */
export const getActiveAdminPasswordHash = (): string => {
  const savedHash = localStorage.getItem(STORAGE_KEY_PASS);
  if (savedHash) {
    return savedHash;
  }
  // Default hash dari ADMIN_CONFIG.password
  const defaultHash = hashPassword(ADMIN_CONFIG.password);
  // Simpan ke localStorage secara otomatis
  localStorage.setItem(STORAGE_KEY_PASS, defaultHash);
  return defaultHash;
};

/**
 * Memperbarui Password Admin Baru di LocalStorage
 */
export const updateAdminPassword = (newPlainTextPassword: string): void => {
  const newHash = hashPassword(newPlainTextPassword);
  localStorage.setItem(STORAGE_KEY_PASS, newHash);
};

/**
 * Verifikasi Kredensial Login
 */
export const verifyCredentials = (inputIdentifier: string, inputPassword: string): boolean => {
  const cleanId = inputIdentifier.trim().toLowerCase();
  const cleanPass = inputPassword.trim();

  // Validasi Username / NIP / Email
  const matchNip = cleanId === ADMIN_CONFIG.nip.toLowerCase();
  const matchEmail = cleanId === ADMIN_CONFIG.email.toLowerCase();
  const matchCanonical = cleanId === 'admin.wbs@bolselkab.go.id';

  const isIdentifierValid = matchNip || matchEmail || matchCanonical;
  if (!isIdentifierValid) return false;

  // Validasi Password Hash di LocalStorage
  const activeHash = getActiveAdminPasswordHash();
  const inputHash = hashPassword(cleanPass);

  // Cocokkan input hash dengan active hash, ATAU cocokkan dengan fallback password bawaan jika pengguna mengetiknya langsung
  const isPassValid = (inputHash === activeHash) || (cleanPass === ADMIN_CONFIG.password);

  return isPassValid;
};

/**
 * Mendapatkan Profil Lengkap Admin
 */
export const getAdminProfile = (): User => {
  const savedProfile = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (savedProfile) {
    try {
      return JSON.parse(savedProfile);
    } catch (e) {
      // Fallback
    }
  }

  return {
    id: 'usr-admin-bolsel',
    nip: ADMIN_CONFIG.nip,
    name: ADMIN_CONFIG.name,
    email: ADMIN_CONFIG.email,
    role: ADMIN_CONFIG.role,
    position: ADMIN_CONFIG.position,
    agency: ADMIN_CONFIG.agency,
    phone: ADMIN_CONFIG.phone,
    isActive: true,
    lastLogin: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA'
  };
};
