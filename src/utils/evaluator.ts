import { JobListing, EvaluationResult, FitLevel } from '../types/job';

const VALID_TITLES = [
  'executive assistant',
  'executive administrative assistant',
  'senior executive assistant',
  'executive assistant to the ceo',
  'executive assistant to the president',
  'corporate secretary',
  'board administrator',
  'executive coordinator',
  'office manager'
];

const VALID_METRO_CITIES = [
  'phoenix',
  'scottsdale',
  'tempe',
  'mesa',
  'chandler',
  'glendale',
  'paradise valley'
];

const DISQUALIFICATION_KEYWORDS = [
  { trigger: 'financial modeling', reason: 'Requires financial modeling / quantitative valuation (excluded by rule)' },
  { trigger: 'dcf', reason: 'Requires discounted cash flow / financial modeling (excluded by rule)' },
  { trigger: 'investment banking', reason: 'Requires investment banking experience (unverified for Debra)' },
  { trigger: 'management consulting', reason: 'Requires management consulting experience' },
  { trigger: 'sales quota', reason: 'Contains sales quota or revenue production requirements' },
  { trigger: 'quota carrying', reason: 'Contains sales quota requirements' },
  { trigger: 'security clearance', reason: 'Requires active government security clearance' },
  { trigger: 'ts/sci', reason: 'Requires TS/SCI security clearance' },
  { trigger: 'rn license', reason: 'Requires clinical / nursing license' },
  { trigger: 'clinical license', reason: 'Requires clinical medical license' },
  { trigger: 'relocation required', reason: 'Requires geographic relocation outside Phoenix metro' },
  { trigger: 'relocate after', reason: 'Mandatory relocation clause outside Phoenix metro' },
  { trigger: 'telegram', reason: 'Scam flag: requests communication via Telegram' },
  { trigger: 'whatsapp', reason: 'Scam flag: requests communication via WhatsApp' },
  { trigger: 'social security number', reason: 'Scam / privacy risk: requests SSN prior to interview' },
  { trigger: 'bank details', reason: 'Scam / privacy risk: requests bank account details' },
  { trigger: 'wire transfer', reason: 'Scam flag: offers payment via wire transfer' },
  { trigger: 'confidential client', reason: 'Unverified anonymous employer / scam indicator' }
];

