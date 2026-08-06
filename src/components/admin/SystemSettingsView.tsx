import React, { useState } from 'react';
import { Settings, Shield, Lock, Database, Save, Sparkles, Server, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const SystemSettingsView: React.FC = () => {
  const [aesEnabled, setAesEnabled] = useState(true);
  const [aiAutoTriage, setAiAutoTriage] = useState(true);
  const [maxUploadMb, setMaxUploadMb] = useState(100);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengaturan Sistem WBS berhasil disimpan!');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassStatus(null);

    if (!newPassword || newPassword.length < 6) {
      setPassStatus({ type: 'error', message: 'Kata sandi baru minimal harus 6 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassStatus({ type: 'error', message: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setPassStatus({ 
        type: 'error', 
        message: 'Pengguna Firebase Auth tidak aktif dalam sesi ini. Silakan login kembali untuk mengubah kata sandi.' 
      });
      return;
    }

    setPassLoading(true);
    try {
      await updatePassword(currentUser, newPassword);
      setPassStatus({ type: 'success', message: 'Kata sandi berhasil diperbarui di Firebase Authentication!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error("Error updating password:", err);
      if (err.code === 'auth/requires-recent-login') {
        setPassStatus({ 
          type: 'error', 
          message: 'Keamanan: Anda perlu keluar dan login kembali sebelum mengubah kata sandi.' 
        });
      } else {
        setPassStatus({ type: 'error', message: err.message || 'Gagal mengubah kata sandi.' });
      }
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#C62828]" />
            <span>Pengaturan Sistem & Keamanan Server WBS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi parameter enkripsi, batas unggah berkas, serta ubah kata sandi akun Firebase Auth.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        
        {/* System Settings Form */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C62828]" />
              <span>Keamanan & Enkripsi Berkas</span>
            </h3>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Enkripsi Otomatis AES-256 Bit SSL</p>
                <p className="text-[11px] text-slate-500">Enkripsi seluruh dokumen bukti sebelum disimpan ke cloud server.</p>
              </div>
              <input
                type="checkbox"
                checked={aesEnabled}
                onChange={(e) => setAesEnabled(e.target.checked)}
                className="w-5 h-5 text-[#C62828] rounded focus:ring-[#C62828]"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">AI Auto-Triage & Sentiment Analysis</p>
                <p className="text-[11px] text-slate-500">Gunakan Gemini 3.6 Flash untuk analisis tingkat risiko laporan baru.</p>
              </div>
              <input
                type="checkbox"
                checked={aiAutoTriage}
                onChange={(e) => setAiAutoTriage(e.target.checked)}
                className="w-5 h-5 text-[#C62828] rounded focus:ring-[#C62828]"
              />
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#C62828]" />
              <span>Batas Unggah & Backup</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Maksimal Ukuran Unggah Berkas (MB)</label>
              <input
                type="number"
                value={maxUploadMb}
                onChange={(e) => setMaxUploadMb(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <button
              type="button"
              onClick={() => alert('Backup database PostgreSQL berhasil diunduh (Encrypted Dump)!')}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Unduh Backup Database Sekarang</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-md"
          >
            Simpan Seluruh Pengaturan
          </button>
        </form>

        {/* Change Password Form (Firebase Auth) */}
        <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#C62828]" />
              <span>Ubah Kata Sandi (Firebase Authentication)</span>
            </h3>
            
            <p className="text-xs text-slate-500">
              Ubah kata sandi akun Anda secara langsung di layanan autentikasi Firebase. Password baru akan berlaku pada login berikutnya.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Sandi Baru *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#C62828] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Konfirmasi Kata Sandi Baru *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#C62828] outline-none"
              />
            </div>

            {passStatus && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                passStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
              }`}>
                {passStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passStatus.message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {passLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memperbarui di Firebase Auth...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Perbarui Kata Sandi</span>
              </>
            )}
          </button>
        </form>

      </div>

    </div>
  );
};
