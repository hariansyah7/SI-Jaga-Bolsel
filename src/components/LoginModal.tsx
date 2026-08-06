import React, { useState } from 'react';
import { 
  Lock, UserCheck, Shield, KeyRound, Mail, Eye, EyeOff, X, 
  CheckCircle2, Sparkles, AlertCircle, ArrowRight, Loader2, HelpCircle
} from 'lucide-react';
import { User, Role } from '../types/wbs';
import { INITIAL_USERS } from '../data/mockData';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

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

  const handleResetPassword = async () => {
    setErrorMsg('');
    setInfoMsg('');
    const inputClean = emailInput.trim();
    if (!inputClean) {
      setErrorMsg('Masukkan NIP atau Email Pegawai Anda terlebih dahulu.');
      return;
    }

    const isSuperadminInput = inputClean === '199111122022031003' || inputClean.toLowerCase() === 'admin.wbs@bolselkab.go.id' || inputClean.toLowerCase() === 'hariansyah25@gmail.com';
    const authEmail = inputClean.toLowerCase() === 'hariansyah25@gmail.com'
      ? 'hariansyah25@gmail.com'
      : (isSuperadminInput
        ? 'hariansyah25@gmail.com'
        : (inputClean.includes('@') ? inputClean.toLowerCase() : `${inputClean}@bolselkab.go.id`));

    try {
      await sendPasswordResetEmail(auth, authEmail);
      setInfoMsg(`Link reset kata sandi telah dikirim ke email: ${authEmail}. Silakan periksa kotak masuk email Anda.`);
    } catch (err: any) {
      console.warn("Password reset error:", err);
      if (err.code === 'auth/user-not-found') {
        setErrorMsg(`Email ${authEmail} belum terdaftar di Firebase Auth.`);
      } else {
        setInfoMsg(`Reset kata sandi via email diajukan untuk ${authEmail}. Silakan hubungi Superadmin atau periksa email.`);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const inputClean = emailInput.trim();
    if (!inputClean || !passwordInput) {
      setErrorMsg('Silakan isi NIP/Email dan Kata Sandi.');
      setLoading(false);
      return;
    }

    const isSuperadminInput = inputClean === '199111122022031003' || inputClean.toLowerCase() === 'admin.wbs@bolselkab.go.id' || inputClean.toLowerCase() === 'hariansyah25@gmail.com';

    // Canonical email for Firebase Auth
    const authEmail = inputClean.toLowerCase() === 'hariansyah25@gmail.com'
      ? 'hariansyah25@gmail.com'
      : (isSuperadminInput
        ? 'hariansyah25@gmail.com'
        : (inputClean.includes('@') ? inputClean.toLowerCase() : `${inputClean}@bolselkab.go.id`));

    // Profile template from INITIAL_USERS or default
    const matchedUser: User = INITIAL_USERS.find(u => 
      u.nip === inputClean || 
      u.email.toLowerCase() === authEmail.toLowerCase()
    ) || (isSuperadminInput ? INITIAL_USERS[0] : {
      id: `usr-${Date.now()}`,
      nip: inputClean.includes('@') ? '' : inputClean,
      name: 'Pegawai Inspektorat',
      email: authEmail,
      role: 'operator' as Role,
      position: 'Staf Inspektorat',
      agency: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
      phone: '-',
      isActive: true,
      lastLogin: ''
    });

    const buildProfile = (uid: string): User => ({
      ...matchedUser,
      id: uid,
      nip: isSuperadminInput ? '199111122022031003' : (matchedUser.nip || inputClean),
      email: authEmail,
      role: isSuperadminInput ? 'admin' : matchedUser.role,
      lastLogin: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA'
    });

    try {
      let loggedInUserObj: User;

      try {
        // 1. Authenticate password directly with Firebase Auth
        const userCred = await signInWithEmailAndPassword(auth, authEmail, passwordInput);
        const userDocRef = doc(db, 'users', userCred.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const fsData = userDoc.data() as User;
          if (fsData.isActive === false) {
            await auth.signOut();
            throw new Error('Akun Anda telah non-aktif. Silakan hubungi Superadmin Inspektorat.');
          }
          loggedInUserObj = {
            ...fsData,
            lastLogin: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA'
          };
          await setDoc(userDocRef, { lastLogin: loggedInUserObj.lastLogin }, { merge: true });
        } else {
          loggedInUserObj = buildProfile(userCred.user.uid);
          await setDoc(userDocRef, loggedInUserObj);
        }
      } catch (authErr: any) {
        if (authErr.message && authErr.message.includes('non-aktif')) {
          throw authErr;
        }

        // If user is not yet created in Firebase Auth, register new user securely
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, authEmail, passwordInput);
            loggedInUserObj = buildProfile(newCred.user.uid);
            await setDoc(doc(db, 'users', newCred.user.uid), loggedInUserObj);
          } catch (createErr: any) {
            if (createErr.code === 'auth/email-already-in-use') {
              throw new Error('Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
            }
            throw new Error('Gagal memverifikasi akun. Silakan periksa kembali NIP/Email dan Kata Sandi.');
          }
        } else if (authErr.code === 'auth/wrong-password') {
          throw new Error('Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
        } else {
          throw new Error('Kredensial tidak valid. Silakan periksa NIP/Email dan Kata Sandi Anda.');
        }
      }

      onLoginSuccess(loggedInUserObj);
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(err.message || 'Gagal login. Periksa kembali NIP/Email dan Kata Sandi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-11 px-1.5 py-1 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md">
              <img 
                src="/logo-bolsel.png" 
                alt="Logo Pemkab Bolsel" 
                className="h-full w-auto max-w-[45px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="h-11 px-1.5 py-1 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md">
              <img 
                src="/logo-sijaga.png" 
                alt="Logo SI-JAGA" 
                className="h-full w-auto max-w-[45px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Portal Admin Firebase
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
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
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
              className="text-[#C62828] hover:underline font-bold text-xs"
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
                <span>Memverifikasi Firebase Auth...</span>
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
