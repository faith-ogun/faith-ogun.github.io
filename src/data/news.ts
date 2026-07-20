// Single source of truth for News. Both the News page and the landing page's
// "Recent dispatches" strip read from here, so adding an item in one place
// updates everywhere automatically.
//
// date  : ISO (YYYY-MM-DD) — used for sorting only
// display: the label shown on the card, e.g. "Jun 2026"
// Mark the current headline item with `featured: true` (the News page shows it
// as the big card; the landing strip pins it first).

export interface NewsLink {
  href: string;
  label: string;
}

export interface NewsItem {
  date: string;
  display: string;
  title: string;
  venue: string;
  tag: string;
  img: string;
  featured?: boolean;
  links: NewsLink[];
}

export const news: NewsItem[] = [
  { date: '2026-07-17', display: 'Jul 2026', title: 'First place, Built with Claude: Life Sciences — NCypher', venue: 'Researcher track winner · Anthropic × Cerebral Valley, with Gladstone Institutes · 1 of 299 projects · an honest MCP triage tool for non-coding cancer variants: a regulatory-activity score, the mechanism a variant breaks, and a confidence flag', tag: 'Award', img: '/assets/news/ncypher-winner.png', featured: true, links: [{ href: 'https://cerebralvalley.ai/e/built-with-claude-life-sciences', label: 'Event' }, { href: 'https://github.com/faith-ogun/ncypher', label: 'Repo' }, { href: 'https://www.youtube.com/watch?v=0EQfVwYXFG8', label: 'Demo' }] },
  { date: '2026-07-16', display: 'Jul 2026', title: 'First place, Google Cloud Rapid Agent Hackathon — Unravel', venue: 'Fivetran track winner · sponsored by Google (Devpost) · a five-agent system on Gemini 3.1 and the Agent Development Kit that recomputes a calibrated ACMG probability when a variant is reclassified, then drafts patient recontact — clinician in the loop, nothing auto-sends', tag: 'Award', img: '/assets/news/unravel-winner.png', links: [{ href: 'https://github.com/faith-ogun/unravel', label: 'Repo' }, { href: 'https://www.youtube.com/watch?v=xJBBBiFeQWk', label: 'Demo' }, { href: 'https://devpost.com/software/unravel-7ak8lf', label: 'Devpost' }] },
  { date: '2026-07-15', display: 'Jul 2026', title: 'Onkydra opens its waitlist', venue: 'The in-silico stratification workspace for rare-cancer drug development · drop in a target, it simulates the cohort, predicts the responder subgroup with confidence intervals, ranks resistance pathways and cites every claim · beachhead H3 K27M diffuse midline glioma · a Gemini XPRIZE 2026 entry · research use only', tag: 'Launch', img: '/assets/news/onkydra-launch.png', links: [{ href: 'https://onkydra.com', label: 'Waitlist' }] },
  { date: '2026-06-30', display: 'Jun 2026', title: 'Attended the Unaite Fellowship for AI in Biology Open House', venue: 'Unaite × Singular · AI × Biology research fellowship · Paris', tag: 'Event', img: '/assets/news/unaite.jpeg', links: [{ href: 'https://luma.com/d027eojb?tk=JLjeKh', label: 'Event' }, { href: 'https://www.linkedin.com/posts/faith-ogundimu_ycombinator-startupschool-aiinbiology-activity-7478125248920416257-1Mrs', label: 'LinkedIn' }] },
  { date: '2026-06-29', display: 'Jun 2026', title: 'Attended YC Startup School (Paris)', venue: 'Accepted in under 30 minutes — one of 100 participants from over 4,000 applications', tag: 'Programme', img: '/assets/news/yc.jpeg', links: [{ href: 'https://events.ycombinator.com/yc-paris-sus', label: 'Event' }, { href: 'https://www.linkedin.com/posts/faith-ogundimu_ycombinator-startupschool-aiinbiology-activity-7478125248920416257-1Mrs', label: 'LinkedIn' }] },
  { date: '2026-05-27', display: 'May 2026', title: 'Presented at the AICC Annual Symposium', venue: 'Using Neural Networks and Foundation Models to Understand Gene Regulation in the MCF-7 Breast Cancer Cell Line', tag: 'Talk', img: '/assets/news/aicc_poster.jpeg', links: [{ href: 'https://allirelandchromatinconsortium.ie/annual-meeting/', label: 'Event' }] },
  { date: '2026-04-20', display: 'Apr 2026', title: 'Honourable Mention, 11,885 participants — Relay', venue: 'Google Gemini Live Agent Challenge', tag: 'Award', img: '/assets/news/relay-honorable-mention.png', links: [{ href: 'https://devpost.com/software/relay-real-time-voice-vision-lab-tutor-for-electronics', label: 'Devpost' }, { href: 'https://www.linkedin.com/feed/update/urn:li:activity:7468137194097053696/', label: 'LinkedIn' }] },
  { date: '2026-04-15', display: 'Apr 2026', title: 'Accepted to Imperial Robotics Summer School 2026', venue: 'Imperial College London · 20–24 July 2026', tag: 'Programme', img: '/assets/news/imerial-robotics.png', links: [{ href: 'https://www.imperial.ac.uk/robotics/imperial-robotics-summer-school/programme/', label: 'Programme' }, { href: 'https://www.linkedin.com/feed/update/urn:li:activity:7454423116253913088/', label: 'LinkedIn' }] },
  { date: '2026-04-10', display: 'Apr 2026', title: 'France Excellence Research Residency Grant (€1,850)', venue: 'French Embassy in Ireland · 9 laureates nationally · one-month residency at Institut Curie (CUBIC)', tag: 'Grant', img: '/assets/news/france-excellence.png', links: [{ href: 'https://ie.diplomatie.gouv.fr/en/results-2026-france-excellence-research-residency-grant', label: 'Results' }, { href: 'https://www.linkedin.com/feed/update/urn:li:activity:7447553955448000512/', label: 'LinkedIn' }] },
  { date: '2026-03-20', display: 'Mar 2026', title: 'Selected for the Harvard Health Systems Innovation Lab Hackathon', venue: 'Harvard University · 125 participants selected from 2,000+ applications', tag: 'Selection', img: '/assets/news/harvard-health-systems-image.jpeg', links: [{ href: 'https://www.linkedin.com/feed/update/urn:li:activity:7449460695865278464/', label: 'LinkedIn' }] },
  { date: '2026-03-10', display: 'Mar 2026', title: 'Top 50 Winner, 4,097 submissions — RegulonForge', venue: 'Google DeepMind Vibe Code with Gemini 3 Pro Hackathon', tag: 'Award', img: '/assets/news/regulon-forge.png', links: [{ href: 'https://www.kaggle.com/competitions/gemini-3/writeups/regulonforge', label: 'Writeup' }] },
  { date: '2026-02-15', display: 'Feb 2026', title: '4th Place Finalist, 1,500 participants — HealthCallPilot', venue: 'Hack-Nation 4th Edition · ElevenLabs Track', tag: 'Award', img: '/assets/news/healthcallpilot-image.png', links: [] },
  { date: '2025-10-25', display: 'Oct 2025', title: "Dean's Honours List — ranked 2nd in cohort (Salutatorian)", venue: 'Dublin City University', tag: 'Honour', img: '/assets/news/Deans.png', links: [{ href: 'https://www.dcu.ie/fsh_dean_list', label: "Dean's List" }] },
  { date: '2025-10-20', display: 'Oct 2025', title: 'Google Ireland Hackathon by BGN — TestBuddy (2nd Place)', venue: 'Google Ireland · 500+ applicants', tag: 'Award', img: '/assets/news/google-hackathon.jpeg', links: [{ href: 'https://www.linkedin.com/feed/update/urn:li:activity:7386066213094830080/', label: 'LinkedIn' }] },
  { date: '2025-10-10', display: 'Oct 2025', title: 'Perfect 30/30 at the Conway Institute Festival', venue: 'BioSLATE poster commendation', tag: 'Award', img: '/assets/news/conway.jpeg', links: [{ href: 'https://www.linkedin.com/posts/faith-ogundimu_thrilled-to-share-that-the-poster-i-presented-activity-7379793537678090240-22VR', label: 'LinkedIn' }] },
  { date: '2025-08-15', display: 'Aug 2025', title: 'Best Lay Presentation Award', venue: 'Breakthrough Cancer Research', tag: 'Award', img: '/assets/news/best-lay.jpeg', links: [{ href: 'https://www.linkedin.com/posts/faith-ogundimu_syntheticlethality-ovariancancer-precisiononcology-activity-7368648724866158592-ujIM', label: 'LinkedIn' }] },
  { date: '2025-06-15', display: 'Jun 2025', title: 'Research Ireland Postgraduate Grant (€136,000)', venue: 'Nationally competitive award · 18% success rate', tag: 'Grant', img: '/assets/news/government-of-ireland.png', links: [{ href: 'https://www.rcsi.com/dublin/news-and-events/news/news-article/2026/03/researchers-secure-early-career-funding-boost-in-research-ireland-government-of-ireland-programme', label: 'RCSI News' }] },
];

// newest-first (by ISO date)
export const newsByDate: NewsItem[] = [...news].sort((a, b) => b.date.localeCompare(a.date));

// the current headline (falls back to the newest if nothing is flagged)
export const featuredNews: NewsItem = news.find((n) => n.featured) ?? newsByDate[0];

// landing "Recent dispatches": featured first, then the next two most recent
export const recentDispatches: NewsItem[] = [
  featuredNews,
  ...newsByDate.filter((n) => n !== featuredNews),
].slice(0, 3);
