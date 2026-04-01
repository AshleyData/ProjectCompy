import { useState } from "react";

// Embedded data — Sally generates this directly from the collectors, no JSON file
const WEEKS = {
  "2026-03-28": {
    gsc: {
      clicks: 3500, impressions: 103000, ctr: 3.4, avg_position: 9.8,
      clicks_last: 3630, impressions_last: 98200,
      wow_clicks: -3.6, wow_impressions: 4.9,
      trailing_28d_clicks: 9668, trailing_28d_impressions: 447101,
      mom_clicks: 0.5, mom_impressions: 3.2,
      comparison_pages: [
        { page: "vs-LaunchDarkly", views: 7, change: -1 },
        { page: "vs-PostHog", views: 3, change: -2 },
        { page: "vs-VWO", views: 2, change: 0 },
        { page: "vs-Optimizely", views: 2, change: -3 },
      ],
    },
    exec_summary: [
      "GrowthBook impressions grew 4.9% WoW to 103K, but clicks dipped 3.6% to 3,500. The decline is concentrated on the homepage (-67 clicks), likely a branded search fluctuation rather than a content problem. Blog content is performing well — \"How to A/B Test AI\" hit position 8.2 in its first week with 10,240 impressions. The trailing 28-day trend is stable: 9,668 clicks (+0.5% MoM).",
      "The biggest strategic gap: LaunchDarkly's Bayesian vs. frequentist page pulls an estimated 1,370 monthly visitors while GrowthBook has no equivalent SEO-optimized page. Their multi-armed bandits doc gets 402 visitors vs. GrowthBook's 13. These are core topics where GrowthBook has deep technical credibility but is losing search demand to documentation pages.",
      "LaunchDarkly refreshed its feature flags and experimentation product pages (threat 7-8). Optimizely pushed updates across web experimentation and feature experimentation — a coordinated SEO play for category terms. Amplitude published a \"best feature flag tools\" roundup (KD 30, threat 8) that directly intercepts buyers evaluating GrowthBook."
    ],
    content_recs: [
      { action: "Write", topic: "multi-armed bandits for A/B testing", reason: "KD 5, LaunchDarkly's doc pulls 402 ETV vs GrowthBook's 13. Winnable keyword with demonstrated demand.", priority: "high" },
      { action: "Write", topic: "Bayesian vs. frequentist statistics for A/B testing", reason: "LaunchDarkly dominates at 1,370 ETV. GrowthBook's stats engine is a core differentiator — this gap shouldn't exist.", priority: "high" },
      { action: "Refresh", topic: "/compare/growthbook-vs-launchdarkly", reason: "Led comparison traffic at 7 views. LD just updated experimentation + feature flags pages. Comparison needs to reflect their current positioning.", priority: "medium" },
      { action: "Write", topic: "Power calculation and sample size guide", reason: "KD 5, Amplitude ranks, GrowthBook absent. Mid-funnel buyers who are already experiment-aware.", priority: "medium" },
      { action: "Refresh", topic: "What Are Feature Flags blog post", reason: "27 ETV, flat growth. Counter Amplitude's new 'best feature flag tools' roundup with a comparison table.", priority: "medium" },
    ],
    competitors: [
      { name: "Optimizely", etv: 530527, pages: 80, surging: 19, top_page: "What is A/B testing?", top_etv: 249883 },
      { name: "Amplitude", etv: 296390, pages: 82, surging: 15, top_page: "Agent Analytics", top_etv: 12400 },
      { name: "Statsig", etv: 243082, pages: 106, surging: 22, top_page: "Experimental control explained", top_etv: 45482 },
      { name: "Harness", etv: 186803, pages: 106, surging: 19, top_page: "What is A/B Testing?", top_etv: 92685 },
      { name: "LaunchDarkly", etv: 20921, pages: 120, surging: 16, top_page: "Smoke Testing Guide", top_etv: 4925 },
      { name: "Eppo", etv: 11299, pages: 39, surging: 20, top_page: "Bayesian vs Frequentist", top_etv: 3200 },
      { name: "PostHog", etv: 10193, pages: 135, surging: 8, top_page: "Product Engineer vs Software Engineer", top_etv: 898 },
      { name: "Unleash", etv: 3330, pages: 15, surging: 3, top_page: "Trunk-Based Development", top_etv: 2060 },
      { name: "Flagsmith", etv: 1087, pages: 18, surging: 2, top_page: "Flagsmith vs LaunchDarkly", top_etv: 320 },
      { name: "GrowthBook", etv: 185, pages: 8, surging: 4, top_page: "What is A/B Testing", top_etv: 50, note: "ETV underreports — GSC shows ~9,700 clicks/mo. 45% branded traffic." },
    ],
    top_movers: {
      gains: [
        { url: "/products/experiments", clicks_this: 16, clicks_last: 9, change: 7, position: 3.1 },
        { url: "blog: How to A/B Test AI", clicks_this: 9, clicks_last: 2, change: 7, position: 8.5 },
        { url: "blog: Release 4.3 Faster Experiments", clicks_this: 6, clicks_last: 2, change: 4, position: 5.2 },
      ],
      declines: [
        { url: "growthbook.io/ (homepage)", clicks_this: 1843, clicks_last: 1910, change: -67, position: 14.9 },
        { url: "/products/ai-mcp", clicks_this: 2, clicks_last: 9, change: -7, position: 4.3 },
        { url: "blog: Feedback Loops/Agentic Coding", clicks_this: 2, clicks_last: 7, change: -5, position: 6.8 },
        { url: "blog: CUPED post", clicks_this: 1, clicks_last: 5, change: -4, position: 8.3 },
        { url: "/compare/growthbook-vs-statsig", clicks_this: 1, clicks_last: 5, change: -4, position: 11.2 },
      ],
    },
    striking_distance: [
      { query: "ab testing software", position: 9.4, impressions: 914, clicks: 0, trend: "up" },
      { query: "what is a/b testing", position: 14.6, impressions: 807, clicks: 1, trend: "down" },
      { query: "ab testing tools", position: 14.5, impressions: 637, clicks: 1, trend: "up" },
      { query: "model a/b testing", position: 8.3, impressions: 619, clicks: 0, trend: "up" },
      { query: "a/b testing tools", position: 14.4, impressions: 573, clicks: 0, trend: "up" },
      { query: "experimentation platform", position: 10.1, impressions: 559, clicks: 1, trend: "up" },
      { query: "launchdarkly alternatives", position: 12.0, impressions: 536, clicks: 0, trend: "up" },
      { query: "ab testing tool", position: 12.0, impressions: 528, clicks: 1, trend: "up" },
    ],
    opportunities: [
      { rank: 1, topic: "A/B Rollouts", score: 83.9, competitor: "LaunchDarkly", kd: 4, category: "Quick Win" },
      { rank: 2, topic: "AB Split Test", score: 83.4, competitor: "Statsig", kd: 8, category: "Quick Win" },
      { rank: 3, topic: "Multi-Armed Bandits", score: 82.8, competitor: "LaunchDarkly", kd: 5, category: "Quick Win" },
      { rank: 4, topic: "Power Calculation & Sample Size", score: 80.3, competitor: "Amplitude", kd: 5, category: "Quick Win" },
      { rank: 5, topic: "Feature Experimentation", score: 80.0, competitor: "Optimizely", kd: 16, category: "Strategic" },
    ],
    youtube: {
      gb_outliers: [],
      competitor_outliers: [
        { competitor: "Eppo", title: "A/B Testing vs Multi-Armed Bandits", views: 1513, avg: 380, mult: 4.0 },
        { competitor: "PostHog", title: "Startup interview questions that matter", views: 4660, avg: 840, mult: 5.5 },
        { competitor: "Harness", title: "What is Load Testing? 60 Seconds", views: 836, avg: 112, mult: 7.5 },
        { competitor: "Optimizely", title: "AI search now knows more than you type", views: 434, avg: 95, mult: 4.6 },
        { competitor: "Amplitude", title: "Meet the Amplitude AI Platform", views: 623, avg: 103, mult: 6.0 },
      ],
      keyword_rankings: [
        { keyword: "growthbook tutorial", gb_rank: 1, top_comp: "-", top_rank: "-" },
        { keyword: "growthbook feature flags", gb_rank: 1, top_comp: "-", top_rank: "-" },
        { keyword: "open source feature flags", gb_rank: 5, top_comp: "Unleash", top_rank: 2 },
        { keyword: "experimentation platform", gb_rank: "-", top_comp: "Statsig", top_rank: 2 },
        { keyword: "feature flags python", gb_rank: "-", top_comp: "Unleash", top_rank: 2 },
        { keyword: "a/b testing tutorial", gb_rank: "-", top_comp: "Optimizely", top_rank: 1 },
      ],
    },
    new_content: [
      { competitor: "Amplitude", count: 124, highlight: "AI visibility comparison page (KD 0, threat 9/10)" },
      { competitor: "Harness", count: 129, highlight: "Bulk content push across DevOps academy" },
      { competitor: "Optimizely", count: 49, highlight: "Glossary + solution pages, YouTube AI search play" },
      { competitor: "LaunchDarkly", count: 45, highlight: "Platform architecture, experimentation product pages" },
      { competitor: "Eppo", count: 20, highlight: "Product update monthly roundups" },
      { competitor: "Flagsmith", count: 13, highlight: "vs-LaunchDarkly comparison, technical debt blog" },
      { competitor: "Statsig", count: 6, highlight: "Autotune, Holdouts, Metrics feature pages" },
      { competitor: "Unleash", count: 6, highlight: "MCP feature flags, AI agent sandboxing blogs" },
    ],
    aeo: { tracked: 30, triggering: 20, gb_cited: 0 },
  },
};

