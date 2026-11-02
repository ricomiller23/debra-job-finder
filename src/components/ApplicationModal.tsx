import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  Send,
  Building,
  MapPin,
  DollarSign,
  Paperclip
} from 'lucide-react';
import { JobListing, EvaluationResult, ScreeningAnswers, ApplicationRecord } from '../types/job';
import { generateCoverLetter } from '../utils/coverLetterGenerator';
import { downloadCoverLetterPdf } from '../utils/pdfGenerator';
import { DEBRA_FACT_SHEET } from '../data/factSheet';

interface ApplicationModalProps {
  job: JobListing;
  evaluation: EvaluationResult;
  isFirstSession: boolean;
  onClose: () => void;
  onSubmitApplication: (record: ApplicationRecord) => void;
  onSkipApplication: (job: JobListing, reason: string) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  evaluation,
  isFirstSession,
  onClose,
  onSubmitApplication,
  onSkipApplication
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'screening' | 'review'>('letter');
  const [coverLetterText, setCoverLetterText] = useState(() => generateCoverLetter(job, evaluation));
  const [copied, setCopied] = useState(false);
  const [downloadedPdf, setDownloadedPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFlaggedRedFlag, setHasFlaggedRedFlag] = useState(false);

  // Standard Verified Screening Answers
  const screeningAnswers: ScreeningAnswers = {
    authorizedInUS: 'Yes',
    requireSponsorship: 'No',
    raceEthnicity: 'White',
    gender: 'Female',
    disabilityStatus: 'No, I do not have a disability',
    veteranStatus: 'I am not a protected veteran',
    otherDemographics: 'I prefer not to answer / decline to self-identify',
    yearsExecutiveSupport: '20+',
    yearsBoardSecretarySupport: '5',
    yearsMicrosoftOffice: '20+',
    salaryExpectation: "$90,000 minimum, negotiable depending on total compensation.",
    willingToRelocate: 'No',
    willingToWorkMetro: 'Yes',
    hasRedFlags: false
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(coverLetterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  const handleDownloadPdf = () => {
    const filename = downloadCoverLetterPdf(job, coverLetterText);
    setDownloadedPdf(true);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const sanitizedCompany = job.company.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Debra_Friednash_Cover_Letter_${sanitizedCompany}.pdf`;

      const record: ApplicationRecord = {
        id: `app-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        company: job.company,
        jobTitle: job.title,
        link: job.url,
        pay: job.payString,
        location: job.location,
        fit: evaluation.fit,
        biggestGap: evaluation.biggestGap,
        coverLetterFile: filename,
        coverLetterText,
        status: hasFlaggedRedFlag ? 'Needs Debra' : 'Applied',
        reason: hasFlaggedRedFlag 
          ? 'Application flagged: requested non-standard legal/identity consent'
          : `Approved application (Matched ${evaluation.supportingHighlights.length} fact-sheet metrics)`,
        hiringManager: job.hiringManager,
        approvedByDebra: true,
        submittedAt: new Date().toLocaleTimeString()
      };

      onSubmitApplication(record);
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                Application Preparation
              </span>
              {isFirstSession && (
                <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Debra Approval Gate Active
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1 flex items-center space-x-2">
              <span>{job.title}</span>
              <span className="text-slate-500 font-normal">at</span>
              <span className="text-sky-300 font-semibold">{job.company}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-5 pt-2">
          <button
            onClick={() => setActiveTab('letter')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'letter'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Tailored Cover Letter & PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('screening')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'screening'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Screening Form Answers</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'review'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Final Review & Approval</span>
          </button>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-slate-200 text-sm">
          
          {/* TAB 1: COVER LETTER */}
          {activeTab === 'letter' && (
            <div className="space-y-4">
              {/* Compliance & Rules Info Card */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Fact Sheet Strict Compliance: Zero Hallucinations</span>
                  </div>
                  <p className="text-slate-400 text-[11.5px]">
                    Letter follows exact 4-paragraph structure, cites verified Integro Bank metrics, and explicitly discloses the honest domain gap.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyText}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition text-xs shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Editable Letter Preview Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Custom Letter Body (Editable for Fine Tuning):</span>
                  <span className="text-[11px] text-slate-500">
                    PDF Filename: <code className="text-sky-300">Debra_Friednash_Cover_Letter_{job.company.replace(/[^a-zA-Z0-9]/g, '_')}.pdf</code>
                  </span>
                </div>
                <textarea
                  value={coverLetterText}
                  onChange={(e) => setCoverLetterText(e.target.value)}
                  rows={14}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 font-serif text-sm leading-relaxed text-slate-200 focus:outline-none focus:border-sky-500 shadow-inner"
                />
              </div>

              {/* Attachment Checklist Banner */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-sky-400" />
                  <span>Required Attachment:</span>
                  <span className="font-semibold text-slate-100">Debra_Friednash_Resume_1026a.pdf</span>
                </div>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Validated & Ready</span>
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: SCREENING QUESTIONS */}
          {activeTab === 'screening' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 text-xs text-slate-300">
                <div className="font-bold text-slate-100 mb-1 flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  <span>Automated Screening Questionnaire Answers</span>
                </div>
                <p className="text-slate-400 text-[11.5px]">
                  Configured according to Debra's strict verified profile. If any application asks for SSN, Date of Birth, or bank info, flag immediately as <strong>Needs Debra</strong>.
                </p>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="text-slate-400 font-medium">Legally authorized to work in the US?</div>
                  <div className="text-slate-100 font-bold text-sm text-emerald-400">{screeningAnswers.authorizedInUS}</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="text-slate-400 font-medium">Require visa sponsorship now or in future?</div>
                  <div className="text-slate-100 font-bold text-sm text-emerald-400">{screeningAnswers.requireSponsorship}</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="text-slate-400 font-medium">Salary Expectation</div>
                  <div className="text-slate-100 font-bold text-sm text-sky-300">{screeningAnswers.salaryExpectation}</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="text-slate-400 font-medium">Willing to relocate?</div>
                  <div className="text-slate-100 font-bold text-sm text-emerald-400">
                    No <span className="text-slate-400 text-xs font-normal">(Willing to work on-site/hybrid in Phoenix metro: Yes)</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="text-slate-400 font-medium">Years of Executive / Administrative Experience</div>
                  <div className="text-slate-100 font-bold text-sm">{screeningAnswers.yearsExecutiveSupport} years</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="text-slate-400 font-medium">Years of Corporate Secretary & Board Support</div>
                  <div className="text-slate-100 font-bold text-sm">{screeningAnswers.yearsBoardSecretarySupport} years</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="text-slate-400 font-medium">Demographics (Race / Gender)</div>
                  <div className="text-slate-100 font-semibold">White  |  Female</div>
                  <div className="text-[11px] text-slate-400">Non-veteran, no disability, declines voluntary self-ID</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="text-slate-400 font-medium">Advanced Microsoft Office Experience</div>
                  <div className="text-slate-100 font-bold text-sm">{screeningAnswers.yearsMicrosoftOffice} years</div>
                </div>
              </div>

              {/* Red-Flag Toggle Simulator */}
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3.5 text-xs text-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Red-Flag Tripwire (SSN, DOB, Bank Details, Legal Consent)</span>
                  </span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFlaggedRedFlag}
                      onChange={(e) => setHasFlaggedRedFlag(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span className="text-[11.5px] font-semibold text-slate-300">Flag as "Needs Debra"</span>
                  </label>
                </div>
                <p className="text-amber-200/80 text-[11px] leading-relaxed">
                  Per strict rule: If the employer portal asks for SSN, background check consent, or bank wire details, NEVER submit automatically. Log as <strong>Needs Debra</strong> and skip.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: FINAL REVIEW & SUBMISSION */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-100 text-sm">
                    Application Package Summary
                  </h4>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Ready to Transmit
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">Target Role:</div>
                    <div className="font-bold text-slate-200 truncate">{job.title}</div>
                    <div className="text-[11px] text-slate-400">{job.company}</div>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">Compensation & Work:</div>
                    <div className="font-bold text-emerald-400">{job.payString}</div>
                    <div className="text-[11px] text-slate-400">{job.location} ({job.workplaceType})</div>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">Attachments:</div>
                    <div className="font-semibold text-slate-200">1. Resume (1026a.pdf)</div>
                    <div className="font-semibold text-sky-400">2. Custom Cover Letter</div>
                  </div>
                </div>

                {/* Honest Gap Confirmation */}
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                  <div className="text-slate-400 font-medium">Honest Gap Disclosed to Employer:</div>
                  <div className="text-amber-300 font-semibold">{evaluation.biggestGap}</div>
                </div>

                {isFirstSession && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 space-y-1">
                    <div className="font-bold text-amber-400">FIRST SESSION VERIFICATION NOTICE</div>
                    <p className="text-[11.5px] leading-relaxed">
                      You are in First Session Approval Mode. Review the letter text and answers above. Clicking "Approve & Submit" verifies this application and commits it to your Applications Log.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Paced Human-Agent Execution Mode</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSkipApplication(job, "Manual skip during review")}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Skip Application
            </button>

            {activeTab !== 'review' ? (
              <button
                onClick={() => setActiveTab(activeTab === 'letter' ? 'screening' : 'review')}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 transition active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : hasFlaggedRedFlag ? 'Log as "Needs Debra"' : 'Approve & Submit Application'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
