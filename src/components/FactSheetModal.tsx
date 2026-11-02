import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  Award, 
  CheckCircle, 
  AlertOctagon, 
  BookOpen, 
  Briefcase,
  FileText,
  Download
} from 'lucide-react';
import { DEBRA_FACT_SHEET } from '../data/factSheet';

interface FactSheetModalProps {
  onClose: () => void;
}

export const FactSheetModal: React.FC<FactSheetModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>Debra Friednash Fact Sheet Vault</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Strict Single Source of Truth
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Source Document: <code className="text-sky-300">{DEBRA_FACT_SHEET.contact.resumeFileName}</code> (Zero hallucination policy)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          
          {/* Contact & Title Line */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">{DEBRA_FACT_SHEET.contact.name}</h3>
                <div className="text-sky-400 font-semibold text-xs">{DEBRA_FACT_SHEET.contact.titleLine}</div>
              </div>
              <div className="text-slate-400 text-xs sm:text-right">
                <div>{DEBRA_FACT_SHEET.contact.location}</div>
                <div>{DEBRA_FACT_SHEET.contact.phone} • {DEBRA_FACT_SHEET.contact.email}</div>
              </div>
            </div>

            {/* Verified Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {DEBRA_FACT_SHEET.keyMetrics.slice(0, 4).map((metric, i) => (
                <div key={i} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{metric.label}</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{metric.value}</div>
                  <div className="text-[10px] text-slate-500 truncate" title={metric.context}>{metric.context}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Accordion / Cards */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-sky-400" />
              <span>Verified Employment History</span>
            </h4>

            <div className="space-y-3">
              {DEBRA_FACT_SHEET.experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-bold text-slate-200 text-sm">{exp.role}</div>
                    <div className="text-slate-400 font-mono text-[11px]">{exp.period}</div>
                  </div>
                  <div className="text-sky-300 font-medium text-xs">
                    {exp.organization} • <span className="text-slate-400">{exp.location}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300/90 text-[11.5px] pt-1">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="leading-relaxed">{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education, Licenses, and Verified Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Education</span>
              </div>
              <div className="font-semibold text-slate-100 text-xs">{DEBRA_FACT_SHEET.education.degree}</div>
              <div className="text-slate-400">{DEBRA_FACT_SHEET.education.institution} ({DEBRA_FACT_SHEET.education.location})</div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Licenses & Credentials</span>
              </div>
              <ul className="space-y-1 text-[11.5px] text-slate-300">
                {DEBRA_FACT_SHEET.licenses.map((lic, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>{lic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Verified Software Tools</span>
              </div>
              <ul className="space-y-1 text-[11.5px] text-slate-300">
                {DEBRA_FACT_SHEET.verifiedTools.map((tool, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="text-sky-400">•</span>
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Anti-Hallucination Compliance Guardrail Table */}
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Strictly Forbidden Claims (Anti-Hallucination Guard)</span>
            </div>
            <p className="text-slate-300 text-[11.5px] leading-relaxed">
              Per explicit instructions, Debra's cover letters and screening questionnaires must <strong>NEVER</strong> claim proficiency or experience with any of the following unverified tools or sectors:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {DEBRA_FACT_SHEET.forbiddenClaims.map((claim, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-rose-900/30 rounded-lg p-3 space-y-1">
                  <div className="font-bold text-rose-300 text-xs">{claim.category}</div>
                  <div className="flex flex-wrap gap-1 py-1">
                    {claim.items.map((item, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] border border-rose-500/20">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10.5px] text-slate-400 italic">{claim.rule}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <div className="text-xs text-slate-400">
            Debra Friednash Executive Profile v1026a
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
