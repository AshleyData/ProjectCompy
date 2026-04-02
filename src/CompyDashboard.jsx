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
  etv_kd: [
    { competitor: "Optimizely", title: "What is A/B testing?", url: "optimizely.com/optimization-glossary/ab-testing/", etv: 251651, kd: 72 },
    { competitor: "Amplitude Exp", title: "Correlation vs Causation", url: "amplitude.com/blog/causation-vs-correlation", etv: 123936, kd: 35 },
    { competitor: "Harness", title: "What is A/B Testing?", url: "harness.io/learn/ab-testing", etv: 92685, kd: 72 },
    { competitor: "Statsig", title: "What is an experimental control?", url: "statsig.com/blog/experimental-control", etv: 49870, kd: 15 },
    { competitor: "Statsig", title: "What is Hypothesis Testing?", url: "statsig.com/blog/hypothesis-testing", etv: 42100, kd: 48 },
    { competitor: "Optimizely", title: "What is Multivariate Testing?", url: "optimizely.com/optimization-glossary/multivariate-testing/", etv: 38200, kd: 55 },
    { competitor: "Statsig", title: "What is Statistical Significance?", url: "statsig.com/blog/statistical-significance", etv: 35600, kd: 52 },
    { competitor: "Harness", title: "Blue Green Deployment", url: "harness.io/blog/blue-green-deployment", etv: 29800, kd: 28 },
    { competitor: "LaunchDarkly", title: "Smoke Testing Guide", url: "launchdarkly.com/blog/smoke-testing/", etv: 5011, kd: 12 },
    { competitor: "Optimizely", title: "Feature Management Guide", url: "optimizely.com/insights/blog/feature-management/", etv: 4900, kd: 30 },
    { competitor: "Eppo", title: "A/B testing vs. split testing", url: "geteppo.com/blog/ab-testing-vs-split-testing", etv: 4212, kd: 8 },
    { competitor: "Unleash", title: "Trunk-Based Development", url: "getunleash.io/blog/trunk-based-development", etv: 2081, kd: 22 },
    { competitor: "PostHog", title: "Product engineer vs software engineer", url: "posthog.com/blog/product-engineer", etv: 898, kd: 18 },
    { competitor: "Flagsmith", title: "Canary Deployment", url: "flagsmith.com/blog/canary-deployments/", etv: 258, kd: 14 },
    { competitor: "GrowthBook", title: "What is A/B Testing?", url: "growthbook.io/blog/ab-testing", etv: 51, kd: 72 },
  ],
  youtube: {
    channels: [
      { name: "GrowthBook", avg_views: 226, video_count: 20, videos: [
        { title: "Faster Shipping Means You Need Testing More", views: 1336, mult: 5.9, date: "2026-03-23", url: "https://www.youtube.com/watch?v=uKeE193-ZR0", is_outlier: true },
        { title: "Why Experimentation Matters from Ronny Kohavi", views: 855, mult: 3.8, date: "2026-03-09", url: "https://www.youtube.com/watch?v=hCdsYUmkWcg", is_outlier: true },
        { title: "Turn Experiment Results Into a Team Moment", views: 502, mult: 2.2, date: "2026-03-30", url: "https://www.youtube.com/watch?v=ei_eosUMlHI", is_outlier: true },
        { title: "Test Your AI Changes. Every Single One.", views: 270, mult: 1.2, date: "2026-03-27", url: "https://www.youtube.com/watch?v=4-iSPAnz5ag", is_outlier: false },
        { title: "High Engagement Can Be a Red Flag", views: 209, mult: 0.9, date: "2026-03-12", url: "https://www.youtube.com/watch?v=vxrrg-K9oVE", is_outlier: false },
      ]},
      { name: "LaunchDarkly", avg_views: 82, video_count: 20, videos: [
        { title: "InFocus - AWS: Move from model launch to live test in hours", views: 215, mult: 2.6, date: "2026-03-12", url: "https://www.youtube.com/watch?v=arDf4b1fa4w", is_outlier: true },
        { title: "Building an Observable Multiagent Architecture with Opentelemetry", views: 145, mult: 1.8, date: "2026-03-06", url: "https://www.youtube.com/watch?v=5zxMrxIuN0Y", is_outlier: false },
        { title: "InFocus - Poka: Ship AI faster without redeploys", views: 129, mult: 1.6, date: "2026-03-12", url: "https://www.youtube.com/watch?v=qsh8ClQZv3A", is_outlier: false },
      ]},
      { name: "Statsig", avg_views: 128, video_count: 4, videos: [
        { title: "Advanced methods for faster experimentation", views: 305, mult: 2.4, date: "2026-01-29", url: "https://www.youtube.com/watch?v=uxV0teHXBjA", is_outlier: true },
        { title: "Brex x Statsig Customer Story", views: 89, mult: 0.7, date: "2026-01-12", url: "https://www.youtube.com/watch?v=EZcplcvRJxU", is_outlier: false },
        { title: "Life360 x Statsig Customer Story", views: 67, mult: 0.5, date: "2026-01-09", url: "https://www.youtube.com/watch?v=-d0AHF_LGis", is_outlier: false },
      ]},
      { name: "Optimizely", avg_views: 100, video_count: 20, videos: [
        { title: "AI search now knows more than you type...", views: 435, mult: 4.3, date: "2026-03-20", url: "https://www.youtube.com/watch?v=miRcqXTLxew", is_outlier: true },
        { title: "Worse content is winning in AI search... here's why", views: 231, mult: 2.3, date: "2026-03-24", url: "https://www.youtube.com/watch?v=RKOV2O3tnp8", is_outlier: true },
        { title: "People built more in days than years with AI", views: 216, mult: 2.2, date: "2026-03-17", url: "https://www.youtube.com/watch?v=ElxKJGQkTGE", is_outlier: true },
        { title: "How AI actually judges good content", views: 181, mult: 1.8, date: "2026-03-30", url: "https://www.youtube.com/watch?v=bIuLnZCAW48", is_outlier: false },
        { title: "The $2M reason we replaced our digital platform: CompTIA CEO", views: 168, mult: 1.7, date: "2026-03-23", url: "https://www.youtube.com/watch?v=gJJNPh9_6fs", is_outlier: false },
      ]},
      { name: "Harness", avg_views: 139, video_count: 20, videos: [
        { title: "What is Load Testing? Explained in 60 Seconds", views: 840, mult: 6.0, date: "2026-03-25", url: "https://www.youtube.com/watch?v=FnbyQBGigpg", is_outlier: true },
        { title: "What is Disaster Recovery Testing? Explained in 60 seconds", views: 367, mult: 2.6, date: "2026-03-27", url: "https://www.youtube.com/watch?v=Airf_IXxiEA", is_outlier: true },
        { title: "Harness AI + MCP server: A Single Prompt to Accelerate the Software Delivery Lifecycle", views: 327, mult: 2.4, date: "2026-03-06", url: "https://www.youtube.com/watch?v=9ryOw-9foO0", is_outlier: true },
        { title: "Secure AI Coding with Harness SAST and SCA on Windsurf", views: 228, mult: 1.6, date: "2026-03-26", url: "https://www.youtube.com/watch?v=GyJjNKvwgpA", is_outlier: false },
        { title: "Crown Jewels In, Crown Jewels Out - The Hidden Risk of AI", views: 143, mult: 1.0, date: "2026-02-10", url: "https://www.youtube.com/watch?v=wzY303nno4Y", is_outlier: false },
      ]},
      { name: "Eppo", avg_views: 0, video_count: 0, no_recent: true, videos: [] },
      { name: "Amplitude Exp", avg_views: 108, video_count: 20, videos: [
        { title: "The new way to do analytics - meet the Amplitude AI Platform", views: 647, mult: 6.0, date: "2026-02-17", url: "https://www.youtube.com/watch?v=sOTEc15fxPE", is_outlier: true },
        { title: "Amplitude AI Agents: Your Own Personal Data Analysts", views: 495, mult: 4.6, date: "2026-02-17", url: "https://www.youtube.com/watch?v=1qqlVRJE_aY", is_outlier: true },
        { title: "Agent Analytics: Inside the Black Box | Amplitude AI", views: 184, mult: 1.7, date: "2026-03-19", url: "https://www.youtube.com/watch?v=w79kHtcp5Kw", is_outlier: false },
        { title: "Amplitude AI: Your unfair advantage", views: 170, mult: 1.6, date: "2026-03-12", url: "https://www.youtube.com/watch?v=dA2bfWPK2Bs", is_outlier: false },
      ]},
      { name: "Unleash", avg_views: 178, video_count: 2, videos: [
        { title: "Live Webinar: Designing for Failure and Speed in Agentic AI Workflows", views: 234, mult: 1.3, date: "2026-02-24", url: "https://www.youtube.com/watch?v=cA0aCzV0MMY", is_outlier: false },
        { title: "FeatureOps as Strategy: Governing Hyper-Growth at Lloyds", views: 122, mult: 0.7, date: "2026-01-19", url: "https://www.youtube.com/watch?v=4dT3gUYvE0c", is_outlier: false },
      ]},
      { name: "Flagsmith", avg_views: 49, video_count: 3, videos: [
        { title: "Feature Flag Cleanup at Scale: How to Eliminate Technical Debt with AI", views: 73, mult: 1.5, date: "2026-03-19", url: "https://www.youtube.com/watch?v=CYBBpLdAavo", is_outlier: false },
        { title: "Feature Flags: A Safety Net in the AI Era", views: 62, mult: 1.3, date: "2026-01-28", url: "https://www.youtube.com/watch?v=6D4gtW7XrTI", is_outlier: false },
      ]},
      { name: "PostHog", avg_views: 857, video_count: 20, videos: [
        { title: "The startup interview questions that actually matter", views: 4706, mult: 5.5, date: "2026-02-11", url: "https://www.youtube.com/watch?v=KVMZgY2KNto", is_outlier: true },
        { title: "PostHog AI can now search the web", views: 2290, mult: 2.7, date: "2026-02-06", url: "https://www.youtube.com/watch?v=gf3fbNWCuf4", is_outlier: true },
        { title: "Introducing Logs by PostHog", views: 2147, mult: 2.5, date: "2026-02-19", url: "https://www.youtube.com/watch?v=e_SICQg2Wak", is_outlier: true },
        { title: "We built an open-source developer toy...", views: 784, mult: 0.9, date: "2026-02-13", url: "https://www.youtube.com/watch?v=7jQd858EWGc", is_outlier: false },
        { title: "PostHog: The Documentary (Full Version)", views: 755, mult: 0.9, date: "2026-03-23", url: "https://www.youtube.com/watch?v=dGaSxBs3OsU", is_outlier: false },
      ]},
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
  { id: "etv_kd", label: "📉 ETV vs KD" },
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
                <p key={i} style={{ margin: i === 0 ? 0 : "14px 0 0", lineHeight: 1.65, color: "#2C3E50", fontSize: 14, textAlign: "left" }}>{p}</p>
              ))}
            </div>
          </Section>

          {/* Top 5 Competitor Content Opportunities */}
          <Section title="Top 5 Competitor Content Opportunities">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
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
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
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
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
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
              <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 10, marginBottom: 0, textAlign: "left" }}>
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
        {tab === "youtube" && (() => {
          const channels = d.youtube.channels;
          const gbCh = channels.find(c => c.name === "GrowthBook") || { videos: [], avg_views: 0, video_count: 0 };
          const gbOutliers = (gbCh.videos || []).filter(v => v.is_outlier).sort((a, b) => b.mult - a.mult);
          const compOutliers = channels
            .filter(c => c.name !== "GrowthBook")
            .flatMap(c => (c.videos || []).filter(v => v.is_outlier).map(v => ({ ...v, competitor: c.name })))
            .sort((a, b) => b.mult - a.mult);

          const gbNarrative = gbOutliers.length === 0
            ? "No GrowthBook videos exceeded 2× channel average this week."
            : (() => {
                const top = gbOutliers[0];
                let line = `GrowthBook's '${top.title}' is running at ${top.mult}× channel average with ${top.views.toLocaleString()} views`;
                if (gbOutliers.length > 1) {
                  const others = gbOutliers.slice(1, 3).map(v => `'${v.title}' at ${v.mult}× with ${v.views.toLocaleString()} views`).join("; ");
                  line += `, followed by ${others}`;
                }
                return line + ".";
              })();

          const compNarrative = compOutliers.length === 0
            ? "No competitor videos exceeded 2× channel average this week."
            : "On the competitor side: " + compOutliers.slice(0, 4).map(v =>
                `${v.competitor}'s '${v.title.slice(0, 55)}${v.title.length > 55 ? "…" : ""}' at ${v.mult}× (${v.views.toLocaleString()} views)`
              ).join("; ") + ".";

          return (<>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              <div style={{ ...card({ padding: 18, flex: 1, minWidth: 280, borderLeft: `4px solid ${C.success}` }) }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.success, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>GrowthBook YouTube</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#2C3E50", textAlign: "left" }}>{gbNarrative}</p>
              </div>
              <div style={{ ...card({ padding: 18, flex: 1, minWidth: 280, borderLeft: `4px solid ${C.accent}` }) }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Competitor YouTube</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#2C3E50", textAlign: "left" }}>{compNarrative}</p>
              </div>
            </div>

            <Section title="All Channels — YouTube Tracker (90-day window, 2× outlier threshold)">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#1B4F72" }}>
                    {["Channel", "Videos (90d)", "Avg Views", "Outliers", "Title", "Views", "Mult", "Date"].map(h => (
                      <th key={h} style={{ padding: "6px 8px", color: "#fff", textAlign: "left", fontWeight: 700, whiteSpace: "nowrap", ...(h === "Title" ? { minWidth: 360 } : {}) }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {channels.map((ch, ci) => {
                    const isGB = ch.name === "GrowthBook";
                    const outlierVids = (ch.videos || []).filter(v => v.is_outlier);
                    const topNonOutliers = (ch.videos || []).filter(v => !v.is_outlier).sort((a, b) => b.views - a.views).slice(0, 2);
                    const displayVids = ch.no_recent ? [] : [...outlierVids, ...topNonOutliers];
                    const outlierCount = outlierVids.length;
                    const rowBg = isGB ? "#F0FFF4" : (ci % 2 === 0 ? "#fff" : "#F8F9FA");
                    const chColor = isGB ? C.success : (COMP_COLORS[ch.name] || C.primary);

                    if (ch.no_recent) {
                      return (
                        <tr key={ch.name} style={{ background: rowBg }}>
                          <td style={{ padding: "5px 8px", fontWeight: 700, color: chColor }}>{ch.name}</td>
                          <td style={{ padding: "5px 8px", color: C.muted, textAlign: "center" }}>0</td>
                          <td style={{ padding: "5px 8px", color: C.muted, textAlign: "right" }}>—</td>
                          <td style={{ padding: "5px 8px", color: C.muted, textAlign: "center" }}>0</td>
                          <td style={{ padding: "5px 8px", color: C.muted, fontStyle: "italic" }}>No uploads in last 90 days</td>
                          <td colSpan={4} />
                        </tr>
                      );
                    }

                    return displayVids.map((v, vi) => (
                      <tr key={`${ch.name}-${vi}`} style={{ background: rowBg, borderBottom: "1px solid #E9ECEF" }}>
                        {vi === 0 ? (
                          <>
                            <td style={{ padding: "5px 8px", fontWeight: 700, color: chColor, verticalAlign: "top" }}>{ch.name}</td>
                            <td style={{ padding: "5px 8px", color: C.muted, verticalAlign: "top", textAlign: "center" }}>{ch.video_count}</td>
                            <td style={{ padding: "5px 8px", color: C.muted, verticalAlign: "top", textAlign: "right" }}>{(ch.avg_views || 0).toLocaleString()}</td>
                            <td style={{ padding: "5px 8px", color: outlierCount > 0 ? C.danger : C.muted, fontWeight: outlierCount > 0 ? 700 : 400, verticalAlign: "top", textAlign: "center" }}>{outlierCount}</td>
                          </>
                        ) : (
                          <><td /><td /><td /><td /></>
                        )}
                        <td style={{ padding: "5px 8px", minWidth: 360, maxWidth: 480, textAlign: "left" }}>{v.is_outlier ? "🔥 " : "📊 "}<a href={v.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }} onMouseOver={e => e.target.style.textDecoration="underline"} onMouseOut={e => e.target.style.textDecoration="none"}>{v.title}</a></td>
                        <td style={{ padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap" }}>{v.views.toLocaleString()}</td>
                        <td style={{ padding: "5px 8px", fontWeight: 700, color: isGB ? C.success : C.accent, whiteSpace: "nowrap" }}>{v.mult}×</td>
                        <td style={{ padding: "5px 8px", color: C.muted, whiteSpace: "nowrap" }}>{v.date}</td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
                🔥 = 2× or more views vs channel's 90-day average. 📊 = top non-outlier videos for context. Source: YouTube Data API v3.
              </p>
            </Section>
          </>);
        })()}

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
            <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
              Amplitude's comparison content cluster (best feature flag tools for startups, best mobile A/B testing for developers) is the highest-priority threat — brand new pages with effectively zero competition.
            </p>
          </Section>
        </>)}

        {/* ── ETV vs KD ── */}
        {tab === "etv_kd" && (<>
          <Section title="Top Pages: ETV vs Keyword Difficulty">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
              Top competitor pages ranked by estimated monthly visitors (ETV), with their keyword difficulty (KD 0–100). Lower KD = easier to rank; higher ETV = more traffic at stake. Pages in the top-left quadrant (high ETV, low KD) are the highest-leverage targets.
            </p>
            <Table
              headers={["Competitor", "Title", "URL", "ETV", "KD"]}
              rows={d.etv_kd.map(row => [
                <span style={{ color: COMP_COLORS[row.competitor] || C.primary, fontWeight: 600 }}>{row.competitor}</span>,
                row.title,
                <a href={`https://${row.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none" }} onMouseOver={e => e.target.style.textDecoration="underline"} onMouseOut={e => e.target.style.textDecoration="none"}>{row.url}</a>,
                row.etv.toLocaleString(),
                <span style={{ fontWeight: 700, color: row.kd >= 60 ? C.danger : row.kd >= 30 ? C.warning : C.success }}>{row.kd}</span>,
              ])}
            />
            <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
              KD color: <span style={{ color: C.success, fontWeight: 700 }}>green = easy (&lt;30)</span> · <span style={{ color: C.warning, fontWeight: 700 }}>orange = moderate (30–59)</span> · <span style={{ color: C.danger, fontWeight: 700 }}>red = hard (60+)</span>.
              Source: DataForSEO. GrowthBook ETV underreports — see GSC for actual traffic.
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
