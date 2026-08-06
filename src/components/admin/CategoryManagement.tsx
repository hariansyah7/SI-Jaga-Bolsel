import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Shield, Clock } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../data/mockData';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#C62828]" />
            <span>Master Kategori Jenis Pelanggaran & SLA Penanganan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan 10 klasifikasi pelanggaran, bobot risiko default, dan batas waktu SLA balasan.
          </p>
        </div>

        <button
          onClick={() => alert('Fitur tambah kategori baru disimulasikan.')}
          className="px-4 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C62828] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  ID: {cat.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{cat.name}</h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">DEFAULT RISK</span>
                <span className="text-xs font-mono font-bold text-red-600">{cat.defaultRiskScore}/100</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> SLA Response: {cat.slaDays} Hari Kerja
              </span>

              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                Status: Aktif
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
