import { useState } from "react";

const WEEK = "2026-03-30";

const DATA = {
  gsc: {
    clicks: 3418, impressions: 110304, ctr: 3.10, avg_position: 9.54,
    clicks_last: 3572, impressions_last: 104554,
    wow_clicks: -4.3, wow_impressions: 5.5,
    trailing_28d_clicks: 14532, mom_clicks: -1.8,
    branded: 1856, nonbranded: 243, anonymized: 1319,
  },
  exec_summary: [
    "GrowthBook's overall click volume dipped modestly this week, from 3,572 to 3,418 clicks (-4.3%), but impressions actually grew from 104,554 to 110,304 (+5.5%), suggesting broader visibility even as conversion to clicks softened. The homepage accounts for the vast majority of the click decline (down 81 clicks, from 1,851 to 1,770), which looks like normal branded search fluctuation rather than a structural problem. On the bright side, the AI A/B testing guide surged from 1 to 10 clicks, the /products/experiments page gained 5 clicks, and the GrowthBook vs. LaunchDarkly comparison page doubled from 4 to 8 clicks — all meaningful directional signals.",
    "The most important strategic finding this week is Amplitude's aggressive push into comparison and 'best-of' content targeting startup and developer audiences. Four of the five top opportunities this week are Amplitude Experiment URLs covering 'best feature flag tools for startups,' 'best mobile ab testing for developers,' 'best product experimentation tools for startups,' and 'top ab testing platforms.' These comparison pages are low-friction, high-intent destinations that intercept buyers mid-research. GrowthBook has a credible story for every one of these queries — open-source, developer-friendly, startup-accessible — but lacks dedicated content to compete for them.",
    "Competitor content activity was quiet this week with no new tracked posts from LaunchDarkly, Statsig, Optimizely, Eppo, or others surfacing in the data. LaunchDarkly continues to hold a strong position on the 'feature flags' keyword (KD 38), which remains the top-ranked opportunity. The absence of new competitor content is actually a tactical window — publishing now on the 'best-of' and comparison queries means GrowthBook can establish positions before competitors refresh or expand their own coverage.",
  ],
  opportunities: [
    { rank: 1, topic: "Feature Flags", competitor: "LaunchDarkly", score: 75.0, kd: 38, bucket: "Quick Win", why: "LaunchDarkly's feature flags platform page ranks for core feature flag queries with KD 38. GrowthBook has a strong feature flags product but no dedicated ranking page competing for this term." },
    { rank: 2, topic: "Best Feature Flag Tools for Startups", competitor: "Amplitude Exp", score: 75.0, kd: "n/a", bucket: "Quick Win", why: "Amplitude's comparison page targets startup buyers at the moment of vendor selection. Startups are GrowthBook's core audience. KD n/a = brand-new page, effectively zero competition." },
    { rank: 3, topic: "Best Mobile A/B Testing for Developers", competitor: "Amplitude Exp", score: 75.0, kd: "n/a", bucket: "Quick Win", why: "Developers are GrowthBook's primary persona. Amplitude owns this bottom-of-funnel query unopposed. No KD data — page too new for DataForSEO tracking." },
    { rank: 4, topic: "Best Product Experimentation Tools for Startups", competitor: "Amplitude Exp", score: 75.0, kd: "n/a", bucket: "Quick Win", why: "Third in Amplitude's startup experimentation cluster. Publishing all three GrowthBook equivalents in one sprint builds topical authority fast." },
    { rank: 5, topic: "Top A/B Testing Platforms", competitor: "Amplitude Exp", score: 75.0, kd: "n/a", bucket: "Quick Win", why: "High-intent comparison query. Amplitude is establishing itself as the go-to resource for buyers evaluating A/B testing platforms — GrowthBook is absent." },
  ],
  top_movers: {
    gains: [
      { url: "blog: How to A/B Test AI", clicks: 10, prior: 1, change: 9 },
      { url: "/products/experiments", clicks: 15, prior: 10, change: 5 },
      { url: "/compare/growthbook-vs-launchdarkly", clicks: 8, prior: 4, change: 4 },
      { url: "blog: GrowthBook vs LaunchDarkly", clicks: 5, prior: 3, change: 2 },
      { url: "blog.growthbook.io/", clicks: 8, prior: 6, change: 2 },
    ],
    declines: [
      { url: "growthbook.io/ (homepage)", clicks: 1770, prior: 1851, change: -81 },
      { url: "blog: What Are Feature Flags?", clicks: 7, prior: 14, change: -7 },
      { url: "/products/ai-mcp", clicks: 2, prior: 6, change: -4 },
      { url: "blog: Release 4.3 Faster Experiments", clicks: 2, prior: 5, change: -3 },
      { url: "/demo", clicks: 3, prior: 6, change: -3 },
    ],
  },
  striking_distance: [
    { query: "ab testing software", position: 8.7, impressions: 882, clicks: 0, opportunity: "High" },
    { query: "what is a/b testing", position: 15.0, impressions: 763, clicks: 1, opportunity: "Medium" },
    { query: "ab testing tools", position: 14.3, impressions: 656, clicks: 1, opportunity: "Medium" },
    { query: "a/b testing tools", position: 13.9, impressions: 610, clicks: 0, opportunity: "Medium" },
    { query: "ab testing tool", position: 11.7, impressions: 555, clicks: 1, opportunity: "High" },
    { query: "launchdarkly alternatives", position: 11.6, impressions: 529, clicks: 0, opportunity: "High" },
    { query: "model a/b testing", position: 9.2, impressions: 526, clicks: 0, opportunity: "High" },
    { query: "experimentation platform", position: 9.6, impressions: 518, clicks: 1, opportunity: "High" },
  ],
  competitors: [
    { name: "Optimizely", etv: 592025, pages: 275, top_page: "What is A/B testing?", top_etv: 251651 },
    { name: "Statsig", etv: 350426, pages: 389, top_page: "What is an experimental control?", top_etv: 49870 },
    { name: "Amplitude Exp", etv: 296500, pages: 82, top_page: "Correlation vs Causation", top_etv: 123936 },
    { name: "Harness", etv: 187421, pages: 106, top_page: "What is A/B Testing?", top_etv: 92685 },
    { name: "LaunchDarkly", etv: 25074, pages: 153, top_page: "Smoke Testing Guide", top_etv: 5011 },
    { name: "Eppo", etv: 11482, pages: 39, top_page: "A/B testing vs. split testing", top_etv: 4212 },
    { name: "PostHog", etv: 10679, pages: 135, top_page: "Product engineer vs software engineer", top_etv: 898 },
    { name: "Unleash", etv: 3376, pages: 15, top_page: "Trunk-Based Development", top_etv: 2081 },
    { name: "Flagsmith", etv: 1092, pages: 18, top_page: "Canary Deployment", top_etv: 258 },
    { name: "GrowthBook", etv: 186, pages: 8, top_page: "What is A/B Testing?", top_etv: 51, note: "ETV underreports — GSC shows ~9,700 clicks/mo. 45% branded." },
  ],
  new_content: [
    { competitor: "Amplitude Exp", slug: "best feature flag tools for startups", threat: 7, kd: "n/a", date: "2026-03-20" },
    { competitor: "Amplitude Exp", slug: "best mobile ab testing for developers", threat: 7, kd: "n/a", date: "2026-03-24" },
    { competitor: "LaunchDarkly", slug: "feature flags", threat: 7, kd: 38, date: "2026-03-25" },
    { competitor: "Optimizely", slug: "experience optimization", threat: 7, kd: "n/a", date: "2026-03-02" },
    { competitor: "Harness", slug: "argocd vs harness", threat: 8, kd: 0, date: "" },
    { competitor: "Harness", slug: "github actions vs harness", threat: 8, kd: 0, date: "" },
    { competitor: "Harness", slug: "ai code agent", threat: 7, kd: 25, date: "" },
    { competitor: "Flagsmith", slug: "trunk based development vs gitflow", threat: 7, kd: 3, date: "" },
    { competitor: "Flagsmith", slug: "flagsmith vs launchdarkly", threat: 7, kd: 0, date: "" },
    { competitor: "PostHog", slug: "sandbox environments", threat: 8, kd: 10, date: "" },
  ],
  youtube: {
    gb_outliers: [
      { title: "Faster Shipping Means You Need Testing More", views: 1336, mult: 5.9 },
      { title: "Why Experimentation Matters from Ronny Kohavi", views: 855, mult: 3.8 },
      { title: "Turn Experiment Results Into a Team Moment", views: 502, mult: 2.2 },
    ],
    competitor_outliers: [
      { competitor: "Optimizely", title: "AI search now knows more than you type…", views: 435, mult: 4.3 },
      { competitor: "Harness", title: "What is Load Testing? 60 Seconds", views: 840, mult: 6.0 },
      { competitor: "Amplitude Exp", title: "Meet the Amplitude AI Platform", views: 647, mult: 6.0 },
      { competitor: "Statsig", title: "Advanced methods for faster experimentation", views: 305, mult: 2.4 },
      { competitor: "PostHog", title: "Startup interview questions that matter", views: 4706, mult: 5.5 },
    ],
  },
};

