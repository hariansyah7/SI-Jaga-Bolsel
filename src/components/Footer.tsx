import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Lock } from 'lucide-react';
import uploadedLogo from '../assets/uploaded_logo.png';
import logoBolsel from '../assets/logo_bolsel.svg';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenLoginModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenLoginModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Column 1: Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-10 px-1.5 py-1 bg-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <img 
                    src={uploadedLogo} 
                    alt="Logo SI-JAGA" 
                    className="h-full w-auto max-w-[45px] object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-[#C62828] tracking-wider leading-none">
                  SI-JAGA
                </h3>
                <p className="text-[10px] text-slate-300 font-medium tracking-tight mt-1">
                  Sistem Integritas dan Jaringan Aduan Gratifikasi
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Media pelaporan resmi terenkripsi untuk penanganan dugaan korupsi, gratifikasi, pungutan liar, penyalahgunaan wewenang, dan pelanggaran etika ASN di Kabupaten Bolaang Mongondow Selatan.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Jaminan Enkripsi & Perlindungan Identitas 100%</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-[#C62828]">
              Navigasi Utama
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button 
                  onClick={() => setActiveTab('home')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C62828]">›</span> Beranda WBS
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('report')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C62828]">›</span> Buat Laporan Pengaduan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tracking')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C62828]">›</span> Cek Status Laporan
                </button>
              </li>
              {onOpenLoginModal && (
                <li>
                  <button 
                    onClick={onOpenLoginModal} 
                    className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-bold pt-1"
                  >
                    <Lock className="w-3.5 h-3.5" /> Portal Internal Staff
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Violation Scope */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-[#C62828]">
              Kategori Pelanggaran
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Tindak Pidana Korupsi & Gratifikasi</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Pungutan Liar (Pungli) Layanan</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Penyalahgunaan Wewenang Jabatan</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Rekayasa Pengadaan Barang & Jasa</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Pelanggaran Disiplin & Etika ASN</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Contact & Address */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-[#C62828]">
              Kontak Inspektorat
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C62828] shrink-0 mt-0.5" />
                <span>
                  Gedung Inspektorat Daerah, Kawasan Terminal Lama Pasar Toluaya, Kab. Bolaang Mongondow Selatan, Sulawesi Utara
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C62828] shrink-0" />
                <span>082190877680</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C62828] shrink-0" />
                <span>Email: inspektorat@bolselkab.go.id</span>
              </div>

              {/* Social Media Links */}
              <div className="pt-3 border-t border-slate-800/80 mt-3">
                <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                  Media Sosial Resmi:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white transition-all text-xs font-medium group border border-slate-700/50"
                    title="Facebook Inspektorat Bolsel"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-300 hover:text-white transition-all text-xs font-medium group border border-slate-700/50"
                    title="Instagram Inspektorat Bolsel"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a 
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-black hover:text-cyan-400 text-slate-300 transition-all text-xs font-medium group border border-slate-700/50"
                    title="TikTok Inspektorat Bolsel"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68 6.34 6.34 0 009.68 22a6.33 6.33 0 006.33-6.32V9.22a8.16 8.16 0 004.81 1.56V7.32a4.85 4.85 0 01-1.23-.63z"/>
                    </svg>
                    <span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bar matching Sleek Interface design */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-medium italic">
              "Bekerja Bersama untuk Pemerintahan yang Bersih dan Berintegritas"
            </span>
          </div>
          <div className="flex items-center space-x-6 text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>Server Status: Normal</span>
            </div>
            <span>Version 2.0.4</span>
            <span className="text-slate-700">|</span>
            <span>&copy; Inspektorat Kabupaten Bolaang Mongondow Selatan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