export function evaluateJob(job: JobListing): EvaluationResult {
  const textToScan = `${job.title} ${job.company} ${job.location} ${job.description}`.toLowerCase();
  const disqualificationReasons: string[] = [];

  // 1. Check Scam & Disqualification Triggers
  for (const item of DISQUALIFICATION_KEYWORDS) {
    if (textToScan.includes(item.trigger.toLowerCase())) {
      disqualificationReasons.push(item.reason);
    }
  }

  // 2. Location Check: Phoenix Metro Only, On-site or Hybrid
  let locationMatch = false;
  const isRemoteOnly = job.workplaceType === 'Remote' || textToScan.includes('100% remote') || textToScan.includes('remote-only');
  const hasMetroCity = VALID_METRO_CITIES.some(city => textToScan.includes(city));

  if (!isRemoteOnly && hasMetroCity) {
    locationMatch = true;
  } else {
    if (isRemoteOnly) {
      disqualificationReasons.push('Remote-only position (Debra targets on-site or hybrid roles only)');
    } else if (!hasMetroCity) {
      disqualificationReasons.push(`Located outside Phoenix/Scottsdale metro area (${job.location})`);
    }
  }

  // 3. Title Check
  const titleLower = job.title.toLowerCase();
  const titleMatch = VALID_TITLES.some(vt => titleLower.includes(vt));
  if (!titleMatch) {
    disqualificationReasons.push(`Title '${job.title}' does not match target executive title taxonomy`);
  }

  // 4. Compensation Check (Min $90,000 or C-suite with pay not listed)
  let payMatch = false;
  const isCSuiteSupport = titleLower.includes('ceo') || 
                          titleLower.includes('president') || 
                          titleLower.includes('c-suite') || 
                          titleLower.includes('board') || 
                          titleLower.includes('corporate secretary') || 
                          titleLower.includes('chief');

  const hasNumericPay = typeof job.payMin === 'number' && job.payMin !== null;
  if (job.payListed && hasNumericPay) {
    const minVal = job.payMin as number;
    const maxVal = typeof job.payMax === 'number' && job.payMax !== null ? job.payMax : minVal;
    if (minVal >= 90000 || maxVal >= 90000) {
      payMatch = true;
    } else {
      disqualificationReasons.push(`Listed compensation ($${minVal.toLocaleString()}) falls below $90,000 base minimum`);
    }
  } else if (!job.payListed) {
    if (isCSuiteSupport) {
      payMatch = true; // Allowed per prompt rules: "If pay is not listed, apply only if the role is clearly executive-level (supporting CEO/President/C-suite) and log 'pay not listed'"
    } else {
      disqualificationReasons.push('Pay not listed and role does not clearly support CEO, President, or C-suite executive');
    }
  }

  // 5. Determine Supporting Highlights & Biggest Honest Gap
  const supportingHighlights: string[] = [];
  let biggestGap = "Specific industry vertical domain nuances (Debra brings 20+ years in de novo banking & regulated financial services).";

  if (textToScan.includes('board') || textToScan.includes('governance') || textToScan.includes('minutes')) {
    supportingHighlights.push("Secretary of the Board at Integro Bank: drafted minutes, resolutions, and governance framework with 0 regulatory deficiencies.");
  }
  if (textToScan.includes('calendar') || textToScan.includes('schedule') || textToScan.includes('travel')) {
    supportingHighlights.push("Manages 100+ weekly executive appointments across multiple time zones with 0 scheduling conflicts.");
  }
  if (textToScan.includes('briefing') || textToScan.includes('agenda') || textToScan.includes('materials')) {
    supportingHighlights.push("Delivers comprehensive daily executive briefing books, accelerating briefing turnaround by 30%.");
  }
  if (textToScan.includes('event') || textToScan.includes('conference') || textToScan.includes('summit')) {
    supportingHighlights.push("Orchestrated networking and high-level summits for 200+ attendees with 95%+ satisfaction rating.");
  }
  if (textToScan.includes('regulat') || textToScan.includes('audit') || textToScan.includes('compliance')) {
    supportingHighlights.push("Primary liaison for 50+ banking regulators and auditors with a spotless zero-deficiency examination history.");
  }

  // Identify honest gaps (Rule 2d: name one honest gap, like industry or tool requirement)
  if (textToScan.includes('health') || textToScan.includes('clinical') || textToScan.includes('hospital')) {
    biggestGap = "Healthcare/clinical sector experience (Debra's background is deeply rooted in regulated commercial banking and community foundation leadership).";
  } else if (textToScan.includes('semiconductor') || textToScan.includes('hardware') || textToScan.includes('engineering')) {
    biggestGap = "Semiconductor manufacturing sector nuances (her career is centered in regulated financial institutions and high-growth incubator operations).";
  } else if (textToScan.includes('concur') || textToScan.includes('navan') || textToScan.includes('workday')) {
    biggestGap = "Enterprise travel/expense ERP software (Concur/Workday); she is advanced in Microsoft Office, QuickBooks, and rigorous corporate recordkeeping.";
  } else if (textToScan.includes('public company') || textToScan.includes('sec filings')) {
    biggestGap = "Large-cap public company SEC filing mechanics (her regulatory expertise is in state and federal de novo banking supervision and FINRA/SEC broker-dealer office compliance).";
  }

  // 6. Fit Determination
  const isDisqualified = disqualificationReasons.length > 0;
  let fit: FitLevel = 'Disqualified';
  let recommendedAction: 'Apply' | 'Review' | 'Skip' | 'Needs Debra' = 'Skip';

  if (!isDisqualified) {
    if (titleMatch && locationMatch && payMatch && isCSuiteSupport) {
      fit = 'High';
      recommendedAction = 'Apply';
    } else {
      fit = 'Medium';
      recommendedAction = 'Review';
    }
  } else {
    const hasScamOrRedFlag = disqualificationReasons.some(r => r.includes('Scam') || r.includes('privacy risk'));
    if (hasScamOrRedFlag) {
      recommendedAction = 'Needs Debra';
    } else {
      recommendedAction = 'Skip';
    }
  }

  const scoreExplanation = isDisqualified
    ? `Disqualified by ${disqualificationReasons.length} rule guardrails: ${disqualificationReasons.join('; ')}`
    : `${fit}-Fit Match: Meets all executive title, Phoenix metro location, and $90k+ compensation criteria without forbidden triggers.`;

  return {
    fit,
    titleMatch,
    locationMatch,
    payMatch,
    isDisqualified,
    disqualificationReasons,
    biggestGap,
    supportingHighlights: supportingHighlights.slice(0, 3),
    recommendedAction,
    scoreExplanation
  };
}
