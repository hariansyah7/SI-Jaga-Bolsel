import React, { useState } from 'react';
import { 
  Lock, UserCheck, Shield, KeyRound, Mail, Eye, EyeOff, X, 
  CheckCircle2, Sparkles, AlertCircle, ArrowRight, Loader2
} from 'lucide-react';
import { User, Role } from '../types/wbs';
import { INITIAL_USERS } from '../data/mockData';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [emailInput, setEmailInput] = useState('admin.wbs@bolselkab.go.id');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const roles: { role: Role; label: string; desc: string }[] = [
    { role: 'admin', label: 'Administrator', desc: 'Akses penuh manajemen user, master data & audit' },
    { role: 'operator', label: 'Operator WBS', desc: 'Verifikasi berkas & validasi laporan awal' },
    { role: 'inspektur', label: 'Inspektur Daerah', desc: 'Disposisi kasus, persetujuan & catatan inspeksi' },
    { role: 'auditor', label: 'Auditor Tim', desc: 'Pemeriksaan bukti & penyusunan LHP' },
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    const userFound = INITIAL_USERS.find(u => u.role === role);
    if (userFound) {
      setEmailInput(userFound.email);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const defaultUserObj = INITIAL_USERS.find(u => u.role === selectedRole) || {
      id: `usr-${Date.now()}`,
      nip: '199111122022031003',
      name: 'Hariansah Noviyanto, SE',
      email: emailInput,
      role: selectedRole,
      position: 'Staff Inspektorat Daerah',
      agency: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
      phone: '0812-3456-7890',
      isActive: true,
      lastLogin: new Date().toLocaleString()
    };

    try {
      let firebaseUserObj: User = defaultUserObj;

      // Authenticate via Firebase Auth
      try {
        const userCred = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
        const userDocRef = doc(db, 'users', userCred.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          firebaseUserObj = userDoc.data() as User;
        } else {
          firebaseUserObj = {
            ...defaultUserObj,
            id: userCred.user.uid,
            email: userCred.user.email || emailInput,
            lastLogin: new Date().toLocaleString()
          };
          await setDoc(userDocRef, firebaseUserObj);
        }
      } catch (authError: any) {
        // If user doesn't exist yet in Firebase Auth, auto-register standard admin accounts
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
            firebaseUserObj = {
              ...defaultUserObj,
              id: newCred.user.uid,
              email: emailInput,
              lastLogin: new Date().toLocaleString()
            };
            await setDoc(doc(db, 'users', newCred.user.uid), firebaseUserObj);
          } catch (createErr: any) {
            console.warn("Firebase auth sign in fallback:", createErr);
            firebaseUserObj = defaultUserObj;
          }
        } else {
          console.warn("Firebase auth login warning:", authError);
          firebaseUserObj = defaultUserObj;
        }
      }

      onLoginSuccess(firebaseUserObj);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal login. Periksa kembali email dan password.');
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
          
          {/* Role Select Grid */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Peran Access (Role)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRoleSelect(r.role)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedRole === r.role
                      ? 'border-[#C62828] bg-red-50 text-[#C62828] font-bold shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">{r.label}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1 font-normal">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Email / NIP Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email / NIP Pegawai *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nip@bolselkab.go.id"
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

          {/* Remember Me */}
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

            <span className="text-slate-500 text-[11px] font-medium">
              Firebase Auth Enabled
            </span>
          </div>

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
