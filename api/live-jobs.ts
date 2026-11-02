import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const keyword = (req.query.keyword as string) || 'Executive Assistant';
  const location = (req.query.location as string) || 'Scottsdale, Arizona, United States';

  const kwEncoded = encodeURIComponent(keyword);
  const locEncoded = encodeURIComponent(location);
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${kwEncoded}&location=${locEncoded}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(200).json({
        success: false,
        error: `LinkedIn responded with ${response.status}`,
        fallback: true
      });
    }

    const html = await response.text();

    const cardRegex = /<div class="[^"]*job-search-card[^"]*"[^>]*data-entity-urn="urn:li:jobPosting:(\d+)"/g;
    const titleRegex = /<h3 class="base-search-card__title">\s*([\s\S]*?)\s*<\/h3>/g;
    const companyRegex = /<h4 class="base-search-card__subtitle">\s*(?:<a[^>]*>)?\s*([\s\S]*?)\s*(?:<\/a>)?\s*<\/h4>/g;
    const locationRegex = /<span class="job-search-card__location">\s*([\s\S]*?)\s*<\/span>/g;
    const linkRegex = /<a class="base-card__full-link[^"]*" href="(.*?)"/g;

    const cards: string[] = [];
    let match;
    while ((match = cardRegex.exec(html)) !== null) {
      cards.push(match[1]);
    }

    const titles: string[] = [];
    while ((match = titleRegex.exec(html)) !== null) {
      titles.push(match[1].trim());
    }

    const companies: string[] = [];
    while ((match = companyRegex.exec(html)) !== null) {
      companies.push(match[1].trim());
    }

    const locations: string[] = [];
    while ((match = locationRegex.exec(html)) !== null) {
      locations.push(match[1].trim());
    }

    const links: string[] = [];
    while ((match = linkRegex.exec(html)) !== null) {
      links.push(match[1].split('?')[0]);
    }

    const count = Math.min(cards.length, titles.length, companies.length, locations.length);
    const jobs = [];

    for (let i = 0; i < count; i++) {
      jobs.push({
        id: `li-${cards[i]}`,
        jobId: cards[i],
        title: titles[i],
        company: companies[i],
        location: locations[i],
        url: links[i] || `https://www.linkedin.com/jobs/view/${cards[i]}`,
        workplaceType: locations[i].toLowerCase().includes('remote') ? 'Remote' : 'Hybrid',
        metroArea: locations[i].toLowerCase().includes('scottsdale') ? 'Scottsdale' : 'Phoenix',
        payString: 'Pay not listed (CEO / Executive level support)',
        payListed: false,
        source: 'LinkedIn (Live Search API)',
        postedDate: new Date().toISOString().split('T')[0]
      });
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      count: jobs.length,
      jobs
    });
  } catch (error: any) {
    return res.status(200).json({
      success: false,
      error: error.message,
      fallback: true
    });
  }
}
