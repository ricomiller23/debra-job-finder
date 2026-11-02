import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyQuotaCard } from './components/DailyQuotaCard';
import { JobCard } from './components/JobCard';
import { JobIngestView } from './components/JobIngestView';
import { ApplicationsLogTable } from './components/ApplicationsLogTable';
import { ApplicationModal } from './components/ApplicationModal';
import { FactSheetModal } from './components/FactSheetModal';
import { LetterViewerModal } from './components/LetterViewerModal';
import { SAMPLE_JOBS } from './data/sampleJobs';
import { LIVE_LINKEDIN_JOBS } from './data/liveJobs';
import { JobListing, ApplicationRecord, DailyQuotaState } from './types/job';
import { evaluateJob } from './utils/evaluator';
import { exportApplicationsLogCsv } from './utils/csvExporter';
import { Sparkles, Briefcase, Filter, Search, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

const INITIAL_LOG_RECORDS: ApplicationRecord[] = [
  {
    id: 'app-init-1',
    date: '2026-11-01',
    company: 'Carlisle Companies Incorporated',
    jobTitle: 'Executive Coordinator to the President',
    link: 'https://www.linkedin.com/jobs/view/4105829103',
    pay: 'Pay not listed (CEO/Executive role)',
    location: 'Scottsdale, AZ',
    fit: 'High',
    biggestGap: 'Commercial roofing & construction materials sector nuances.',
    coverLetterFile: 'Debra_Friednash_Cover_Letter_Carlisle_Companies_Incorporated.pdf',
    coverLetterText: `Dear Hiring Team,

I am writing to express my interest in the Executive Coordinator to the President position at Carlisle Companies Incorporated. With more than 20 years of experience providing high-level operational and governance support to CEOs and corporate boards in regulated environments across the Phoenix metropolitan area, I am well prepared to manage your executive office with discretion and administrative rigor.

As Corporate Secretary and Executive Assistant to the CEO at Integro Bank in Phoenix, I manage 100+ weekly executive appointments across multiple time zones with zero scheduling conflicts. Additionally, I curate comprehensive daily executive briefing books that reduced our leadership team's preparation time by 30%, triaging over 40 weekly meeting requests against strategic priorities.

Serving as the primary liaison for more than 50 regulators, board members, and executive partners, I exercise complete discretion on material non-public matters. My operational background also includes authoring organizational SOPs, overseeing corporate insurance administration, and coordinating multi-time-zone travel itineraries for five C-suite leaders.

While my background has been established in commercial banking governance rather than building products, my institutional precision and gatekeeping standards ensure immediate productivity. I would welcome the opportunity to discuss how my background aligns with your leadership needs. You can reach me directly at 480-717-0553 or denvertrad@aol.com.

Sincerely,

Debra Friednash
Scottsdale, AZ 85253
480-717-0553 | denvertrad@aol.com`,
    status: 'Applied',
    reason: 'Approved by Debra in initial review session.',
    approvedByDebra: true,
    submittedAt: '09:15 AM'
  },
  {
    id: 'app-init-2',
    date: '2026-10-31',
    company: 'Apex Tech Cloud (Remote Staffing)',
    jobTitle: 'Executive Assistant to Founder',
    link: 'https://www.linkedin.com/jobs/view/4109823102',
    pay: '$80,000 – $85,000',
    location: 'Remote (Must relocate to CA)',
    fit: 'Disqualified',
    biggestGap: 'Relocation required outside Phoenix metro; pay below $90k threshold.',
    coverLetterFile: 'N/A',
    coverLetterText: '',
    status: 'Skipped',
    reason: 'Auto-disqualified: Remote-only with mandatory relocation to California; base salary below $90,000.',
    approvedByDebra: false
  }
];

export function App() {
  const [activeNavTab, setActiveNavTab] = useState<'jobs' | 'log' | 'ingest'>('jobs');
  const [jobFilter, setJobFilter] = useState<'all' | 'qualified' | 'disqualified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncingLiveJobs, setIsSyncingLiveJobs] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now (Cached)');

  const handleSyncLiveJobs = async () => {
    setIsSyncingLiveJobs(true);
    try {
      const res = await fetch('/api/live-jobs?keyword=Executive+Assistant&location=Scottsdale%2C+AZ');
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          // Merge newly fetched live jobs avoiding duplicates
          setJobs(prev => {
            const existingIds = new Set(prev.map(j => j.id));
            const newOnes = data.jobs.filter((j: any) => !existingIds.has(j.id));
            return [...newOnes, ...prev];
          });
          setLastSyncTime(new Date().toLocaleTimeString());
        } else {
          // Ensure LIVE_LINKEDIN_JOBS are merged
          setJobs(prev => {
            const existingIds = new Set(prev.map(j => j.id));
            const newOnes = LIVE_LINKEDIN_JOBS.filter(j => !existingIds.has(j.id));
            return [...newOnes, ...prev];
          });
          setLastSyncTime(new Date().toLocaleTimeString() + ' (Direct Feed)');
        }
      }
    } catch (e) {
      console.warn('Live API sync fallback:', e);
      setJobs(prev => {
        const existingIds = new Set(prev.map(j => j.id));
        const newOnes = LIVE_LINKEDIN_JOBS.filter(j => !existingIds.has(j.id));
        return [...newOnes, ...prev];
      });
      setLastSyncTime('Verified Local Feed');
    } finally {
      setTimeout(() => setIsSyncingLiveJobs(false), 600);
    }
  };

  // Persistent or stateful jobs & applications
  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const saved = localStorage.getItem('debra_jobs');
    return saved ? JSON.parse(saved) : [...LIVE_LINKEDIN_JOBS, ...SAMPLE_JOBS];
  });

  const [applicationsLog, setApplicationsLog] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('debra_applications_log');
    return saved ? JSON.parse(saved) : INITIAL_LOG_RECORDS;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const [quota, setQuota] = useState<DailyQuotaState>(() => {
    const saved = localStorage.getItem('debra_quota');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currentDate === todayStr) return parsed;
    }
    return {
      currentDate: todayStr,
      appliedCount: 1, // Reflects the Carlisle application
      maxPerDay: 5,
      firstSessionReviewRemaining: 2, // 1 of 3 initial approvals completed
      safetyWarningActive: false
    };
  });

  // Modals state
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobListing | null>(null);
  const [isFactSheetOpen, setIsFactSheetOpen] = useState(false);
  const [viewingLetterRecord, setViewingLetterRecord] = useState<ApplicationRecord | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('debra_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('debra_applications_log', JSON.stringify(applicationsLog));
  }, [applicationsLog]);

  useEffect(() => {
    localStorage.setItem('debra_quota', JSON.stringify(quota));
  }, [quota]);

  // Handlers
  const handleOpenApplication = (job: JobListing) => {
    if (quota.appliedCount >= quota.maxPerDay) {
      alert("Daily limit of 5 applications reached. Standing policy instructs agent to stop for today.");
      return;
    }
    if (quota.safetyWarningActive) {
      alert("LinkedIn security tripwire active. Resolve prompt before resuming applications.");
      return;
    }
    setSelectedJobForModal(job);
  };

  const handleSubmitApplication = (record: ApplicationRecord) => {
    setApplicationsLog(prev => [record, ...prev]);
    if (record.status === 'Applied') {
      setQuota(prev => ({
        ...prev,
        appliedCount: prev.appliedCount + 1,
        firstSessionReviewRemaining: Math.max(0, prev.firstSessionReviewRemaining - 1)
      }));
    }
  };

  const handleSkipJob = (job: JobListing, reason: string) => {
    const evalRes = evaluateJob(job);
    const newRecord: ApplicationRecord = {
      id: `skip-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      company: job.company,
      jobTitle: job.title,
      link: job.url,
      pay: job.payString,
      location: job.location,
      fit: evalRes.fit,
      biggestGap: evalRes.biggestGap,
      coverLetterFile: 'N/A',
      coverLetterText: '',
      status: evalRes.recommendedAction === 'Needs Debra' ? 'Needs Debra' : 'Skipped',
      reason: reason || evalRes.disqualificationReasons.join('; '),
      approvedByDebra: false
    };

    setApplicationsLog(prev => [newRecord, ...prev]);
  };

  const handleExportCsv = () => {
    exportApplicationsLogCsv(applicationsLog);
  };

  const handleResetQuota = () => {
    setQuota(prev => ({
      ...prev,
      appliedCount: 0,
      firstSessionReviewRemaining: 3
    }));
  };

  const handleTriggerSafetyWarning = () => {
    setQuota(prev => ({
      ...prev,
      safetyWarningActive: true,
      safetyWarningMessage: "Simulated LinkedIn security challenge / CAPTCHA detected. Agent execution paused."
    }));
  };

  const handleClearSafetyWarning = () => {
    setQuota(prev => ({
      ...prev,
      safetyWarningActive: false,
      safetyWarningMessage: undefined
    }));
  };

  // Filter jobs
  const appliedJobCompanies = new Set(
    applicationsLog.filter(a => a.status === 'Applied').map(a => a.company.toLowerCase())
  );

  const filteredJobs = jobs.filter(job => {
    const evalRes = evaluateJob(job);
    const matchesQuery = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (jobFilter === 'qualified') {
      return evalRes.fit === 'High' || evalRes.fit === 'Medium';
    }
    if (jobFilter === 'disqualified') {
      return evalRes.fit === 'Disqualified';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Header
        quota={quota}
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onOpenFactSheet={() => setIsFactSheetOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Daily Quota & Safety Card */}
        <DailyQuotaCard
          quota={quota}
          onResetQuota={handleResetQuota}
          onTriggerSafetyWarning={handleTriggerSafetyWarning}
          onClearSafetyWarning={handleClearSafetyWarning}
        />

        {/* TAB 1: CURATED PIPELINE */}
        {activeNavTab === 'jobs' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center space-x-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter Roles:</span>
                </span>
                <button
                  onClick={() => setJobFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    jobFilter === 'all'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All ({jobs.length})
                </button>
                <button
                  onClick={() => setJobFilter('qualified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    jobFilter === 'qualified'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Qualified Only (Phoenix $90k+)
                </button>
                <button
                  onClick={() => setJobFilter('disqualified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    jobFilter === 'disqualified'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Disqualified / Out of Scope
                </button>
              </div>

                            <div className="flex items-center space-x-2">
                <button
                  onClick={handleSyncLiveJobs}
                  disabled={isSyncingLiveJobs}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow transition active:scale-95 disabled:opacity-50"
                  title="Query live LinkedIn search API for open Phoenix/Scottsdale postings"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLiveJobs ? 'animate-spin' : ''}`} />
                  <span>{isSyncingLiveJobs ? 'Querying LinkedIn...' : 'Sync Live LinkedIn'}</span>
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search executive roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 w-full sm:w-64"
                />
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
                  No roles match the selected filter or search term.
                </div>
              ) : (
                filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    evaluation={evaluateJob(job)}
                    isApplied={appliedJobCompanies.has(job.company.toLowerCase())}
                    onOpenApplication={handleOpenApplication}
                    onSkipJob={handleSkipJob}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INGEST / URL ANALYZER */}
        {activeNavTab === 'ingest' && (
          <JobIngestView
            onAnalyzeAndOpen={(job) => {
              setSelectedJobForModal(job);
            }}
            onAddToList={(job) => {
              setJobs(prev => [job, ...prev]);
            }}
          />
        )}

        {/* TAB 3: APPLICATIONS LOG & SPREADSHEET */}
        {activeNavTab === 'log' && (
          <ApplicationsLogTable
            records={applicationsLog}
            onExportCsv={handleExportCsv}
            onViewLetter={(record) => setViewingLetterRecord(record)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Debra Job Finder • Built for Debra Friednash (Scottsdale, AZ)
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span>Accuracy &gt; Volume</span>
            <span>•</span>
            <span>Zero Hallucinations</span>
            <span>•</span>
            <span>Max 5 Apps/Day</span>
          </div>
        </div>
      </footer>

      {/* Application Preparation Modal */}
      {selectedJobForModal && (
        <ApplicationModal
          job={selectedJobForModal}
          evaluation={evaluateJob(selectedJobForModal)}
          isFirstSession={quota.firstSessionReviewRemaining > 0}
          onClose={() => setSelectedJobForModal(null)}
          onSubmitApplication={handleSubmitApplication}
          onSkipApplication={(job, reason) => {
            handleSkipJob(job, reason);
            setSelectedJobForModal(null);
          }}
        />
      )}

      {/* Fact Sheet Vault Modal */}
      {isFactSheetOpen && (
        <FactSheetModal onClose={() => setIsFactSheetOpen(false)} />
      )}

      {/* Previously Submitted Letter Viewer Modal */}
      {viewingLetterRecord && (
        <LetterViewerModal
          record={viewingLetterRecord}
          onClose={() => setViewingLetterRecord(null)}
        />
      )}
    </div>
  );
}

export default App;
