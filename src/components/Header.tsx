import React, { useState, useEffect } from 'react';
import { Shield, Clock, FileText, Lock, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { User } from '../types/wbs';
import uploadedLogo from '../assets/uploaded_logo.png';
import logoBolsel from '../assets/logo_bolsel.svg';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [witaTime, setWitaTime] = useState('');

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

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'report', label: 'Buat Laporan', highlight: true },
    { id: 'tracking', label: 'Cek Status Laporan' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Banner Government Bar */}
      <div className="bg-[#C62828] text-white text-[11px] py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            Situs Resmi
          </span>
          <span>INSPEKTORAT DAERAH KABUPATEN BOLAANG MONGONDOW SELATAN</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] opacity-90">
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{witaTime || 'Bolaang Uki, Bolsel'}</span>
          </div>
          <span className="hidden md:inline text-white/40">|</span>
          <div className="hidden sm:flex items-center gap-2.5 pl-1">
            <span className="text-[10px] text-white/80 font-medium">Sosmed:</span>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Facebook"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Instagram"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="TikTok"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68 6.34 6.34 0 009.68 22a6.33 6.33 0 006.33-6.32V9.22a8.16 8.16 0 004.81 1.56V7.32a4.85 4.85 0 01-1.23-.63z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            {/* Logo Images */}
            <div className="flex items-center space-x-2">
              <div className="h-11 px-1.5 py-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <img 
                  src={uploadedLogo} 
                  alt="Logo SI-JAGA" 
                  className="h-full w-auto max-w-[50px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-wider text-[#C62828]">
                  SI-JAGA
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-[10px] font-bold text-[#C62828]">
                  WBS
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium tracking-tight">
                Sistem Integritas dan Jaringan Aduan Gratifikasi
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="ml-2 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C62828] hover:bg-red-700 text-white font-semibold text-sm shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[#C62828] bg-red-50'
                      : 'text-slate-700 hover:text-[#C62828] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Auth Action or Staff Portal Button */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 pl-3 pr-2 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C62828] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{currentUser.name}</p>
                    <span className="text-[10px] uppercase font-extrabold text-[#C62828] bg-red-100 px-1.5 py-0.2 rounded">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-3 py-1.5 bg-[#C62828] hover:bg-red-700 text-white text-xs font-semibold rounded-full shadow-sm transition-all"
                >
                  Dashboard
                </button>

                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#C62828]" />
                <span>Portal Internal</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setActiveTab('report')}
              className="px-4 py-2 rounded-full bg-[#C62828] text-white font-semibold text-xs shadow-md shadow-red-200"
            >
              Buat Laporan
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left font-semibold text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-red-50 text-[#C62828]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-full bg-[#C62828] text-white font-semibold text-sm"
                >
                  Masuk Dashboard ({currentUser.role.toUpperCase()})
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-red-600 font-medium text-sm hover:bg-red-50 rounded-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLoginModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-50"
              >
                <Lock className="w-4 h-4 text-[#C62828]" />
                <span>Portal Internal Staff</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

