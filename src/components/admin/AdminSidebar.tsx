import React from 'react';
import { 
  LayoutDashboard, FileText, CheckCircle2, ShieldAlert, Users, 
  Layers, History, BarChart3, Settings, LogOut, ChevronRight, Shield, Award
} from 'lucide-react';
import { User, Role } from '../../types/wbs';

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentUser: User;
  onLogout: () => void;
  reportCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onLogout,
  reportCount
}) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Utama', icon: LayoutDashboard, roles: ['admin', 'operator', 'inspektur', 'auditor'] },
    { id: 'reports', label: 'Kelola Laporan WBS', icon: FileText, badge: reportCount, roles: ['admin', 'operator', 'inspektur', 'auditor'] },
    { id: 'verification', label: 'Verifikasi & Validasi', icon: CheckCircle2, roles: ['admin', 'operator'] },
    { id: 'disposition', label: 'Disposisi Inspektur', icon: ShieldAlert, roles: ['admin', 'inspektur'] },
    { id: 'investigation', label: 'Investigasi & LHP', icon: Award, roles: ['admin', 'inspektur', 'auditor'] },
    { id: 'users', label: 'Manajemen User', icon: Users, roles: ['admin'] },
    { id: 'categories', label: 'Master Kategori', icon: Layers, roles: ['admin'] },
    { id: 'audit_logs', label: 'Audit Trail', icon: History, roles: ['admin', 'inspektur'] },
    { id: 'statistics', label: 'Laporan Statistik', icon: BarChart3, roles: ['admin', 'inspektur', 'operator'] },
    { id: 'settings', label: 'Pengaturan Sistem', icon: Settings, roles: ['admin'] },
  ];

  const allowedItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0">
      
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="h-9 px-1 py-0.5 rounded-xl bg-white flex items-center justify-center shadow-md">
              <img 
                src="/logo-bolsel.png" 
                alt="Logo Pemkab Bolsel" 
                className="h-full w-auto max-w-[36px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="h-9 px-1 py-0.5 rounded-xl bg-white flex items-center justify-center shadow-md">
              <img 
                src="/logo-sijaga.png" 
                alt="Logo SI-JAGA" 
                className="h-full w-auto max-w-[36px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight leading-none">
              WBS INSPEKTORAT
            </h2>
            <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
              KAB. BOLSEL
            </p>
          </div>
        </div>

        {/* User Role Badge Card */}
        <div className="mx-4 my-4 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C62828] text-white flex items-center justify-center font-bold text-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <span className="text-[9px] uppercase font-black text-red-400 bg-red-950/80 px-1.5 py-0.2 rounded border border-red-800">
              ROLE: {currentUser.role}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1">
          {allowedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#C62828] text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-[#C62828]' : 'bg-[#C62828] text-white'
                  }`}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isActive ? 'text-white' : ''}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Action */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => setActiveView('landing')}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition-all"
        >
          <span>Ke Halaman Publik</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 px-3 rounded-xl bg-red-950/50 hover:bg-red-900/80 text-red-300 font-bold text-xs flex items-center justify-center gap-2 border border-red-900/50 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>

    </aside>
  );
};