const COLORS = {
  primary: "#1B4F72", accent: "#2E86C1", success: "#1E8449",
  warning: "#D4AC0D", danger: "#C0392B", light: "#F8F9FA",
  muted: "#6C757D", white: "#FFFFFF", border: "#DEE2E6",
};

const COMP_COLORS = {
  Optimizely: "#6C3483", Amplitude: "#2874A6", Statsig: "#1ABC9C",
  Harness: "#D35400", LaunchDarkly: "#2C3E50", Eppo: "#E74C3C",
  PostHog: "#F39C12", Unleash: "#16A085", Flagsmith: "#8E44AD",
  GrowthBook: "#1E8449",
};

function MetricCard({ label, value, change, small }) {
  const isPositive = change > 0;
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "→";
  const changeColor = isPositive ? COLORS.success : change < 0 ? COLORS.danger : COLORS.muted;
  return (
    <div style={{ background: COLORS.white, borderRadius: 8, padding: small ? "12px 16px" : "16px 20px", border: `1px solid ${COLORS.border}`, flex: 1, minWidth: small ? 120 : 160 }}>
      <div style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: small ? 20 : 28, fontWeight: 700, color: COLORS.primary, marginTop: 4 }}>{value}</div>
      {change !== undefined && (
        <div style={{ fontSize: 13, color: changeColor, marginTop: 2 }}>
          {arrow} {Math.abs(change)}% WoW
        </div>
      )}
    </div>
  );
}

