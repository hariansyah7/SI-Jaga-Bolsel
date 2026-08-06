import React, { useState } from 'react';
import { Settings, Shield, Lock, Database, Save, Sparkles, Server } from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const [aesEnabled, setAesEnabled] = useState(true);
  const [aiAutoTriage, setAiAutoTriage] = useState(true);
  const [maxUploadMb, setMaxUploadMb] = useState(100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengaturan Sistem WBS berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#C62828]" />
            <span>Pengaturan Sistem & Keamanan Server WBS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi parameter enkripsi, batas unggah berkas, serta fitur AI Triage.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 max-w-2xl">
        
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C62828]" />
            <span>Keamanan & Enkripsi Berkas</span>
          </h3>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Enkripsi Otomatis AES-256 Bit SSL</p>
              <p className="text-[11px] text-slate-500">Enkripsi seluruh dokumen bukti sebelum disimpan ke cloud server.</p>
            </div>
            <input
              type="checkbox"
              checked={aesEnabled}
              onChange={(e) => setAesEnabled(e.target.checked)}
              className="w-5 h-5 text-[#C62828] rounded focus:ring-[#C62828]"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">AI Auto-Triage & Sentiment Analysis</p>
              <p className="text-[11px] text-slate-500">Gunakan Gemini 3.6 Flash untuk analisis tingkat risiko laporan baru.</p>
            </div>
            <input
              type="checkbox"
              checked={aiAutoTriage}
              onChange={(e) => setAiAutoTriage(e.target.checked)}
              className="w-5 h-5 text-[#C62828] rounded focus:ring-[#C62828]"
            />
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Server className="w-4 h-4 text-[#C62828]" />
            <span>Batas Unggah & Backup</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Maksimal Ukuran Unggah Berkas (MB)</label>
            <input
              type="number"
              value={maxUploadMb}
              onChange={(e) => setMaxUploadMb(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
            />
          </div>

          <button
            type="button"
            onClick={() => alert('Backup database PostgreSQL berhasil diunduh (Encrypted Dump)!')}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>Unduh Backup Database Sekarang</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-md"
        >
          Simpan Seluruh Pengaturan
        </button>

      </form>

    </div>
  );
};
