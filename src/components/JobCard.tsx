import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { JobListing, EvaluationResult } from '../types/job';

interface JobCardProps {
  job: JobListing;
  evaluation: EvaluationResult;
  isApplied: boolean;
  onOpenApplication: (job: JobListing) => void;
  onSkipJob: (job: JobListing, reason: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  evaluation,
  isApplied,
  onOpenApplication,
  onSkipJob
}) => {
  const getFitBadge = () => {
    switch (evaluation.fit) {
      case 'High':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
            High Fit (Target Role)
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3 h-3 mr-1 text-amber-400" />
            Medium Fit (Review Gap)
          </span>
        );
      case 'Disqualified':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3 mr-1 text-rose-400" />
            Disqualified / Skipped
          </span>
        );
    }
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 p-5 ${
      isApplied 
        ? 'bg-slate-900/40 border-slate-800 opacity-75' 
        : evaluation.isDisqualified
          ? 'bg-slate-800/40 border-slate-800/80 hover:border-slate-700'
          : 'bg-slate-800/90 border-slate-700/80 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5'
    }`}>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-100 text-base sm:text-lg tracking-tight">
              {job.title}
            </h3>
            {getFitBadge()}
            {isApplied && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Applied
              </span>
            )}
          </div>
          <div className="flex items-center text-sm font-semibold text-slate-300 space-x-1.5">
            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{job.company}</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Posted {job.postedDate}</span>
          </div>
        </div>

        {/* External Link */}
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-sky-400 transition self-start"
          title="Open listing on LinkedIn"
        >
          <span>LinkedIn</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Meta Pills (Location, Workplace, Pay) */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-700/50 text-xs">
        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium border ${
          evaluation.locationMatch
            ? 'bg-slate-700/50 border-slate-600 text-slate-200'
            : 'bg-rose-950/40 border-rose-800 text-rose-300'
        }`}>
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{job.location}</span>
          <span className="text-slate-400">({job.workplaceType})</span>
        </span>

        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium border ${
          evaluation.payMatch
            ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
            : 'bg-rose-950/40 border-rose-800 text-rose-300'
        }`}>
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>{job.payString}</span>
        </span>

        {job.hiringManager && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-slate-300 bg-slate-700/40 border border-slate-600/60 font-medium">
            Contact: {job.hiringManager}
          </span>
        )}
      </div>

      {/* Evaluation Analysis / Disqualification Callout */}
      {evaluation.isDisqualified ? (
        <div className="mt-3.5 bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 text-xs text-rose-300 space-y-1">
          <div className="font-semibold text-rose-400 flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Disqualification Rule Triggered:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11.5px] text-rose-300/90 pl-1">
            {evaluation.disqualificationReasons.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3.5 space-y-2 text-xs">
          {/* Supporting highlights from Debra's Fact Sheet */}
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-3 space-y-1.5">
            <div className="font-semibold text-sky-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Tailored Fact Sheet Matches (Zero Hallucination):</span>
            </div>
            <ul className="space-y-1 text-[11.5px] text-slate-300">
              {evaluation.supportingHighlights.map((hl, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-sky-400 font-bold">•</span>
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Honest Gap Disclosure (Rule 2d) */}
          <div className="flex items-start space-x-2 bg-slate-800/60 border border-slate-700/40 rounded-lg p-2.5 text-[11.5px] text-slate-300">
            <span className="font-bold text-amber-400 flex-shrink-0">Honest Gap Declared:</span>
            <span className="text-slate-300">{evaluation.biggestGap}</span>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400">
          Source: {job.source.includes('Live') || job.source === 'LinkedIn' ? (
            <span className="inline-flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              Live LinkedIn Posting
            </span>
          ) : (
            <span className="text-slate-400 font-medium">{job.source}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {evaluation.isDisqualified ? (
            <button
              onClick={() => onSkipJob(job, evaluation.disqualificationReasons.join('; '))}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition"
            >
              Log as Skipped
            </button>
          ) : (
            <>
              <button
                onClick={() => onSkipJob(job, "Manual user skip")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition"
              >
                Skip
              </button>
              <button
                onClick={() => onOpenApplication(job)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review & Prepare Application</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