function BarChart({ data, labelKey, valueKey, maxWidth = 500, color = COLORS.accent, formatValue }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 120, fontSize: 13, textAlign: "right", color: COLORS.muted, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d[labelKey]}
          </div>
          <div style={{ flex: 1, maxWidth, background: "#EBF5FB", borderRadius: 4, height: 24, position: "relative" }}>
            <div style={{
              width: `${(d[valueKey] / max) * 100}%`, height: "100%", borderRadius: 4,
              background: d[labelKey] === "GrowthBook" ? COLORS.success : (COMP_COLORS[d[labelKey]] || color),
              minWidth: 2
            }} />
          </div>
          <div style={{ width: 80, fontSize: 13, fontWeight: 600, color: COLORS.primary }}>
            {formatValue ? formatValue(d[valueKey]) : d[valueKey].toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function DataTable({ headers, rows, compact }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compact ? 12 : 13 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: compact ? "6px 8px" : "8px 12px", textAlign: "left", background: COLORS.primary, color: COLORS.white, fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? COLORS.white : "#F8F9FA" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: compact ? "5px 8px" : "8px 12px", borderBottom: `1px solid ${COLORS.border}`, whiteSpace: j === 0 ? "normal" : "nowrap" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendBadge({ value }) {
  if (value === "up") return <span style={{ color: COLORS.success, fontWeight: 600 }}>↑</span>;
  if (value === "down") return <span style={{ color: COLORS.danger, fontWeight: 600 }}>↓</span>;
  return <span style={{ color: COLORS.muted }}>→</span>;
}

function PriorityBadge({ level }) {
  const colors = { high: COLORS.danger, medium: COLORS.warning, low: COLORS.muted };
  return (
    <span style={{ background: colors[level] || COLORS.muted, color: COLORS.white, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{level}</span>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary, borderBottom: `2px solid ${COLORS.accent}`, paddingBottom: 8, marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "competitors", label: "Competitors" },
  { id: "gsc", label: "GSC Detail" },
  { id: "opportunities", label: "Opportunities" },
  { id: "youtube", label: "YouTube" },
  { id: "content", label: "New Content" },
];

export default function CompyDashboard() {
  const weeks = Object.keys(WEEKS).sort().reverse();
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]);
  const [activeTab, setActiveTab] = useState("summary");
  const data = WEEKS[selectedWeek];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#F0F2F5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: COLORS.primary, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: COLORS.white, fontSize: 20, fontWeight: 700 }}>Compy Weekly Brief</div>
          <div style={{ color: "#AED6F1", fontSize: 13 }}>GrowthBook Competitive Intelligence</div>
        </div>
        <select
          value={selectedWeek}
          onChange={e => setSelectedWeek(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "none", fontSize: 14, background: COLORS.white, color: COLORS.primary, fontWeight: 600, cursor: "pointer" }}
        >
          {weeks.map(w => <option key={w} value={w}>Week of {w}</option>)}
        </select>
      </div>

      {/* Tab bar */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, display: "flex", gap: 0, overflowX: "auto" }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 20px", border: "none", background: "none", cursor: "pointer",
              fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 400,
              color: activeTab === tab.id ? COLORS.accent : COLORS.muted,
              borderBottom: activeTab === tab.id ? `3px solid ${COLORS.accent}` : "3px solid transparent",
              whiteSpace: "nowrap",
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {activeTab === "summary" && (
          <>
            {/* Scorecard */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <MetricCard label="Clicks" value={data.gsc.clicks.toLocaleString()} change={data.gsc.wow_clicks} />
              <MetricCard label="Impressions" value={(data.gsc.impressions / 1000).toFixed(0) + "K"} change={data.gsc.wow_impressions} />
              <MetricCard label="CTR" value={data.gsc.ctr + "%"} />
              <MetricCard label="Avg Position" value={data.gsc.avg_position} />
            </div>

            {/* Executive Summary */}
            <Section title="Executive Summary">
              <div style={{ background: COLORS.white, borderRadius: 8, padding: 20, border: `1px solid ${COLORS.border}` }}>
                {data.exec_summary.map((para, i) => (
                  <p key={i} style={{ margin: i === 0 ? 0 : "16px 0 0 0", lineHeight: 1.65, color: "#2C3E50", fontSize: 14 }}>{para}</p>
                ))}
              </div>
            </Section>

            {/* Comparison Pages */}
            <Section title="Comparison Pages">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {data.gsc.comparison_pages.map((p, i) => (
                  <div key={i} style={{ background: COLORS.white, borderRadius: 8, padding: "12px 16px", border: `1px solid ${COLORS.border}`, minWidth: 140 }}>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{p.page}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.primary }}>{p.views}</div>
                    <div style={{ fontSize: 12, color: p.change >= 0 ? COLORS.success : COLORS.danger }}>
                      {p.change >= 0 ? "+" : ""}{p.change} vs last week
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Content Recommendations */}
            <Section title="Content Recommendations">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.content_recs.map((rec, i) => (
                  <div key={i} style={{ background: COLORS.white, borderRadius: 8, padding: "14px 18px", border: `1px solid ${COLORS.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ background: COLORS.accent, color: COLORS.white, borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: COLORS.primary, fontSize: 14 }}>{rec.action}: {rec.topic}</span>
                        <PriorityBadge level={rec.priority} />
                      </div>
                      <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>{rec.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {activeTab === "competitors" && (
          <>
            <Section title="Competitor Organic Traffic (ETV)">
              <BarChart
                data={[...data.competitors].sort((a, b) => a.etv - b.etv)}
                labelKey="name"
                valueKey="etv"
                maxWidth={600}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: COLORS.muted, fontStyle: "italic" }}>
                Note: GrowthBook ETV underreports actual traffic. GSC shows ~9,700 clicks/mo (45% branded). ETV measures non-branded organic only.
              </div>
            </Section>

            <Section title="Competitor Detail">
              <DataTable
                headers={["Competitor", "Total ETV", "Pages", "Surging", "Top Page", "Top Page ETV"]}
                rows={data.competitors.map(c => [
                  c.name,
                  c.etv.toLocaleString(),
                  c.pages,
                  c.surging,
                  c.top_page,
                  c.top_etv.toLocaleString(),
                ])}
              />
            </Section>
          </>
        )}

        {activeTab === "gsc" && (
          <>
            <Section title="28-Day Trend">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                <MetricCard label="28d Clicks" value={data.gsc.trailing_28d_clicks.toLocaleString()} change={data.gsc.mom_clicks} small />
                <MetricCard label="28d Impressions" value={(data.gsc.trailing_28d_impressions / 1000).toFixed(0) + "K"} change={data.gsc.mom_impressions} small />
              </div>
            </Section>

            <Section title="Top Movers — Gains">
              <DataTable
                headers={["URL", "This Week", "Last Week", "Change", "Position"]}
                rows={data.top_movers.gains.map(m => [
                  m.url, m.clicks_this, m.clicks_last,
                  <span style={{ color: COLORS.success, fontWeight: 600 }}>+{m.change}</span>,
                  m.position
                ])}
                compact
              />
            </Section>

            <Section title="Top Movers — Declines">
              <DataTable
                headers={["URL", "This Week", "Last Week", "Change", "Position"]}
                rows={data.top_movers.declines.map(m => [
                  m.url, m.clicks_this, m.clicks_last,
                  <span style={{ color: COLORS.danger, fontWeight: 600 }}>{m.change}</span>,
                  m.position
                ])}
                compact
              />
            </Section>

            <Section title="Striking Distance (Positions 8-20)">
              <DataTable
                headers={["Query", "Position", "Trend", "Impressions", "Clicks"]}
                rows={data.striking_distance.map(q => [
                  q.query, q.position, <TrendBadge value={q.trend} />, q.impressions.toLocaleString(), q.clicks
                ])}
                compact
              />
            </Section>
          </>
        )}

        {activeTab === "opportunities" && (
          <>
            <Section title="Top 5 Content Opportunities">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.opportunities.map((opp, i) => (
                  <div key={i} style={{ background: COLORS.white, borderRadius: 8, padding: "16px 20px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accent, width: 36, textAlign: "center" }}>#{opp.rank}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.primary }}>{opp.topic}</div>
                      <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>Lead: {opp.competitor} · KD {opp.kd}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent }}>{opp.score}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{opp.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {activeTab === "youtube" && (
          <>
            <Section title="Competitor YouTube Outliers (2x+ channel avg)">
              <DataTable
                headers={["Competitor", "Video", "Views", "Channel Avg", "Multiplier"]}
                rows={data.youtube.competitor_outliers.map(v => [
                  v.competitor, v.title, v.views.toLocaleString(), v.avg, v.mult + "x"
                ])}
              />
            </Section>

            <Section title="YouTube Keyword Rankings">
              <DataTable
                headers={["Keyword", "GrowthBook Rank", "Top Competitor", "Their Rank"]}
                rows={data.youtube.keyword_rankings.map(k => [
                  k.keyword,
                  k.gb_rank === "-" ? <span style={{ color: COLORS.danger }}>Not ranking</span> : <span style={{ fontWeight: 700, color: COLORS.success }}>#{k.gb_rank}</span>,
                  k.top_comp,
                  k.top_rank === "-" ? "-" : `#${k.top_rank}`
                ])}
              />
            </Section>

            <Section title="AI Search Visibility">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <MetricCard label="Keywords Tracked" value={data.aeo.tracked} small />
                <MetricCard label="Triggering AI Overviews" value={data.aeo.triggering} small />
                <MetricCard label="GrowthBook Cited" value={data.aeo.gb_cited} small />
              </div>
              <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 12 }}>
                GrowthBook has 0 AI Overview citations across {data.aeo.triggering} keywords that trigger AIOs. Priority actions: add FAQ schema to key blog posts, restructure opening paragraphs for AI extractability.
              </p>
            </Section>
          </>
        )}

        {activeTab === "content" && (
          <>
            <Section title="New Competitor Pages Detected">
              <BarChart
                data={[...data.new_content].sort((a, b) => a.count - b.count)}
                labelKey="competitor"
                valueKey="count"
                maxWidth={400}
              />
            </Section>

            <Section title="Highlights by Competitor">
              <DataTable
                headers={["Competitor", "New Pages", "Notable"]}
                rows={data.new_content.map(c => [c.competitor, c.count, c.highlight])}
              />
            </Section>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "16px 24px", textAlign: "center", color: COLORS.muted, fontSize: 12, background: COLORS.white }}>
        Compy · GrowthBook Competitive Intelligence · Generated {selectedWeek} · Data: GSC + DataforSEO + YouTube API
      </div>
    </div>
  );
}
