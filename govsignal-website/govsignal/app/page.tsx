"use client";

import React, { useMemo, useState } from "react";
import {
  filterSignals,
  getSignalCategories,
  navItems,
  reportItems,
  repoFiles,
  setupSteps,
  signals,
  sources,
  upcoming,
  watchlist,
} from "../lib/govsignal-data";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Button({ children, className = "", variant = "default", ...props }: any) {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
    outline: "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
  };

  return (
    <button className={cn(base, variants[variant] || variants.default, className)} {...props}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }: any) {
  return <div className={cn("rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl", className)}>{children}</div>;
}

const iconPaths: Record<string, string> = {
  alert: "M12 3 2 21h20L12 3zm0 6v5m0 4h.01",
  arrowRight: "M5 12h14M13 5l7 7-7 7",
  arrowUpRight: "M7 17 17 7M9 7h8v8",
  bell: "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m2 3h2",
  briefcase: "M4 8h16v11H4V8zm5 0V5h6v3M4 12h16",
  calendar: "M7 3v4M17 3v4M4 8h16M5 5h14v16H5V5z",
  check: "M20 6 9 17l-5-5",
  chevronRight: "M9 18l6-6-6-6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14v5l4 2",
  database: "M4 7c0-2 16-2 16 0s-16 2-16 0zm0 0v5c0 2 16 2 16 0V7M4 12v5c0 2 16 2 16 0v-5",
  external: "M14 3h7v7M10 14 21 3M21 14v6H3V3h6",
  file: "M6 2h9l5 5v15H6V2zm9 0v6h5M9 13h6M9 17h6",
  filter: "M4 5h16l-6 7v5l-4 2v-7L4 5z",
  github: "M12 2a10 10 0 0 0-3 19c.5.1.7-.2.7-.5v-2c-3 .7-3.7-1.3-3.7-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.9 3.1 19 3.4 19 3.4c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v2.6c0 .3.2.6.8.5A10 10 0 0 0 12 2z",
  landmark: "M3 10h18L12 4 3 10zm3 2v7M10 12v7M14 12v7M18 12v7M4 21h16",
  lineChart: "M4 19h16M6 16l4-5 4 3 5-8",
  mail: "M4 6h16v12H4V6zm0 0 8 7 8-7",
  menu: "M4 6h16M4 12h16M4 18h16",
  newspaper: "M4 5h14v14H4V5zm14 3h2v11h-2M7 9h6M7 13h8M7 17h4",
  pie: "M12 2v10h10A10 10 0 1 1 12 2zm3 0a10 10 0 0 1 7 7h-7V2z",
  radar: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-4a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-6 5-7",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm6-2 4 4",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-5",
  sparkles: "M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z",
  trending: "M3 17l6-6 4 4 8-8M15 7h6v6",
  x: "M6 6l12 12M18 6 6 18",
  zap: "M13 2 3 14h8l-2 8 10-12h-8l2-8z",
  chart: "M4 19V5M8 19v-6M12 19V9M16 19v-9M20 19V7",
};

function Icon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={iconPaths[name] || iconPaths.sparkles} />
    </svg>
  );
}

