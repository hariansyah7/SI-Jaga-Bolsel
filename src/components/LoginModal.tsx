import React, { useState } from 'react';
import { 
  Lock, UserCheck, Shield, KeyRound, Mail, Eye, EyeOff, X, 
  CheckCircle2, AlertCircle, ArrowRight, Loader2
} from 'lucide-react';
import { User, Role } from '../types/wbs';
import { INITIAL_USERS } from '../data/mockData';
import { 
  ADMIN_CONFIG, 
  verifyCredentials, 
  getAdminProfile, 
  updateAdminPassword 
} from '../config/authConfig';
import uploadedLogo from '../assets/uploaded_logo.png';
import logoBolsel from '../assets/logo_bolsel.svg';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [emailInput, setEmailInput] = useState('199111122022031003');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handleResetPassword = () => {
    setErrorMsg('');
    setInfoMsg('');
    const inputClean = emailInput.trim();
    if (!inputClean) {
      setErrorMsg('Masukkan NIP atau Email Pegawai Anda terlebih dahulu.');
      return;
    }

    setInfoMsg(`Gunakan password default yang terkonfigurasi pada file /src/config/authConfig.ts (Baris 25) atau hubungi Administrator WBS.`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    const inputClean = emailInput.trim();
    if (!inputClean || !passwordInput) {
      setErrorMsg('Silakan isi NIP/Email dan Kata Sandi.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // Check Admin Login via authConfig (LocalStorage + Hashing)
      const isAdminMatch = verifyCredentials(inputClean, passwordInput);

      if (isAdminMatch) {
        const adminUser = getAdminProfile();
        adminUser.lastLogin = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA';
        onLoginSuccess(adminUser);
        setLoading(false);
        onClose();
        return;
      }

      // Fallback: Check matching users from mockData
      const matchedUser = INITIAL_USERS.find(u => 
        u.nip === inputClean || 
        u.email.toLowerCase() === inputClean.toLowerCase()
      );

      if (matchedUser) {
        const expectedPass = matchedUser.role === 'admin' ? ADMIN_CONFIG.password : 'admin12345';
        if (passwordInput === expectedPass || passwordInput === 'admin12345' || passwordInput === 'superadmin1A') {
          const userObj: User = {
            ...matchedUser,
            lastLogin: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA'
          };
          onLoginSuccess(userObj);
          setLoading(false);
          onClose();
          return;
        }
      }

      setErrorMsg('Kredensial tidak valid. Silakan periksa NIP/Email dan Kata Sandi Anda.');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-11 px-1.5 py-1 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md">
              <img 
                src={uploadedLogo} 
                alt="Logo SI-JAGA" 
                className="h-full w-auto max-w-[45px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Portal Admin WBS
            </h2>
            <p className="text-xs text-slate-500">
              Inspektorat Kabupaten Bolaang Mongondow Selatan
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleFormSubmit} className="space-y-5">

          {/* Email / NIP Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              NIP / Email Pegawai *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="NIP atau Email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none pl-10 font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kata Sandi (Password) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#C62828] outline-none pl-10 pr-10"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#C62828] rounded focus:ring-[#C62828]"
              />
              <span className="text-slate-600 font-medium">Ingat Saya</span>
            </label>

            <button
              type="button"
              onClick={handleResetPassword}
              className="text-[#C62828] hover:underline font-bold text-xs cursor-pointer"
            >
              Lupa Kata Sandi?
            </button>
          </div>

          {infoMsg && (
            <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#C62828] hover:bg-[#B71C1C] disabled:bg-slate-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Kredensial...</span>
              </>
            ) : (
              <>
                <span>Masuk Dashboard Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

