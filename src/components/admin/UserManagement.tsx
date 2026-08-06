import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Shield, KeyRound, Mail, CheckCircle2, XCircle, Trash2, Edit, Eye, EyeOff, Lock
} from 'lucide-react';
import { User, Role } from '../../types/wbs';
import { INITIAL_USERS } from '../../data/mockData';
import { db, auth } from '../../lib/firebase';
import { collection, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<User[]>(INITIAL_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('admin12345');

  // Form states
  const [nipInput, setNipInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<Role>('auditor');
  const [positionInput, setPositionInput] = useState('Auditor Muda Inspektorat');
  const [passwordInput, setPasswordInput] = useState('admin12345');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync users with Firestore in real-time
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
        if (!snapshot.empty) {
          const fetched: User[] = [];
          snapshot.forEach((docSnap) => {
            fetched.push(docSnap.data() as User);
          });
          // Merge with initial users to ensure superadmin is present
          const merged = [...INITIAL_USERS];
          fetched.forEach(fUser => {
            const idx = merged.findIndex(m => m.id === fUser.id || m.nip === fUser.nip);
            if (idx >= 0) {
              merged[idx] = fUser;
            } else {
              merged.push(fUser);
            }
          });
          setUserList(merged);
        }
      }, (err) => {
        console.warn("Firestore user sync warning:", err);
      });
      return () => unsub();
    } catch (e) {
      console.warn("Firestore user listener error:", e);
    }
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nipInput.trim() || !nameInput.trim()) {
      alert('NIP dan Nama Pegawai wajib diisi!');
      return;
    }

    setLoading(true);
    const cleanNip = nipInput.trim();
    const cleanEmail = emailInput.trim() || `${cleanNip}@bolselkab.go.id`;
    const userId = `usr-${cleanNip.replace(/\s+/g, '')}`;

    const newUser: User = {
      id: userId,
      nip: cleanNip,
      name: nameInput.trim(),
      email: cleanEmail,
      role: roleInput,
      position: positionInput.trim() || 'Staff Inspektorat Daerah',
      agency: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
      phone: '0812-0000-0000',
      isActive: true,
      lastLogin: 'Belum pernah',
      password: passwordInput.trim() || 'admin12345'
    };

    try {
      // 1. Save to Firestore
      await setDoc(doc(db, 'users', userId), newUser);

      // 2. Attempt Firebase Auth registration
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, passwordInput.trim() || 'admin12345');
      } catch (authErr) {
        console.warn("Firebase Auth user creation warning (stored in Firestore):", authErr);
      }

      setUserList(prev => {
        const filtered = prev.filter(u => u.id !== userId && u.nip !== cleanNip);
        return [...filtered, newUser];
      });

      setShowAddModal(false);
      setNipInput('');
      setNameInput('');
      setEmailInput('');
      setPasswordInput('admin12345');
      alert(`User staff ${newUser.name} (${newUser.role.toUpperCase()}) berhasil ditambahkan!\nNIP Login: ${newUser.nip}\nPassword: ${newUser.password}`);
    } catch (err: any) {
      console.error("Gagal menyimpan user:", err);
      alert("Terjadi kesalahan saat menyimpan user ke Firebase: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    const deletedName = userToDelete.name;
    try {
      await deleteDoc(doc(db, 'users', userToDelete.id));
      setUserList(prev => prev.filter(u => u.id !== userToDelete.id));
      alert(`Pengguna ${deletedName} berhasil dihapus dari sistem.`);
    } catch (err) {
      console.warn("Firestore delete user error:", err);
      setUserList(prev => prev.filter(u => u.id !== userToDelete.id));
      alert(`Pengguna ${deletedName} dihapus dari sesi lokal.`);
    } finally {
      setUserToDelete(null);
    }
  };

  const toggleStatus = async (userObj: User) => {
    const updated = { ...userObj, isActive: !userObj.isActive };
    setUserList(prev => prev.map(u => u.id === userObj.id ? updated : u));
    try {
      await setDoc(doc(db, 'users', userObj.id), updated);
    } catch (e) {
      console.warn("Firestore update status error:", e);
    }
  };

  const handleSaveResetPassword = async () => {
    if (!resettingUser) return;
    const updated = { ...resettingUser, password: newResetPassword.trim() || 'admin12345' };
    setUserList(prev => prev.map(u => u.id === resettingUser.id ? updated : u));
    try {
      await setDoc(doc(db, 'users', resettingUser.id), updated);
      alert(`Password untuk user ${resettingUser.name} berhasil diperbarui menjadi: ${updated.password}`);
    } catch (e) {
      console.warn("Reset password error:", e);
      alert(`Password diperbarui secara lokal: ${updated.password}`);
    } finally {
      setResettingUser(null);
      setNewResetPassword('admin12345');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#C62828]" />
            <span>Manajemen Pengguna & Pengaturan Hak Akses (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data akun staff Inspektorat (Superadmin, Operator, Inspektur, Auditor) lengkap dengan NIP & Password login.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Staff Baru</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="p-4">Nama & NIP Pegawai</th>
                <th className="p-4">Email / Login</th>
                <th className="p-4">Peran (Role)</th>
                <th className="p-4">Jabatan</th>
                <th className="p-4">Password Login</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{u.name}</p>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      NIP: {u.nip}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-slate-700">{u.email}</td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      u.role === 'admin' ? 'bg-red-100 text-[#C62828]' :
                      u.role === 'inspektur' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'auditor' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role === 'admin' ? 'Superadmin' : u.role}
                    </span>
                  </td>

                  <td className="p-4 text-slate-700">{u.position}</td>

                  <td className="p-4 font-mono">
                    <span className="bg-amber-50 border border-amber-200 text-amber-900 font-bold px-2 py-1 rounded-md text-[11px] inline-block">
                      {u.password || (u.role === 'admin' ? 'superadmin1A' : 'admin12345')}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                        u.isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {u.isActive ? 'Aktif' : 'Non-Aktif'}
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setResettingUser(u);
                          setNewResetPassword(u.password || 'admin12345');
                        }}
                        className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Ubah / Reset Password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>

                      {u.nip !== '199111122022031003' && (
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-bold transition-colors cursor-pointer"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#C62828]" />
                <span>Tambah Staff / Admin Baru</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP Pegawai (Login ID)</label>
                <input
                  type="text"
                  required
                  value={nipInput}
                  onChange={(e) => setNipInput(e.target.value)}
                  placeholder="Contoh: 199001012020011001"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-[#C62828] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Contoh: Rahmat Podomi, S.STP"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#C62828] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Resmi (Optional)</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Biarkan kosong untuk auto-generate dari NIP"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#C62828] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role (Peran Hak Akses Modul)</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as Role)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-[#C62828] focus:outline-none"
                >
                  <option value="admin">Administrator / Superadmin</option>
                  <option value="operator">Operator WBS (Validasi Laporan)</option>
                  <option value="inspektur">Inspektur Daerah (Disposisi)</option>
                  <option value="auditor">Auditor Tim (Investigasi)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan Struktur / Tim</label>
                <input
                  type="text"
                  required
                  value={positionInput}
                  onChange={(e) => setPositionInput(e.target.value)}
                  placeholder="Contoh: Auditor Muda / Operator Pengaduan"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#C62828] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password Login</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-[#C62828] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-scaleIn">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mx-auto">
              <KeyRound className="w-5 h-5" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Ubah Password Akun</h3>
              <p className="text-xs text-slate-500 mt-1">
                Atur password baru untuk <strong>{resettingUser.name}</strong> (NIP: {resettingUser.nip})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password Baru</label>
                <input
                  type="text"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-center font-bold"
                  placeholder="admin12345"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveResetPassword}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Simpan Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-center animate-scaleIn">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Pengguna</h3>
              <p className="text-xs text-slate-500 mt-2">
                Apakah Anda yakin ingin menghapus akun pegawai <strong className="text-slate-800">{userToDelete.name}</strong> (NIP: {userToDelete.nip})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

