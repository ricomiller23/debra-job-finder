import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import { ApplicationRecord, JobListing } from '../types/job';
import { downloadCoverLetterPdf } from '../utils/pdfGenerator';

interface LetterViewerModalProps {
  record: ApplicationRecord;
  onClose: () => void;
}

export const LetterViewerModal: React.FC<LetterViewerModalProps> = ({ record, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(record.coverLetterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const mockJob: JobListing = {
      id: record.id,
      company: record.company,
      title: record.jobTitle,
      location: record.location,
      workplaceType: 'Hybrid',
      metroArea: 'Scottsdale',
      payString: record.pay,
      payListed: true,
      hiringManager: record.hiringManager,
      url: record.link,
      description: '',
      source: 'LinkedIn',
      postedDate: record.date
    };
    downloadCoverLetterPdf(mockJob, record.coverLetterText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              Cover Letter: {record.company}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 text-xs font-serif leading-relaxed text-slate-200 whitespace-pre-wrap bg-slate-950 shadow-inner">
          {record.coverLetterText}
        </div>

        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs">
          <div className="text-slate-400">
            File: <code className="text-sky-300">{record.coverLetterFile}</code>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium inline-flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium inline-flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
