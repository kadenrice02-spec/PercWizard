export const navItems = ["Home", "Dashboard", "Signals", "Sources", "Reports", "GitHub"];

export const signals = [
  {
    ticker: "DELL",
    company: "Dell Technologies",
    source: "White House remarks",
    headline: "Mentioned in AI infrastructure discussion",
    category: "AI / Data Centers",
    impact: "High",
    confidence: 87,
    move: "+27.4%",
    time: "2 weeks ago",
    price: "$323.44",
    reason:
      "Government comment tied to domestic AI infrastructure, servers, and data center buildout. Watch for follow-up grants, contracts, or agency purchases.",
  },
  {
    ticker: "PLTR",
    company: "Palantir",
    source: "Defense contract feed",
    headline: "Software modernization award detected",
    category: "Defense Software",
    impact: "High",
    confidence: 82,
    move: "+8.9%",
    time: "3 days ago",
    price: "$151.20",
    reason:
      "Government software award with a public-company recipient. Signal strength increases if contract value is material to revenue.",
  },
  {
    ticker: "SMCI",
    company: "Super Micro Computer",
    source: "Congress hearing calendar",
    headline: "Data center energy hearing scheduled",
    category: "AI Hardware",
    impact: "Medium",
    confidence: 71,
    move: "+4.2%",
    time: "Upcoming",
    price: "$45.10",
    reason:
      "Upcoming hearing could move sentiment around AI hardware, cooling, energy demand, and grid infrastructure names.",
  },
  {
    ticker: "OKLO",
    company: "Oklo",
    source: "Federal energy announcement",
    headline: "Nuclear-backed data center policy discussion",
    category: "Energy / Nuclear",
    impact: "Speculative",
    confidence: 64,
    move: "+12.1%",
    time: "1 week ago",
    price: "$52.80",
    reason:
      "Policy attention around nuclear power and AI data centers can move smaller speculative names sharply, but risk is higher.",
  },
  {
    ticker: "LMT",
    company: "Lockheed Martin",
    source: "Defense award notice",
    headline: "Large aerospace and missile-defense award posted",
    category: "Defense",
    impact: "Medium",
    confidence: 76,
    move: "+2.3%",
    time: "Yesterday",
    price: "$466.90",
    reason:
      "Defense awards can support backlog and sentiment, especially when tied to long-term procurement programs.",
  },
];

export const upcoming = [
  { day: "Mon", title: "Fed speeches and testimony", tag: "Macro", risk: "Medium" },
  { day: "Tue", title: "House AI / technology hearing", tag: "AI", risk: "High" },
  { day: "Wed", title: "Midweek catalyst report", tag: "Report", risk: "High" },
  { day: "Thu", title: "SEC S-1 / IPO filing scan", tag: "IPO", risk: "Medium" },
  { day: "Fri", title: "Full weekly catalyst report", tag: "Report", risk: "High" },
];

export const watchlist = [
  { ticker: "DELL", company: "Dell", mentions: 8, score: 91, sector: "AI Servers" },
  { ticker: "NVDA", company: "Nvidia", mentions: 12, score: 89, sector: "AI Chips" },
  { ticker: "PLTR", company: "Palantir", mentions: 6, score: 85, sector: "Defense AI" },
  { ticker: "LMT", company: "Lockheed Martin", mentions: 9, score: 78, sector: "Defense" },
  { ticker: "VRT", company: "Vertiv", mentions: 5, score: 74, sector: "Data Centers" },
  { ticker: "OKLO", company: "Oklo", mentions: 4, score: 69, sector: "Nuclear Energy" },
];

export const sources = [
  {
    name: "White House remarks",
    type: "Official statements",
    status: "Active",
    description: "Tracks presidential remarks, executive orders, fact sheets, and major policy pushes.",
  },
  {
    name: "Congress.gov",
    type: "Bills and hearings",
    status: "Active",
    description: "Tracks bills, committees, hearings, nominations, and policy movement by sector.",
  },
  {
    name: "SAM.gov",
    type: "Contract opportunities",
    status: "Active",
    description: "Tracks open federal opportunities that may benefit public contractors and suppliers.",
  },
  {
    name: "USAspending",
    type: "Award data",
    status: "Active",
    description: "Tracks awarded contracts, grants, and loans by agency, company, and dollar amount.",
  },
  {
    name: "SEC EDGAR",
    type: "IPOs and filings",
    status: "Active",
    description: "Tracks S-1, F-1, 10-K, 10-Q, 8-K, and unusual filing activity.",
  },
  {
    name: "Federal Reserve",
    type: "Macro calendar",
    status: "Active",
    description: "Tracks Fed speeches, testimony, rate decisions, and economic releases.",
  },
];

export const reportItems = [
  {
    title: "Midweek report",
    schedule: "Every Wednesday at 5:00 PM Pacific",
    description: "Catches early-week government catalysts before the week ends.",
    enabled: true,
  },
  {
    title: "Full weekly report",
    schedule: "Every Friday at 5:00 PM Pacific",
    description: "Summarizes the whole week after market close with what to watch next.",
    enabled: true,
  },
  {
    title: "High-impact alert",
    schedule: "Instant when confidence score is 85+",
    description: "For large official mentions, big contract awards, or IPO filings tied to hot sectors.",
    enabled: false,
  },
];

export const repoFiles = [
  "app/page.tsx",
  "lib/govsignal-data.js",
  "lib/government-sources.ts",
  "lib/stock-prices.ts",
  "lib/report-generator.ts",
  ".github/workflows/reports.yml",
];

export const setupSteps = [
  "Create a GitHub repo named govsignal",
  "Push the Next.js website code",
  "Add API keys as GitHub secrets",
  "Use GitHub Actions for scheduled scans",
  "Deploy the repo to Vercel",
];

export function filterSignals(signalList, query = "", category = "All") {
  return signalList.filter((signal) => {
    const haystack = `${signal.ticker} ${signal.company} ${signal.headline} ${signal.source} ${signal.category}`.toLowerCase();
    const matchesSearch = haystack.includes(query.trim().toLowerCase());
    const matchesCategory = category === "All" || signal.category === category;
    return matchesSearch && matchesCategory;
  });
}

export function getSignalCategories(signalList) {
  return ["All", ...new Set(signalList.map((signal) => signal.category))];
}
