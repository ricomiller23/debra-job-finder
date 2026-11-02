import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  MapPin, 
  DollarSign,
  ArrowRight,
  FileText
} from 'lucide-react';
import { JobListing } from '../types/job';
import { evaluateJob } from '../utils/evaluator';

interface JobIngestViewProps {
  onAnalyzeAndOpen: (job: JobListing) => void;
  onAddToList: (job: JobListing) => void;
}

export const JobIngestView: React.FC<JobIngestViewProps> = ({
  onAnalyzeAndOpen,
  onAddToList
}) => {
  const [jobUrl, setJobUrl] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Scottsdale, AZ');
  const [workplaceType, setWorkplaceType] = useState<'Hybrid' | 'On-site' | 'Remote'>('Hybrid');
  const [payString, setPayString] = useState('$100,000 base');
  const [description, setDescription] = useState('');
  const [hiringManager, setHiringManager] = useState('');

  const handleQuickFillExample = () => {
    setCompany('GoDaddy Corporate');
    setTitle('Executive Assistant to Chief Operating Officer');
    setLocation('Tempe, AZ (HQ Campus)');
    setWorkplaceType('Hybrid');
    setPayString('$102,000 – $118,000 annual base');
    setHiringManager('COO Operations');
    setDescription(`GoDaddy is seeking a seasoned Executive Assistant to support our Chief Operating Officer at our Tempe headquarters.

Responsibilities:
- Manage executive calendar across multiple time zones, resolving complex appointment conflicts.
- Prepare daily executive briefing books and leadership meeting decks.
- Act as confidential liaison to board members and executive stakeholders.
- Coordinate domestic executive travel itineraries.

Requirements:
- 12+ years of senior executive administrative experience.
- Strong proficiency in Microsoft Office (Word, PowerPoint, Excel, Outlook).
- Phoenix/Scottsdale metro resident; hybrid presence required 3 days/week.`);
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim() || !description.trim()) {
      alert("Please enter company, title, and job description.");
      return;
    }

    // Parse pay if possible
    const cleanPayLower = payString.toLowerCase();
    const isListed = !cleanPayLower.includes('not listed') && cleanPayLower.length > 3;
    const match = cleanPayLower.match(/\$?\s*(\d{2,3})[,\s]?(\d{3})?/);
    let payMin: number | undefined = undefined;
    if (match) {
      payMin = parseInt(match[1] + (match[2] || '000'), 10);
    }

    const newJob: JobListing = {
      id: `ingest-${Date.now()}`,
      company: company.trim(),
      title: title.trim(),
      location: location.trim(),
      workplaceType,
      metroArea: location.toLowerCase().includes('scottsdale') ? 'Scottsdale' : 'Phoenix',
      payString: payString.trim() || 'Pay not listed (CEO/Executive role)',
      payMin,
      payListed: isListed,
      hiringManager: hiringManager.trim() || undefined,
      url: jobUrl.trim() || 'https://www.linkedin.com/jobs',
      description: description.trim(),
      source: 'Manual Ingestion',
      postedDate: new Date().toISOString().split('T')[0]
    };

    onAddToList(newJob);
    onAnalyzeAndOpen(newJob);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900/40 to-indigo-900/40 border border-sky-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>Real-Time LinkedIn Job Ingest & Rule Evaluator</span>
            </h2>
            <p className="text-xs text-slate-300">
              Paste any LinkedIn job posting or URL. The agent scans it against Debra's strict Phoenix metro, compensation, title, and anti-hallucination rules in under 1 second.
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickFillExample}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 border border-sky-400/40 transition self-start"
          >
            Load Sample Post
          </button>
        </div>
      </div>

      {/* Ingestion Form */}
      <form onSubmit={handleEvaluate} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        
        {/* Row 1: URL & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              LinkedIn Job URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://www.linkedin.com/jobs/view/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Western Alliance, Axon, Onsemi"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Row 2: Title & Hiring Manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Job Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Executive Assistant to the CEO, Corporate Secretary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Hiring Manager / Recruiter Name (if listed)
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe (leaves 'Hiring Team' if blank)"
              value={hiringManager}
              onChange={(e) => setHiringManager(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Row 3: Location, Workplace Type, Compensation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Location * (Phoenix Metro Only)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Scottsdale, AZ or Phoenix, AZ"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Workplace Type *
            </label>
            <select
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="Hybrid">Hybrid (Approved)</option>
              <option value="On-site">On-site (Approved)</option>
              <option value="Remote">Remote (Auto-Disqualified)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Pay Listed (Min $90k base) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. $95,000 or Pay not listed"
              value={payString}
              onChange={(e) => setPayString(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Row 4: Full Job Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Job Description & Requirements *</span>
            <span className="text-[11px] text-slate-500 font-normal">
              Agent checks for disqualifying keywords (financial modeling, clinical, quotas, etc.)
            </span>
          </label>
          <textarea
            required
            rows={7}
            placeholder="Paste full text of the LinkedIn job posting here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/25 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Evaluate Role & Generate Tailored Application</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </form>
    </div>
  );
};
