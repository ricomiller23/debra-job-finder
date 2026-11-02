import { JobListing, EvaluationResult } from '../types/job';
import { DEBRA_FACT_SHEET } from '../data/factSheet';

export function generateCoverLetter(job: JobListing, evaluation: EvaluationResult): string {
  const recipient = job.hiringManager && job.hiringManager.trim().length > 0 && !job.hiringManager.includes('Hiring Team')
    ? job.hiringManager
    : `Hiring Team at ${job.company}`;

  const salutation = recipient.startsWith('Hiring Team')
    ? `Dear ${recipient},`
    : `Dear ${recipient},`;

  // Paragraph 1: Role and why she fits (1-2 sentences)
  const p1 = `I am writing to express my interest in the ${job.title} position at ${job.company}. With more than 20 years of experience providing high-level operational and governance support to CEOs and corporate boards in regulated environments across the Phoenix metropolitan area, I am well prepared to manage your executive office with discretion and administrative rigor.`;

  // Paragraph 2: 2-3 strongest matches with real fact sheet numbers
  let p2 = "";
  const descLower = job.description.toLowerCase();
  
  if (descLower.includes('board') || descLower.includes('governance') || descLower.includes('secretary')) {
    p2 = `In my current role as Corporate Secretary and Executive Assistant to the CEO at Integro Bank in Phoenix, I established the governance and compliance framework behind our zero-deficiency regulatory examination track record. I manage all Board of Directors proceedings, including drafting board resolutions, formal minutes, committee agendas, and post-meeting action item logs, while maintaining a 98% meeting attendance rate across executive sessions.`;
  } else {
    p2 = `As Corporate Secretary and Executive Assistant to the CEO at Integro Bank in Phoenix, I manage 100+ weekly executive appointments across multiple time zones with zero scheduling conflicts. Additionally, I curate comprehensive daily executive briefing books that reduced our leadership team's preparation time by 30%, triaging over 40 weekly meeting requests against strategic priorities.`;
  }

  // Paragraph 3: Stakeholder, confidentiality, board, or event experience
  let p3 = "";
  if (descLower.includes('event') || descLower.includes('conference') || descLower.includes('summit')) {
    p3 = `Beyond board and executive calendar administration, I have orchestrated large-scale leadership conferences and corporate events for more than 200 attendees with a 95%+ satisfaction rating. As the primary liaison for more than 50 bank regulators, board trustees, and institutional partners, I operate with absolute confidentiality on sensitive leadership matters.`;
  } else {
    p3 = `Serving as the primary liaison for more than 50 regulators, board members, and executive partners, I exercise complete discretion on material non-public matters. My operational background also includes authoring organizational SOPs, overseeing corporate insurance administration, and coordinating multi-time-zone travel itineraries for five C-suite leaders.`;
  }

  // Paragraph 4: One honest sentence naming the biggest gap, plus short close with contact info
  const gapSentence = evaluation.biggestGap 
    ? `While my background is centered in regulated commercial banking and community foundations rather than ${evaluation.biggestGap.replace(/\.$/, '')}, my core governance discipline and advanced Microsoft Office capabilities allow me to integrate seamlessly into your operational cadence.`
    : `While my background has been established in commercial banking governance rather than your specific sector, my institutional precision and gatekeeping standards ensure immediate productivity.`;

  const p4 = `${gapSentence} I would welcome the opportunity to discuss how my background aligns with your leadership needs. You can reach me directly at 480-717-0553 or denvertrad@aol.com.`;

  return `${salutation}

${p1}

${p2}

${p3}

${p4}

Sincerely,

Debra Friednash
Scottsdale, AZ 85253
480-717-0553 | denvertrad@aol.com`;
}
