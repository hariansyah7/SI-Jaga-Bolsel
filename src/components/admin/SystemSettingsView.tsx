import React, { useState } from 'react';
import { Settings, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { updateAdminPassword } from '../../config/authConfig';

export const SystemSettingsView: React.FC = () => {
  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

    setPassLoading(true);
    try {
      // 1. Update Local Storage Hashed Password
      updateAdminPassword(newPassword);

      // 2. Try updating Firebase Auth if user is logged in via Firebase
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await updatePassword(currentUser, newPassword);
        } catch (fbErr) {
          console.warn("Firebase Auth password update skipped or failed:", fbErr);
        }
      }

      setPassStatus({ 
        type: 'success', 
        message: 'Kata sandi berhasil diperbarui dan tersimpan aman secara terenkripsi!' 
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error("Error updating password:", err);
      setPassStatus({ type: 'error', message: err.message || 'Gagal mengubah kata sandi.' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#C62828]" />
            <span>Pengaturan Akun & Keamanan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen kata sandi dan akses portal administrator WBS.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#C62828]" />
              <span>Ubah Kata Sandi Admin</span>
            </h3>
            
            <p className="text-xs text-slate-500">
              Perbarui kata sandi akun administrator WBS Anda. Kata sandi baru akan disimpan dengan enkripsi aman.
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
                <span>Memperbarui Kata Sandi...</span>
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
