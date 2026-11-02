export type FitLevel = 'High' | 'Medium' | 'Low' | 'Disqualified';

export type ApplicationStatus = 'Pending Review' | 'Applied' | 'Skipped' | 'Needs Debra';

export interface JobListing {
  id: string;
  company: string;
  title: string;
  location: string;
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  metroArea: 'Phoenix' | 'Scottsdale' | 'Tempe' | 'Mesa' | 'Chandler' | 'Glendale' | 'Paradise Valley' | 'Outside Metro' | 'Unknown';
  payString: string;
  payMin?: number;
  payMax?: number;
  payListed: boolean;
  hiringManager?: string;
  url: string;
  description: string;
  source: 'LinkedIn' | 'Manual Ingestion' | 'Curated';
  postedDate: string;
}

export interface EvaluationResult {
  fit: FitLevel;
  titleMatch: boolean;
  locationMatch: boolean;
  payMatch: boolean;
  isDisqualified: boolean;
  disqualificationReasons: string[];
  biggestGap: string;
  supportingHighlights: string[];
  recommendedAction: 'Apply' | 'Review' | 'Skip' | 'Needs Debra';
  scoreExplanation: string;
}

export interface ScreeningAnswers {
  authorizedInUS: 'Yes' | 'No';
  requireSponsorship: 'No' | 'Yes';
  raceEthnicity: 'White';
  gender: 'Female';
  disabilityStatus: 'No, I do not have a disability';
  veteranStatus: 'I am not a protected veteran';
  otherDemographics: 'I prefer not to answer / decline to self-identify';
  yearsExecutiveSupport: '20+';
  yearsBoardSecretarySupport: '5';
  yearsMicrosoftOffice: '20+';
  salaryExpectation: string;
  willingToRelocate: 'No';
  willingToWorkMetro: 'Yes';
  hasRedFlags: boolean;
  redFlagDetails?: string;
}

export interface ApplicationRecord {
  id: string;
  date: string;
  company: string;
  jobTitle: string;
  link: string;
  pay: string;
  location: string;
  fit: FitLevel;
  biggestGap: string;
  coverLetterFile: string;
  coverLetterText: string;
  status: ApplicationStatus;
  reason: string;
  hiringManager?: string;
  approvedByDebra: boolean;
  submittedAt?: string;
}

export interface DailyQuotaState {
  currentDate: string;
  appliedCount: number;
  maxPerDay: number;
  firstSessionReviewRemaining: number;
  safetyWarningActive: boolean;
  safetyWarningMessage?: string;
}
