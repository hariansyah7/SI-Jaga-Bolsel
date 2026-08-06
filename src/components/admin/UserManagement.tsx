import React, { useState } from 'react';
import { 
  Users, UserPlus, Shield, KeyRound, Mail, CheckCircle2, XCircle, Trash2, Edit 
} from 'lucide-react';
import { User, Role } from '../../types/wbs';
import { INITIAL_USERS } from '../../data/mockData';

export const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<User[]>(INITIAL_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form states
  const [nipInput, setNipInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<Role>('auditor');
  const [positionInput, setPositionInput] = useState('Auditor Muda Inspektorat');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      nip: nipInput,
      name: nameInput,
      email: emailInput,
      role: roleInput,
      position: positionInput,
      agency: 'Inspektorat Daerah Kab. Bolaang Mongondow Selatan',
      phone: '0812-0000-0000',
      isActive: true,
      lastLogin: 'Belum pernah'
    };

    setUserList(prev => [...prev, newUser]);
    setShowAddModal(false);
    setNipInput('');
    setNameInput('');
    setEmailInput('');
    alert('User staff berhasil ditambahkan!');
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setUserList(prev => prev.filter(u => u.id !== userToDelete.id));
    const deletedName = userToDelete.name;
    setUserToDelete(null);
    alert(`Pengguna ${deletedName} berhasil dihapus dari sistem.`);
  };

  const toggleStatus = (id: string) => {
    setUserList(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
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
            Kelola data akun staff Inspektorat (Admin, Operator, Inspektur, Auditor).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
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
                <th className="p-4">Email Instansi</th>
                <th className="p-4">Peran (Role)</th>
                <th className="p-4">Jabatan</th>
                <th className="p-4">Login Terakhir</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{u.name}</p>
                    <span className="font-mono text-[10px] text-slate-400">NIP: {u.nip}</span>
                  </td>

                  <td className="p-4 font-mono text-slate-700">{u.email}</td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      u.role === 'admin' ? 'bg-red-100 text-[#C62828]' :
                      u.role === 'inspektur' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'auditor' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 text-slate-700">{u.position}</td>

                  <td className="p-4 text-slate-400 font-mono text-[10px]">{u.lastLogin}</td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {u.isActive ? 'Aktif' : 'Non-Aktif'}
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => alert(`Password akun ${u.name} di-reset ke default.`)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                        title="Reset Password"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      </button>

                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-bold transition-colors"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Tambah Staff User Baru</h3>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP Pegawai</label>
                <input
                  type="text"
                  required
                  value={nipInput}
                  onChange={(e) => setNipInput(e.target.value)}
                  placeholder="1985xxxx xxxxx x xxx"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
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
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Resmi Bolsel</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="nama@bolselkab.go.id"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role (Peran Modul)</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as Role)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                >
                  <option value="operator">Operator WBS</option>
                  <option value="inspektur">Inspektur Daerah</option>
                  <option value="auditor">Auditor Tim</option>
                  <option value="admin">Administrator System</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan Struktur</label>
                <input
                  type="text"
                  required
                  value={positionInput}
                  onChange={(e) => setPositionInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#C62828] text-white font-bold shadow-md"
                >
                  Simpan User
                </button>
              </div>
            </form>
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
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
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
