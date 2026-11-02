import { jsPDF } from 'jspdf';
import { JobListing } from '../types/job';
import { DEBRA_FACT_SHEET } from '../data/factSheet';

export function downloadCoverLetterPdf(job: JobListing, letterText: string): string {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });

  const sanitizedCompany = job.company.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Debra_Friednash_Cover_Letter_${sanitizedCompany}.pdf`;

  // Page geometry
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 54;
  const rightMargin = 54;
  const usableWidth = pageWidth - leftMargin - rightMargin;
  let currentY = 54;

  // Header / Letterhead
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(DEBRA_FACT_SHEET.contact.name.toUpperCase(), leftMargin, currentY);
  currentY += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  const contactLine = `${DEBRA_FACT_SHEET.contact.location}  |  ${DEBRA_FACT_SHEET.contact.phone}  |  ${DEBRA_FACT_SHEET.contact.email}`;
  doc.text(contactLine, leftMargin, currentY);
  currentY += 10;

  // Horizontal divider rule
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(1);
  doc.line(leftMargin, currentY, pageWidth - rightMargin, currentY);
  currentY += 24;

  // Date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(todayFormatted, leftMargin, currentY);
  currentY += 18;

  // Recipient block
  const recipient = job.hiringManager && !job.hiringManager.includes('Hiring Team')
    ? job.hiringManager
    : `Hiring Team`;
  doc.setFont('helvetica', 'bold');
  doc.text(recipient, leftMargin, currentY);
  currentY += 14;

  doc.setFont('helvetica', 'normal');
  doc.text(job.company, leftMargin, currentY);
  currentY += 14;
  doc.text(job.location, leftMargin, currentY);
  currentY += 22;

  // Subject Line
  doc.setFont('helvetica', 'bold');
  doc.text(`RE: Application for ${job.title}`, leftMargin, currentY);
  currentY += 20;

  // Body text parsing
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.2);
  doc.setTextColor(30, 41, 59); // slate-800

  // Split into paragraphs by blank lines
  const rawParagraphs = letterText.split(/\n\s*\n/);
  // Filter out header lines if letterText contains them
  const bodyParagraphs = rawParagraphs.filter(p => {
    const pTrim = p.trim();
    if (pTrim.startsWith('Debra Friednash') && pTrim.includes('denvertrad@aol.com')) return false;
    if (pTrim.startsWith('Scottsdale, AZ 85253')) return false;
    return true;
  });

  for (const para of bodyParagraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    // Check if sign-off block
    if (cleanPara.startsWith('Sincerely,') || cleanPara === 'Sincerely,') {
      currentY += 8;
      doc.text('Sincerely,', leftMargin, currentY);
      currentY += 28;
      doc.setFont('helvetica', 'bold');
      doc.text('Debra Friednash', leftMargin, currentY);
      currentY += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Corporate Secretary & Executive Assistant to the CEO', leftMargin, currentY);
      currentY += 12;
      doc.text('480-717-0553  |  denvertrad@aol.com', leftMargin, currentY);
      break;
    }

    const lines = doc.splitTextToSize(cleanPara, usableWidth);
    doc.text(lines, leftMargin, currentY);
    currentY += lines.length * 14.5 + 12;
  }

  // Save PDF
  doc.save(filename);
  return filename;
}
