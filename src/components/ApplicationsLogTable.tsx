import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText,
  Clock,
  Eye
} from 'lucide-react';
import { ApplicationRecord, ApplicationStatus } from '../types/job';

interface ApplicationsLogTableProps {
  records: ApplicationRecord[];
  onExportCsv: () => void;
  onViewLetter: (record: ApplicationRecord) => void;
}

export const ApplicationsLogTable: React.FC<ApplicationsLogTableProps> = ({
  records,
  onExportCsv,
  onViewLetter
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = records.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = 
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.biggestGap.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const appliedCount = records.filter(r => r.status === 'Applied').length;
  const skippedCount = records.filter(r => r.status === 'Skipped').length;
  const needsDebraCount = records.filter(r => r.status === 'Needs Debra').length;

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Applied
          </span>
        );
      case 'Needs Debra':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Needs Debra
          </span>
        );
      case 'Skipped':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
            <XCircle className="w-3 h-3 mr-1 text-slate-400" />
            Skipped
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl">
          <div className="text-xs font-medium text-slate-400">Total Entries Logged</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{records.length}</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl">
          <div className="text-xs font-medium text-emerald-400">Applications Transmitted</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{appliedCount}</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl">
          <div className="text-xs font-medium text-amber-400">Needs Debra Action</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{needsDebraCount}</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl">
          <div className="text-xs font-medium text-slate-400">Filtered & Skipped Roles</div>
          <div className="text-2xl font-bold text-slate-400 mt-1">{skippedCount}</div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Export */}
      <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Applied', 'Needs Debra', 'Skipped'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === status
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company, title, gap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 w-48 sm:w-60"
            />
          </div>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
            title="Download Applications_Log.csv"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download CSV</span>
          </button>
        </div>
      </div>

      {/* Persistent Ledger Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-700/80 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5">Company & Role</th>
                <th className="py-3 px-3.5">Compensation</th>
                <th className="py-3 px-3.5">Location</th>
                <th className="py-3 px-3.5">Fit</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Disclosed Gap / Reason</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    No application records match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      {r.date}
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-100">{r.company}</div>
                      <div className="text-[11px] text-slate-400">{r.jobTitle}</div>
                    </td>

                    <td className="py-3 px-3.5 font-medium text-emerald-400 whitespace-nowrap">
                      {r.pay}
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap text-slate-300">
                      {r.location}
                    </td>

                    <td className="py-3 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        r.fit === 'High' ? 'bg-emerald-500/10 text-emerald-400' :
                        r.fit === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {r.fit}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {getStatusBadge(r.status)}
                    </td>

                    <td className="py-3 px-3.5 text-[11px] max-w-xs text-slate-400 truncate" title={`${r.biggestGap} | Reason: ${r.reason}`}>
                      <span className="text-slate-300">{r.biggestGap}</span>
                      {r.reason && <span className="block text-slate-500 text-[10px] truncate">{r.reason}</span>}
                    </td>

                    <td className="py-3 px-3.5 text-right whitespace-nowrap space-x-2">
                      {r.coverLetterText && (
                        <button
                          onClick={() => onViewLetter(r)}
                          className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 text-xs font-semibold"
                          title="View Cover Letter"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Letter</span>
                        </button>
                      )}
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-slate-400 hover:text-slate-200"
                        title="Open Job Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
