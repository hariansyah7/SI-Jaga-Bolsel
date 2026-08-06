import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, Shield, Clock, User, LogOut, CheckCircle2, AlertCircle, ChevronDown, Sparkles 
} from 'lucide-react';
import { User as UserType } from '../../types/wbs';

interface AdminHeaderProps {
  currentUser: UserType;
  onLogout: () => void;
  onSearchQuery?: (q: string) => void;
  setActiveView: (view: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentUser,
  onLogout,
  onSearchQuery,
  setActiveView
}) => {
  const [witaTime, setWitaTime] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      };
      setWitaTime(new Intl.DateTimeFormat('id-ID', options).format(now) + ' WITA');
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, text: 'Laporan Baru WBS-2026-000145 memerlukan verifikasi berkas awal.', time: '10 min lalu', type: 'alert' },
    { id: 2, text: 'Disposisi laporan WBS-2026-000144 telah ditandatangani Inspektur.', time: '1 jam lalu', type: 'success' },
    { id: 3, text: 'Auditor Irwan Hasania mengunggah catatan hasil investigasi awal.', time: '3 jam lalu', type: 'info' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      
      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              if (onSearchQuery) onSearchQuery(e.target.value);
            }}
            placeholder="Cari kode tiket, nama terlapor, OPD, atau kata kunci..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C62828] outline-none bg-slate-50/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Right Header Options */}
      <div className="flex items-center gap-4">
        
        {/* WITA Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
          <Clock className="w-3.5 h-3.5 text-[#C62828]" />
          <span>{witaTime}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 relative transition-all"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900">Notifikasi Sistem WBS</h4>
                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">3 Baru</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-800 font-medium leading-tight">{n.text}</p>
                    <span className="text-[10px] text-slate-400 block">{n.time}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveView('reports');
                  setNotifOpen(false);
                }}
                className="w-full text-center py-2 text-xs font-bold text-[#C62828] hover:bg-red-50 rounded-xl transition-all"
              >
                Lihat Semua Laporan
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-3 pr-2 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
          >
            <div className="w-7 h-7 rounded-full bg-[#C62828] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{currentUser.name}</p>
              <p className="text-[10px] text-[#C62828] font-bold uppercase">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 z-50 animate-scaleUp">
              <div className="p-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{currentUser.nip}</p>
                <p className="text-[10px] text-[#C62828] font-semibold mt-0.5">{currentUser.agency}</p>
              </div>

              <button
                onClick={() => {
                  setActiveView('settings');
                  setProfileOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
              >
                Pengaturan Profil & Keamanan
              </button>

              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
