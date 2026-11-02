import React from 'react';
import { Briefcase, ShieldCheck, FileText, Download, UserCheck, PlusCircle } from 'lucide-react';
import { DailyQuotaState } from '../types/job';

interface HeaderProps {
  quota: DailyQuotaState;
  activeTab: 'jobs' | 'log' | 'ingest';
  setActiveTab: (tab: 'jobs' | 'log' | 'ingest') => void;
  onOpenFactSheet: () => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  quota,
  activeTab,
  setActiveTab,
  onOpenFactSheet,
  onExportCsv
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Agent Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-600/20 text-white font-bold text-lg">
              DF
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-slate-100 text-lg leading-tight tracking-tight">
                  Debra Job Finder
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  LinkedIn Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Executive Application Agent for Debra Friednash (Scottsdale, AZ)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'jobs'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Curated Pipeline</span>
            </button>
            <button
              onClick={() => setActiveTab('ingest')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'ingest'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Ingest / URL Analyzer</span>
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'log'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Applications Log</span>
            </button>
          </nav>

          {/* Actions & Quota Status */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenFactSheet}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="View Debra Friednash Verified Fact Sheet & Anti-Hallucination Guard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Fact Sheet Vault</span>
            </button>

            <button
              onClick={onExportCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Export Applications_Log.csv"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export Log</span>
            </button>

            {/* Daily Quota Meter */}
            <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-lg">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Daily Quota
                </div>
                <div className="text-xs font-bold text-slate-200">
                  <span className={quota.appliedCount >= quota.maxPerDay ? 'text-amber-400' : 'text-sky-400'}>
                    {quota.appliedCount}
                  </span>
                  <span className="text-slate-500"> / {quota.maxPerDay} applied</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-800 py-2 justify-around">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'jobs' ? 'bg-sky-600 text-white' : 'text-slate-400'
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setActiveTab('ingest')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'ingest' ? 'bg-sky-600 text-white' : 'text-slate-400'
            }`}
          >
            Analyze Job
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'log' ? 'bg-sky-600 text-white' : 'text-slate-400'
            }`}
          >
            Log & Ledger
          </button>
        </div>
      </div>
    </header>
  );
};
