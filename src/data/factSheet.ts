export interface DebraFactSheet {
  contact: {
    name: string;
    location: string;
    phone: string;
    email: string;
    titleLine: string;
    resumeFileName: string;
  };
  executiveSummary: string[];
  keyMetrics: {
    label: string;
    value: string;
    context: string;
  }[];
  experience: {
    role: string;
    organization: string;
    location: string;
    period: string;
    achievements: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
  };
  licenses: string[];
  verifiedTools: string[];
  verifiedCompetencies: string[];
  forbiddenClaims: {
    category: string;
    items: string[];
    rule: string;
  }[];
}

export const DEBRA_FACT_SHEET: DebraFactSheet = {
  contact: {
    name: "Debra Friednash",
    location: "Scottsdale, AZ 85253",
    phone: "480-717-0553",
    email: "denvertrad@aol.com",
    titleLine: "Corporate Secretary & Executive Assistant to the CEO | Board & Governance Support",
    resumeFileName: "Debra_Friednash_Resume_1026a.pdf"
  },
  executiveSummary: [
    "20+ years supporting CEOs and boards in regulated financial services.",
    "Founding team member of a Phoenix de novo bank with a zero-deficiency regulatory record.",
    "Manages 100+ weekly appointments across time zones with zero scheduling conflicts."
  ],
  keyMetrics: [
    { label: "Regulatory Record", value: "0 Deficiencies", context: "Built governance framework for de novo bank with flawless regulatory audits" },
    { label: "Calendar Precision", value: "0 Conflicts", context: "Manages 100+ weekly executive appointments across multiple time zones" },
    { label: "Meeting Attendance", value: "98%", context: "Consistent executive and board quorum tracking and attendance delivery" },
    { label: "Briefing Velocity", value: "30% Faster", context: "Accelerated daily executive briefing book assembly and dispatch" },
    { label: "Calendar Triage", value: "40+ Weekly", context: "Rigorous executive gatekeeping aligned to CEO strategic priorities" },
    { label: "Incubator Growth", value: "+40%", context: "Expanded program participation at Chandler Innovations Incubator" },
    { label: "Event Satisfaction", value: "95%+", context: "Orchestrated large-scale corporate and community events for 200+ attendees" }
  ],
  experience: [
    {
      role: "Corporate Secretary & Executive Assistant to the CEO",
      organization: "Integro Bank",
      location: "Phoenix, AZ",
      period: "Oct 2021 – Present",
      achievements: [
        "Founding team member of a de novo community bank, supporting the CEO and five C-suite executives from inception.",
        "Manage 100+ weekly appointments and multi-time-zone travel itineraries with zero scheduling conflicts.",
        "Assemble and deliver comprehensive daily executive briefing books.",
        "Serve as Secretary of the Board: draft minutes, formal resolutions, board agendas, and action-item tracking.",
        "Engineered the institutional governance and compliance framework behind a zero-deficiency regulatory audit track record.",
        "Founder, President & Director of Integro Bank Foundation, establishing and directing the bank's philanthropic foundation.",
        "Act as primary confidential liaison for 50+ banking regulators, institutional partners, and board members with absolute discretion."
      ]
    },
    {
      role: "Operations Liaison & Chief Assistant to the CEO",
      organization: "Chandler Innovations Incubator",
      location: "Chandler, AZ",
      period: "Jun 2019 – Sep 2021",
      achievements: [
        "Fostered strategic relationships across 100+ high-growth tech entrepreneurs and City of Chandler municipal officials.",
        "Authored organizational SOPs, recruited core operational staff, and administered payroll and commercial insurance policies.",
        "Executed high-impact networking summits and demo days for 200+ attendees with 95%+ attendee satisfaction."
      ]
    },
    {
      role: "Office Manager & Executive Assistant",
      organization: "Scottsdale Capital Advisors",
      location: "Scottsdale, AZ",
      period: "Jan 2013 – Jun 2017",
      achievements: [
        "Provided white-glove executive support for high-net-worth clientele and executive leadership.",
        "Enforced rigorous FINRA and SEC compliance guidelines across daily office procedures, supporting zero-deficiency regulatory examinations."
      ]
    },
    {
      role: "Vice President of Operations",
      organization: "EJM Advisors",
      location: "Denver, CO",
      period: "Jun 2011 – Jan 2013",
      achievements: [
        "Optimized firm profitability and operational cadence through strategic resource planning at a financial PR firm.",
        "Cultivated media, institutional, and B2B corporate partnerships."
      ]
    }
  ],
  education: {
    degree: "Bachelor of Administration, History & Public Relations",
    institution: "University of Denver",
    location: "Denver, CO"
  },
  licenses: [
    "Licensed Notary Public (State of Arizona)",
    "FINRA Series 7 & 63 (formerly held in good standing)"
  ],
  verifiedTools: [
    "Microsoft Office Suite (Advanced: Word, Excel, PowerPoint, Outlook)",
    "Zoom Video Communications",
    "Intuit QuickBooks"
  ],
  verifiedCompetencies: [
    "Complex multi-time-zone calendar & travel coordination",
    "Board of Directors administration & formal minute taking",
    "Executive briefing book compilation & agenda design",
    "High-stakes confidentiality & discretion",
    "Regulator, auditor & institutional stakeholder liaison",
    "Corporate governance & compliance frameworks"
  ],
  forbiddenClaims: [
    {
      category: "Unauthorized Software & Tech Tools",
      items: ["Salesforce", "Slack", "Microsoft Teams", "SharePoint", "Concur / Navan", "Diligent", "Workday", "Any AI Tool / LLM", "Asana / Monday / Jira"],
      rule: "Never claim or imply proficiency in these tools. If job requires them, honestly disclose as an onboarding growth area."
    },
    {
      category: "Forbidden Domain Experience",
      items: ["Investment Banking", "Bond / Securities Trading", "Expense-Report Processing", "International Travel Planning", "Healthcare / Clinical", "Government / Clearance"],
      rule: "Never claim investment banking, trading, or clinical experience. Frame background strictly as regulated financial services and de novo banking."
    }
  ]
};
