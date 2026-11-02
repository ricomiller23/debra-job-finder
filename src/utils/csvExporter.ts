import { ApplicationRecord } from '../types/job';

export function exportApplicationsLogCsv(records: ApplicationRecord[]): void {
  const headers = [
    "Date",
    "Company",
    "Job Title",
    "Link",
    "Pay",
    "Location",
    "Fit (High/Medium/Low)",
    "Biggest Gap",
    "Cover Letter File",
    "Status (Applied / Skipped / Needs Debra)",
    "Reason"
  ];

  const escapeCsv = (str: string | undefined): string => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""').replace(/\r?\n|\r/g, ' ');
    return `"${clean}"`;
  };

  const rows = records.map(r => [
    escapeCsv(r.date),
    escapeCsv(r.company),
    escapeCsv(r.jobTitle),
    escapeCsv(r.link),
    escapeCsv(r.pay),
    escapeCsv(r.location),
    escapeCsv(r.fit),
    escapeCsv(r.biggestGap),
    escapeCsv(r.coverLetterFile),
    escapeCsv(r.status),
    escapeCsv(r.reason)
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Applications_Log.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
