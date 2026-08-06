import React, { useState } from 'react';
import { History, Shield, Lock, Search, Download } from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../data/mockData';

export const AuditTrailView: React.FC = () => {
  const [logs] = useState(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(l => 
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.ipAddress.includes(search)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-[#C62828]" />
            <span>Audit Trail & Security System Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jejak aktivitas sistem terenkripsi AES-256 untuk pemantauan keamanan cyber & integritas data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter log..."
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#C62828]"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="p-4">Timestamp (WITA)</th>
                <th className="p-4">Aktivitas / Event</th>
                <th className="p-4">Pengguna (Actor)</th>
                <th className="p-4">Role</th>
                <th className="p-4 font-mono">IP Address</th>
                <th className="p-4 text-center">Integritas Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-slate-500 text-[11px]">{l.timestamp}</td>
                  <td className="p-4 font-bold text-slate-900">{l.action}</td>
                  <td className="p-4 text-slate-800">{l.user}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {l.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{l.ipAddress}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1 w-fit mx-auto">
                      <Lock className="w-3 h-3" /> OK (SHA-256)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