const C = {
  primary: "#1B4F72", accent: "#2E86C1", success: "#1E8449",
  warning: "#D4AC0D", danger: "#C0392B", muted: "#6C757D",
  white: "#FFFFFF", border: "#DEE2E6", bg: "#F0F2F5",
};
const COMP_COLORS = {
  Optimizely: "#6C3483", "Amplitude Exp": "#2874A6", Statsig: "#1ABC9C",
  Harness: "#D35400", LaunchDarkly: "#2C3E50", Eppo: "#E74C3C",
  PostHog: "#F39C12", Unleash: "#16A085", Flagsmith: "#8E44AD", GrowthBook: "#1E8449",
};

function card(extra = {}) {
  return { background: C.white, borderRadius: 8, border: `1px solid ${C.border}`, ...extra };
}

function MetricCard({ label, value, change, sub }) {
  const color = change > 0 ? C.success : change < 0 ? C.danger : C.muted;
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "";
  return (
    <div style={{ ...card({ padding: "16px 20px", flex: 1, minWidth: 150 }) }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.primary, margin: "4px 0 2px" }}>{value}</div>
      {change !== undefined && <div style={{ fontSize: 13, color }}>{arrow} {Math.abs(change)}% WoW</div>}
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Bar({ label, value, max, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <div style={{ width: 130, fontSize: 13, textAlign: "right", color: C.muted, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ flex: 1, background: "#EBF5FB", borderRadius: 4, height: 22 }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", borderRadius: 4, background: color || C.accent, minWidth: 3 }} />
      </div>
      <div style={{ width: 75, fontSize: 13, fontWeight: 600, color: C.primary }}>{value.toLocaleString()}</div>
    </div>
  );
}

function Table({ headers, rows, compact }) {
  const p = compact ? "5px 8px" : "8px 12px";
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compact ? 12 : 13 }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={{ padding: p, textAlign: "left", background: C.primary, color: C.white, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.white : "#F8F9FA" }}>
              {row.map((cell, j) => <td key={j} style={{ padding: p, borderBottom: `1px solid ${C.border}` }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.primary, borderBottom: `2px solid ${C.accent}`, paddingBottom: 6, marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  );
}

function BucketBadge({ bucket }) {
  const bg = bucket === "Quick Win" ? C.success : bucket === "Content Gap" ? C.warning : C.danger;
  return <span style={{ background: bg, color: C.white, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{bucket}</span>;
}

function OpportunityBadge({ opp }) {
  const bg = opp === "High" ? C.danger : opp === "Medium" ? C.warning : C.muted;
  return <span style={{ background: bg, color: C.white, padding: "2px 6px", borderRadius: 8, fontSize: 11 }}>{opp}</span>;
}

const TABS = [
  { id: "summary", label: "📊 Summary" },
  { id: "opportunities", label: "🎯 Opportunities" },
  { id: "competitors", label: "🏁 Competitors" },
  { id: "gsc", label: "📈 GSC Detail" },
  { id: "youtube", label: "▶️ YouTube" },
  { id: "content", label: "🆕 New Content" },
];

export default function CompyDashboard() {
  const [tab, setTab] = useState("summary");
  const d = DATA;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: C.primary, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700 }}>🔍 Compy Weekly Brief</div>
          <div style={{ color: "#AED6F1", fontSize: 12 }}>GrowthBook Competitive Intelligence · Week of {WEEK}</div>
        </div>
        <div style={{ color: "#AED6F1", fontSize: 12, textAlign: "right" }}>
          GSC: 3,418 clicks · -4.3% WoW<br />
          110K impressions · +5.5% WoW
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "11px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13,
            fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? C.accent : C.muted, whiteSpace: "nowrap",
            borderBottom: tab === t.id ? `3px solid ${C.accent}` : "3px solid transparent",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── SUMMARY ── */}
        {tab === "summary" && (<>
          {/* Scorecard row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <MetricCard label="Clicks" value="3,418" change={-4.3} sub="3,572 prior week" />
            <MetricCard label="Impressions" value="110K" change={5.5} sub="104K prior week" />
            <MetricCard label="CTR" value="3.10%" sub="-0.31pp WoW" />
            <MetricCard label="Avg Position" value="9.54" sub="-0.13 WoW" />
            <MetricCard label="28-Day Clicks" value="14,532" sub="-1.8% MoM" />
          </div>

          {/* Click breakdown */}
          <Section title="Click Breakdown (This Week)">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Branded", value: "1,856", note: "queries containing 'growthbook'" },
                { label: "Non-Branded", value: "243", note: "organic discovery traffic" },
                { label: "Anonymized", value: "1,319", note: "low-volume queries (GSC privacy)" },
              ].map((b, i) => (
                <div key={i} style={{ ...card({ padding: "14px 18px", flex: 1, minWidth: 160 }) }}>
                  <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase" }}>{b.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.primary, margin: "4px 0 2px" }}>{b.value}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{b.note}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Executive Summary */}
          <Section title="Executive Summary">
            <div style={{ ...card({ padding: 20 }) }}>
              {d.exec_summary.map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : "14px 0 0", lineHeight: 1.65, color: "#2C3E50", fontSize: 14 }}>{p}</p>
              ))}
            </div>
          </Section>

          {/* Top 5 Competitor Content Opportunities */}
          <Section title="Top 5 Competitor Content Opportunities">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
              Composite score (0–100): weighted blend of competitor domain authority, keyword difficulty (lower KD = easier to rank), and topic relevance. ≥75 = Quick Win | 60–74 = Content Gap | &lt;60 = Competitor Capture. KD 'n/a' = page too new, treat as low competition.
            </p>
            <Table
              headers={["What to Write", "Score", "KD", "Bucket", "Why It Matters"]}
              rows={[
                [
                  <span><strong>Feature Flags</strong><br /><a href="https://launchdarkly.com/platform/feature-flags" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">launchdarkly.com/platform/feature-flags</a></span>,
                  "75.0", "38", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>LaunchDarkly's feature flags platform page ranks for core feature flag queries with KD 38. GrowthBook has a strong feature flags product but no dedicated ranking page competing for this term.</span>
                ],
                [
                  <span><strong>Best Feature Flag Tools for Startups</strong><br /><a href="https://amplitude.com/compare/best-feature-flag-tools-for-startups" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">amplitude.com/compare/best-feature-flag-tools-for-startups</a></span>,
                  "75.0", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Amplitude's comparison page targets startup buyers at the moment of vendor selection. Startups are GrowthBook's core audience. KD n/a = brand-new page, effectively zero competition.</span>
                ],
                [
                  <span><strong>Best Mobile A/B Testing for Developers</strong><br /><a href="https://amplitude.com/compare/best-mobile-ab-testing-for-developers" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">amplitude.com/compare/best-mobile-ab-testing-for-developers</a></span>,
                  "75.0", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Developers are GrowthBook's primary persona. Amplitude owns this bottom-of-funnel query unopposed. No KD data — page too new for DataForSEO tracking.</span>
                ],
                [
                  <span><strong>Best Product Experimentation Tools for Startups</strong><br /><a href="https://amplitude.com/compare/best-product-experimentation-tools-for-startups" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">amplitude.com/compare/best-product-experimentation-tools-for-startups</a></span>,
                  "75.0", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Third in Amplitude's startup experimentation cluster. Publishing all three GrowthBook equivalents in one sprint builds topical authority fast.</span>
                ],
                [
                  <span><strong>Top A/B Testing Platforms</strong><br /><a href="https://amplitude.com/compare/top-ab-testing-platforms" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">amplitude.com/compare/top-ab-testing-platforms</a></span>,
                  "75.0", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>High-intent comparison query. Amplitude is establishing itself as the go-to resource for buyers evaluating A/B testing platforms — GrowthBook is absent.</span>
                ],
              ]}
            />
          </Section>

          {/* Content Recommendations */}
          <Section title="Content Recommendations">
            <Table
              headers={["Action", "Score", "KD", "Bucket", "Rationale"]}
              rows={[
                [
                  <span style={{ fontSize: 13 }}>Write a /compare or /blog page targeting <strong>'Best feature flag tools for startups'</strong></span>,
                  "75", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Frame GrowthBook as the open-source, startup-friendly alternative. Amplitude owns this query unopposed. Low KD, high buyer intent — highest-leverage quick win.</span>
                ],
                [
                  <span style={{ fontSize: 13 }}>Write a developer-focused guide targeting <strong>'Best mobile A/B testing for developers'</strong></span>,
                  "75", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Lead with GrowthBook's SDK-first, open-source positioning. Developers are the primary buyer persona and Amplitude currently has no competition here.</span>
                ],
                [
                  <span style={{ fontSize: 13 }}>Write a startup experimentation guide targeting <strong>'Best product experimentation tools for startups'</strong></span>,
                  "75", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Third in the startup cluster. Publish all three as a sprint to build topical authority and intercept Amplitude's funnel at multiple entry points.</span>
                ],
                [
                  <span style={{ fontSize: 13 }}>Write a page targeting <strong>'Top A/B testing platforms'</strong> — position GrowthBook as the open-source, warehouse-native option</span>,
                  "75", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Amplitude is building a comparison content moat. GrowthBook needs at least one 'best-of' page to compete in this category before the gap widens further.</span>
                ],
                [
                  <span style={{ fontSize: 13 }}>Refresh /compare/growthbook-vs-launchdarkly to address feature flags + experimentation use cases</span>,
                  "75", "38", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>LaunchDarkly's feature flags page (KD 38) is the #1 ranked opportunity. The compare page got minimal clicks this week. Adding feature flags and experimentation depth would intercept buyers evaluating LaunchDarkly directly.</span>
                ],
              ]}
            />
          </Section>

          {/* Top 5 opportunities preview */}
          <Section title="Top 5 Content Opportunities">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {d.opportunities.map((o, i) => (
                <div key={i} style={{ ...card({ padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14 }) }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.accent, width: 32, textAlign: "center", flexShrink: 0 }}>#{o.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: C.primary }}>{o.topic}</span>
                      <BucketBadge bucket={o.bucket} />
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Lead: {o.competitor} · KD {o.kd} · Score {o.score}</div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{o.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </>)}

        {/* ── OPPORTUNITIES ── */}
        {tab === "opportunities" && (<>
          <Section title="Top 5 Content Opportunities">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
              Composite score (0–100): weighted blend of competitor domain authority, keyword difficulty (lower KD = easier to rank), and topic relevance.
              ≥75 = Quick Win | 60–74 = Content Gap | &lt;60 = Competitor Capture. KD 'n/a' = page too new, treat as low competition.
            </p>
            <Table
              headers={["Rank", "Topic", "Competitor", "Score", "KD", "Bucket", "Why It Matters"]}
              rows={d.opportunities.map(o => [
                `#${o.rank}`, o.topic, o.competitor, o.score, o.kd,
                <BucketBadge bucket={o.bucket} />, <span style={{ fontSize: 12, color: "#555" }}>{o.why}</span>
              ])}
            />
          </Section>

          <Section title="Striking Distance (Positions 8–20)">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
              Pages ranking just outside the top 10 — incremental optimization could move these into click territory.
            </p>
            <Table
              headers={["Query", "Position", "Impressions", "Clicks", "Opportunity"]}
              rows={d.striking_distance.map(q => [
                q.query, q.position, q.impressions.toLocaleString(), q.clicks,
                <OpportunityBadge opp={q.opportunity} />
              ])}
              compact
            />
          </Section>
        </>)}

        {/* ── COMPETITORS ── */}
        {tab === "competitors" && (<>
          <Section title="Competitor Organic Traffic (ETV)">
            <div style={{ ...card({ padding: "18px 20px" }) }}>
              {(() => {
                const max = Math.max(...d.competitors.map(c => c.etv));
                return d.competitors.map(c => (
                  <Bar key={c.name} label={c.name} value={c.etv} max={max} color={COMP_COLORS[c.name] || C.accent} />
                ));
              })()}
              <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 10, marginBottom: 0 }}>
                Note: GrowthBook ETV (~186) underreports actual traffic. GSC shows ~9,700 clicks/mo — 45% is branded search, which ETV doesn't count.
              </p>
            </div>
          </Section>

          <Section title="Competitor Detail">
            <Table
              headers={["Competitor", "Total ETV", "Pages", "Top Page", "Top Page ETV"]}
              rows={d.competitors.map(c => [
                <span style={{ fontWeight: 600, color: COMP_COLORS[c.name] || C.primary }}>{c.name}</span>,
                c.etv.toLocaleString(), c.pages, c.top_page, c.top_etv.toLocaleString()
              ])}
            />
          </Section>
        </>)}

        {/* ── GSC DETAIL ── */}
        {tab === "gsc" && (<>
          <Section title="Top Movers — Gains">
            <Table
              headers={["Page", "This Week", "Prior Week", "Change"]}
              rows={d.top_movers.gains.map(m => [
                m.url, m.clicks, m.prior,
                <span style={{ color: C.success, fontWeight: 700 }}>+{m.change}</span>
              ])}
              compact
            />
          </Section>

          <Section title="Top Movers — Declines">
            <Table
              headers={["Page", "This Week", "Prior Week", "Change"]}
              rows={d.top_movers.declines.map(m => [
                m.url, m.clicks, m.prior,
                <span style={{ color: C.danger, fontWeight: 700 }}>{m.change}</span>
              ])}
              compact
            />
          </Section>

          <Section title="Striking Distance (Positions 8–20)">
            <Table
              headers={["Query", "Position", "Impressions", "Clicks", "Opportunity"]}
              rows={d.striking_distance.map(q => [
                q.query, q.position, q.impressions.toLocaleString(), q.clicks,
                <OpportunityBadge opp={q.opportunity} />
              ])}
              compact
            />
          </Section>
        </>)}

        {/* ── YOUTUBE ── */}
        {tab === "youtube" && (<>
          {/* Narrative digest */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ ...card({ padding: 18, flex: 1, minWidth: 280, borderLeft: `4px solid ${C.success}` }) }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.success, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>GrowthBook YouTube</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#2C3E50" }}>
                GrowthBook's 'Faster Shipping Means You Need Testing More' is running at 5.9× channel average with 1,336 views, making it the standout video this week. 'Why Experimentation Matters from Ronny Kohavi' is at 3.8× with 855 views and 'Turn Experiment Results Into a Team Moment' is at 2.2× with 502 views — the Kohavi content franchise is clearly resonating and warrants a follow-on series.
              </p>
            </div>
            <div style={{ ...card({ padding: 18, flex: 1, minWidth: 280, borderLeft: `4px solid ${C.accent}` }) }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Competitor YouTube</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#2C3E50" }}>
                On the competitor side, Harness's 60-second load testing explainer hit 840 views at 6.0× their channel average — the short-form explainer format is working well for them. Amplitude had two AI-themed outliers: the AI Platform launch video at 6.0× (647 views) and AI Agents at 4.6× (495 views), reinforcing their AI positioning push across all channels. PostHog's startup interview questions video was the biggest absolute number at 4,706 views (5.5×), and Optimizely's 'AI search now knows more than you type' hit 4.3× — AI search content is clearly resonating across the competitive landscape right now.
              </p>
            </div>
          </div>

          <Section title="GrowthBook YouTube Outliers (2×+ channel avg)">
            <Table
              headers={["Title", "Views", "Multiplier"]}
              rows={d.youtube.gb_outliers.map(v => [
                v.title,
                v.views.toLocaleString(),
                <span style={{ fontWeight: 700, color: C.success }}>{v.mult}×</span>
              ])}
            />
            <p style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>
              The Kohavi content franchise is clearly resonating — warrants a follow-on series.
            </p>
          </Section>

          <Section title="Competitor YouTube Outliers (2×+ channel avg)">
            <Table
              headers={["Competitor", "Title", "Views", "Multiplier"]}
              rows={d.youtube.competitor_outliers.map(v => [
                <span style={{ color: COMP_COLORS[v.competitor] || C.primary, fontWeight: 600 }}>{v.competitor}</span>,
                v.title, v.views.toLocaleString(),
                <span style={{ fontWeight: 700, color: C.accent }}>{v.mult}×</span>
              ])}
            />
            <p style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>
              AI search content is resonating across the competitive landscape — Optimizely and Amplitude both have outlier AI-themed videos this week.
            </p>
          </Section>
        </>)}

        {/* ── NEW CONTENT ── */}
        {tab === "content" && (<>
          <Section title="New Competitor Pages This Week (High-Threat)">
            <Table
              headers={["Competitor", "Page / Topic", "Published", "Threat", "KD"]}
              rows={d.new_content.map(n => [
                <span style={{ color: COMP_COLORS[n.competitor] || C.primary, fontWeight: 600 }}>{n.competitor}</span>,
                n.slug,
                n.date || "—",
                <span style={{ fontWeight: 700, color: n.threat >= 8 ? C.danger : C.warning }}>{n.threat}/10</span>,
                n.kd
              ])}
            />
            <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>
              Amplitude's comparison content cluster (best feature flag tools for startups, best mobile A/B testing for developers) is the highest-priority threat — brand new pages with effectively zero competition.
            </p>
          </Section>
        </>)}

      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 24px", textAlign: "center", color: C.muted, fontSize: 12, background: C.white }}>
        Compy · GrowthBook Competitive Intelligence · {WEEK} · Data: GSC + DataForSEO + YouTube API
      </div>
    </div>
  );
}