export default function GovSignalWebsite() {
  const [activePage, setActivePage] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => getSignalCategories(signals), []);
  const filteredSignals = useMemo(() => filterSignals(signals, query, selectedCategory), [query, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-16rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-14rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header activePage={activePage} setActivePage={setActivePage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        {activePage === "Home" && <HomePage setActivePage={setActivePage} />}
        {activePage === "Dashboard" && <DashboardPage setActivePage={setActivePage} />}
        {activePage === "Signals" && <SignalsPage query={query} setQuery={setQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} filteredSignals={filteredSignals} />}
        {activePage === "Sources" && <SourcesPage />}
        {activePage === "Reports" && <ReportsPage />}
        {activePage === "GitHub" && <GitHubPage />}
      </div>
    </div>
  );
}

function Header({ activePage, setActivePage, mobileOpen, setMobileOpen }: any) {
  return (
    <header className="sticky top-0 z-40 py-4">
      <div className="rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setActivePage("Home")} className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25"><Icon name="radar" size={22} /></div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold tracking-tight">GovSignal</span>
                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-0.5 text-xs font-medium text-cyan-200">Beta</span>
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">Government catalysts for stocks and IPOs</p>
            </div>
          </button>

          <nav className="hidden items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1 md:flex">
            {navItems.map((item: string) => (
              <button key={item} onClick={() => setActivePage(item)} className={cn("rounded-xl px-4 py-2 text-sm font-medium transition", activePage === item ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white")}>{item}</button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="outline"><Icon name="bell" size={17} /> Alerts</Button>
            <Button onClick={() => setActivePage("GitHub")} variant="outline"><Icon name="github" size={17} /> GitHub</Button>
            <Button onClick={() => setActivePage("Reports")}>Reports</Button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 md:hidden" aria-label="Toggle navigation">
            {mobileOpen ? <Icon name="x" size={21} /> : <Icon name="menu" size={21} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 md:hidden">
            {navItems.map((item: string) => (
              <button key={item} onClick={() => { setActivePage(item); setMobileOpen(false); }} className={cn("rounded-2xl px-4 py-3 text-left text-sm font-medium", activePage === item ? "bg-cyan-400 text-slate-950" : "bg-white/5 text-slate-200")}>{item}</button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function HomePage({ setActivePage }: any) {
  return (
    <main className="pb-16 pt-8">
      <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm font-medium text-cyan-100"><Icon name="sparkles" size={16} /> Track market-moving government signals</div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">Find stocks moving from government announcements before they become obvious.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">GovSignal watches official remarks, contracts, grants, hearings, SEC filings, IPO activity, and major policy events — then connects them to public companies, sectors, and watchlist alerts.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => setActivePage("Dashboard")} className="h-12 px-6 text-base">Open dashboard <Icon name="arrowRight" size={18} /></Button>
            <Button onClick={() => setActivePage("Sources")} variant="outline" className="h-12 px-6 text-base">View sources</Button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Signals tracked" value="42/wk" />
            <MiniStat label="Reports" value="Wed + Fri" />
            <MiniStat label="Coverage" value="Stocks + IPOs" />
          </div>
        </div>

        <Card className="overflow-hidden rounded-[2rem] bg-white/[0.05] shadow-cyan-950/40">
          <div className="border-b border-white/10 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-semibold text-slate-100">Top catalyst today</div><div className="text-xs text-slate-500">Official source + unusual move</div></div>
              <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">High confidence</div>
            </div>
          </div>
          <div className="p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-xl bg-white px-3 py-1 text-sm font-bold text-slate-950">DELL</div>
                <h3 className="text-2xl font-semibold text-white">AI infrastructure mention detected</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Official remarks referenced domestic AI infrastructure. Related tickers are being watched for follow-up contracts, agency spending, and data center demand.</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-200"><div className="text-xs text-emerald-300/80">Move</div><div className="text-lg font-bold">+27.4%</div></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <SignalDetail icon="landmark" label="Source" value="White House" />
              <SignalDetail icon="lineChart" label="Sector" value="AI Servers" />
              <SignalDetail icon="shield" label="Score" value="87/100" />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard icon="file" title="Official-source scanning" text="Track government sites directly instead of relying only on social media or headlines." />
        <FeatureCard icon="trending" title="Ticker impact scoring" text="Connect mentions to public companies, then rank by confidence, price action, and source quality." />
        <FeatureCard icon="mail" title="Weekly reports" text="Get a Wednesday midweek report and a Friday full recap with links, tickers, and what to watch." />
      </section>
    </main>
  );
}

function DashboardPage({ setActivePage }: any) {
  return (
    <main className="pb-14 pt-6">
      <PageTitle eyebrow="Dashboard" title="Government catalyst command center" text="A quick view of the strongest signals, upcoming government events, watchlist rankings, and report schedule." />
      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard icon="newspaper" label="Signals this week" value="42" helper="8 high-impact" />
        <MetricCard icon="trending" label="Avg watchlist move" value="+6.8%" helper="since first mention" />
        <MetricCard icon="briefcase" label="Contract value tracked" value="$14.2B" helper="public awards" />
        <MetricCard icon="file" label="IPO filings scanned" value="19" helper="S-1 / F-1 updates" />
      </section>
      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card><div className="p-5"><div className="mb-4 flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold">Highest priority signals</h2><p className="text-sm text-slate-400">Ranked by confidence, catalyst strength, and price reaction.</p></div><Button onClick={() => setActivePage("Signals")} variant="outline">View all <Icon name="chevronRight" size={17} /></Button></div><div className="space-y-3">{signals.slice(0, 3).map((signal: any, index: number) => <SignalCard key={signal.ticker} signal={signal} index={index} compact />)}</div></div></Card>
          <WatchlistTable />
        </div>
        <aside className="space-y-5"><UpcomingCard /><ReportCard /><RiskCard /></aside>
      </section>
    </main>
  );
}

function SignalsPage({ query, setQuery, selectedCategory, setSelectedCategory, categories, filteredSignals }: any) {
  return (
    <main className="pb-14 pt-6">
      <PageTitle eyebrow="Signals" title="Live government signal feed" text="Search and filter official-source catalysts connected to tickers, sectors, IPOs, and market movement." />
      <Card><div className="p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md"><Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ticker, company, topic, source" className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/70 pl-10 pr-3 text-sm outline-none ring-cyan-400/40 transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4" /></div>
          <button className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-sm font-medium text-slate-200 hover:bg-white/10"><Icon name="filter" size={17} /> More filters</button>
        </div>
        <div className="mb-5 flex gap-2 overflow-auto pb-1">{categories.map((category: string) => <button key={category} onClick={() => setSelectedCategory(category)} className={cn("whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition", selectedCategory === category ? "bg-cyan-400 text-slate-950" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10")}>{category}</button>)}</div>
        <div className="space-y-3">{filteredSignals.length > 0 ? filteredSignals.map((signal: any, index: number) => <SignalCard key={signal.ticker + signal.headline} signal={signal} index={index} />) : <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">No signals match that search yet.</div>}</div>
      </div></Card>
    </main>
  );
}

function SourcesPage() {
  return (
    <main className="pb-14 pt-6">
      <PageTitle eyebrow="Sources" title="Tracked government and market sources" text="The site is built around official, high-signal data sources that can be scanned on a schedule." />
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{sources.map((source: any) => <Card key={source.name} className="h-full"><div className="flex h-full flex-col p-5"><div className="mb-4 flex items-start justify-between gap-4"><div className="grid size-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon name="database" size={21} /></div><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">{source.status}</span></div><h3 className="text-lg font-semibold text-white">{source.name}</h3><p className="mt-1 text-sm font-medium text-cyan-200">{source.type}</p><p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{source.description}</p><button className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-cyan-200">Configure source <Icon name="external" size={15} /></button></div></Card>)}</section>
    </main>
  );
}

function ReportsPage() {
  const list = ["Top government mentions by ticker", "New contracts, grants, and awards", "IPO and SEC filing activity", "Upcoming hearings and conferences", "Recent stock price movement", "Confidence score and why it matters"];
  return (
    <main className="pb-14 pt-6">
      <PageTitle eyebrow="Reports" title="Your report schedule" text="Midweek and full weekly reports are set up to keep you updated without watching government feeds all day." />
      <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">{reportItems.map((item: any) => <Card key={item.title}><div className="p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-start gap-4"><div className={cn("grid size-12 place-items-center rounded-2xl", item.enabled ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-slate-400")}>{item.enabled ? <Icon name="check" size={22} /> : <Icon name="bell" size={21} />}</div><div><h3 className="text-lg font-semibold text-white">{item.title}</h3><p className="mt-1 text-sm font-medium text-cyan-200">{item.schedule}</p><p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p></div></div><Button className={item.enabled ? "" : "bg-white/10 text-slate-100 hover:bg-white/15"}>{item.enabled ? "Enabled" : "Turn on"}</Button></div></div></Card>)}</div>
        <Card className="h-fit"><div className="p-5"><div className="mb-4 grid size-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon name="mail" size={22} /></div><h2 className="text-xl font-semibold text-white">What each report includes</h2><div className="mt-5 space-y-3">{list.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2"><Icon name="shield" size={17} className="text-cyan-300" /><span className="text-sm text-slate-300">{item}</span></div>)}</div></div></Card>
      </section>
    </main>
  );
}

function GitHubPage() {
  return (
    <main className="pb-14 pt-6">
      <PageTitle eyebrow="GitHub" title="GitHub-ready project setup" text="Use this page as the developer hub for the repo, deployment checklist, GitHub Actions, and project structure." />
      <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card><div className="p-5"><div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-start gap-4"><div className="grid size-12 place-items-center rounded-2xl bg-white text-slate-950"><Icon name="github" size={24} /></div><div><h2 className="text-xl font-semibold text-white">kadenrice02 / govsignal</h2><p className="mt-1 text-sm text-slate-400">Government catalyst stock tracker built with Next.js, Tailwind, and scheduled reports.</p></div></div><div className="flex flex-wrap gap-2"><Button variant="outline"><Icon name="github" size={17} /> View repo</Button><Button>Connect GitHub</Button></div></div><div className="grid gap-3 md:grid-cols-3"><RepoStat label="Stars" value="0" /><RepoStat label="Commits" value="1" /><RepoStat label="Deploy status" value="Ready" /></div></div></Card>
          <Card><div className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-white">Recommended repo structure</h2><p className="text-sm text-slate-400">Files included in this starter project.</p></div><Icon name="file" className="text-cyan-300" size={21} /></div><div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 font-mono text-sm">{repoFiles.map((file: string) => <div key={file} className="flex items-center gap-3 border-b border-white/10 px-4 py-3 last:border-b-0"><span className="text-cyan-300">/</span><span className="text-slate-300">{file}</span></div>)}</div></div></Card>
          <Card><div className="p-5"><h2 className="text-lg font-semibold text-white">GitHub Actions schedule</h2><p className="text-sm text-slate-400">Automate scans and reports directly from the repo.</p><pre className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs leading-6 text-slate-300">{`name: GovSignal Reports\non:\n  schedule:\n    - cron: "0 0 * * 4" # Wednesday 5 PM PT\n    - cron: "0 0 * * 6" # Friday 5 PM PT\njobs:\n  scan-and-email:\n    runs-on: ubuntu-latest`}</pre></div></Card>
        </div>
        <aside className="space-y-5"><Card><div className="p-5"><div className="mb-4 grid size-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon name="shield" size={22} /></div><h2 className="text-xl font-semibold text-white">Launch checklist</h2><div className="mt-5 space-y-3">{setupSteps.map((step: string) => <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2"><Icon name="check" size={17} className="text-cyan-300" /><span className="text-sm text-slate-300">{step}</span></div>)}</div></div></Card><Card><div className="p-5"><h2 className="text-xl font-semibold text-white">Secrets needed later</h2><div className="mt-4 space-y-2 font-mono text-xs">{["STOCK_PRICE_API_KEY", "OPENAI_API_KEY", "RESEND_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_KEY"].map((secret) => <div key={secret} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-slate-300">{secret}</div>)}</div></div></Card><RiskCard title="Repo note" text="Never commit API keys. Keep them in GitHub Secrets or Vercel environment variables." /></aside>
      </section>
    </main>
  );
}

function SignalCard({ signal, index, compact = false }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 transition hover:border-cyan-300/30 hover:bg-slate-900">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-xl bg-white px-2.5 py-1 text-sm font-bold text-slate-950">{signal.ticker}</span><span className="text-sm font-medium text-slate-300">{signal.company}</span><ImpactBadge impact={signal.impact} /></div><h3 className="text-base font-semibold text-slate-50">{signal.headline}</h3>{!compact && <p className="mt-1 text-sm leading-6 text-slate-400">{signal.reason}</p>}</div>
        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-200"><Icon name="arrowUpRight" size={17} /><span className="font-semibold">{signal.move}</span></div>
      </div>
      <div className="grid gap-3 border-t border-white/10 pt-3 text-sm sm:grid-cols-5"><Info label="Price" value={signal.price} icon="chart" /><Info label="Source" value={signal.source} icon="landmark" /><Info label="Category" value={signal.category} icon="lineChart" /><Info label="Time" value={signal.time} icon="clock" /><Info label="Score" value={`${signal.confidence}/100`} icon="shield" /></div>
    </div>
  );
}

function WatchlistTable() {
  return (
    <Card><div className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Watchlist ranking</h2><p className="text-sm text-slate-400">Companies repeatedly connected to government catalysts.</p></div><button className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10">Export CSV</button></div><div className="overflow-hidden rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/5 text-slate-400"><tr><th className="px-4 py-3 font-medium">Ticker</th><th className="px-4 py-3 font-medium">Company</th><th className="hidden px-4 py-3 font-medium md:table-cell">Sector</th><th className="px-4 py-3 font-medium">Mentions</th><th className="px-4 py-3 font-medium">Score</th></tr></thead><tbody className="divide-y divide-white/10">{watchlist.map((item: any) => <tr key={item.ticker} className="hover:bg-white/[0.03]"><td className="px-4 py-3 font-bold text-cyan-200">{item.ticker}</td><td className="px-4 py-3 text-slate-200">{item.company}</td><td className="hidden px-4 py-3 text-slate-400 md:table-cell">{item.sector}</td><td className="px-4 py-3 text-slate-300">{item.mentions}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="h-2 w-16 overflow-hidden rounded-full bg-white/10 sm:w-20"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${item.score}%` }} /></div><span className="text-slate-300">{item.score}</span></div></td></tr>)}</tbody></table></div></div></Card>
  );
}

function UpcomingCard() {
  return <Card><div className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Upcoming catalysts</h2><Icon name="calendar" className="text-cyan-300" size={20} /></div><div className="space-y-3">{upcoming.map((event: any) => <div key={event.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3"><div className="mb-2 flex items-center justify-between gap-2"><span className="rounded-xl bg-white/10 px-2 py-1 text-xs font-bold text-slate-200">{event.day}</span><span className="rounded-full bg-cyan-400/10 px-2 py-1 text-xs font-medium text-cyan-200">{event.tag}</span></div><div className="text-sm font-medium text-slate-100">{event.title}</div><div className="mt-1 text-xs text-slate-500">Signal risk: {event.risk}</div></div>)}</div></div></Card>;
}

function ReportCard() {
  return <Card><div className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Reports enabled</h2><Icon name="mail" className="text-cyan-300" size={20} /></div><div className="space-y-3"><ReportMini day="Wednesday 5 PM" text="Midweek catalyst report" /><ReportMini day="Friday 5 PM" text="Full weekly catalyst report" /></div></div></Card>;
}

function ReportMini({ day, text }: any) {
  return <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4"><div className="mb-1 flex items-center gap-2 text-sm font-semibold text-cyan-100"><Icon name="shield" size={17} /> {day}</div><p className="text-sm text-slate-300">{text}</p></div>;
}

function RiskCard({ title = "Research tool only", text = "GovSignal ranks catalysts and sources. It should never tell users to buy or sell. Every signal needs links, reasoning, confidence, and risk notes." }: any) {
  return <Card className="border-amber-300/20 bg-amber-300/10"><div className="p-5"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-100"><Icon name="alert" size={18} /> {title}</div><p className="text-sm leading-relaxed text-amber-50/80">{text}</p></div></Card>;
}

function PageTitle({ eyebrow, title, text }: any) {
  return <section className="mb-6"><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm font-medium text-cyan-100"><Icon name="zap" size={15} /> {eyebrow}</div><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">{text}</p></section>;
}

function MiniStat({ label, value }: any) {
  return <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"><div className="text-2xl font-semibold text-white">{value}</div><div className="mt-1 text-sm text-slate-400">{label}</div></div>;
}

function FeatureCard({ icon, title, text }: any) {
  return <Card className="h-full"><div className="p-5"><div className="mb-4 grid size-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon name={icon} size={21} /></div><h3 className="text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div></Card>;
}

function MetricCard({ icon, label, value, helper }: any) {
  return <Card><div className="p-4"><div className="mb-4 flex items-center justify-between"><div className="grid size-10 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon name={icon} size={20} /></div><Icon name="pie" size={17} className="text-slate-500" /></div><div className="text-2xl font-semibold tracking-tight text-white">{value}</div><div className="mt-1 text-sm text-slate-400">{label}</div><div className="mt-3 text-xs text-slate-500">{helper}</div></div></Card>;
}

function ImpactBadge({ impact }: any) {
  const styles: Record<string, string> = { High: "bg-emerald-400/10 text-emerald-200 border-emerald-400/20", Medium: "bg-blue-400/10 text-blue-200 border-blue-400/20", Speculative: "bg-amber-400/10 text-amber-100 border-amber-400/20" };
  return <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", styles[impact] || styles.Medium)}>{impact}</span>;
}

function SignalDetail({ icon, label, value }: any) {
  return <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3"><div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><Icon name={icon} size={14} /> {label}</div><div className="text-sm font-semibold text-slate-200">{value}</div></div>;
}

function Info({ label, value, icon }: any) {
  return <div className="flex items-center gap-2"><div className="grid size-8 place-items-center rounded-xl bg-white/5 text-slate-400"><Icon name={icon} size={15} /></div><div><div className="text-xs text-slate-500">{label}</div><div className="text-sm font-medium text-slate-300">{value}</div></div></div>;
}

function RepoStat({ label, value }: any) {
  return <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div className="text-2xl font-semibold text-white">{value}</div><div className="mt-1 text-sm text-slate-400">{label}</div></div>;
}
