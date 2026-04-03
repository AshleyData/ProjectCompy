import { useState, useEffect } from "react";
import {
  BarChart, Bar as RBar, XAxis, YAxis, Tooltip as RTooltip, Legend,
  ScatterChart, Scatter, LineChart, Line,
  CartesianGrid, ResponsiveContainer, Cell,
} from "recharts";


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
  const [d, setD] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // Try today and each of the last 21 days to find the most recent data file
    const candidates = [];
    const d0 = new Date();
    for (let i = 0; i < 21; i++) {
      const dt = new Date(d0);
      dt.setDate(d0.getDate() - i);
      candidates.push(dt.toISOString().slice(0, 10));
    }
    const tryLoad = (i) => {
      if (i >= candidates.length) {
        setLoadError("No data file found.");
        return;
      }
      fetch(`/data/${candidates[i]}.json`)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(data => setD(data))
        .catch(() => tryLoad(i + 1));
    };
    tryLoad(0);
  }, []);

  if (!d) {
    return (
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F0F2F5" }}>
        {loadError
          ? <div style={{ color: "#C0392B", fontSize: 16 }}>⚠️ {loadError}</div>
          : <div style={{ color: "#6C757D", fontSize: 16 }}>Loading Compy data…</div>}
      </div>
    );
  }


  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: C.primary, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700 }}>🔍 Compy Weekly Brief</div>
          <div style={{ color: "#AED6F1", fontSize: 12 }}>GrowthBook Competitive Intelligence · Week of {d.week || "—"}</div>
        </div>
        <div style={{ color: "#AED6F1", fontSize: 12, textAlign: "right" }}>
          GSC: {(d.gsc.clicks||0).toLocaleString()} clicks · {d.gsc.wow_clicks > 0 ? "+" : ""}{d.gsc.wow_clicks}% WoW<br />
          {Math.round((d.gsc.impressions||0)/1000)}K impressions · {d.gsc.wow_impressions > 0 ? "+" : ""}{d.gsc.wow_impressions}% WoW
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
            <MetricCard label="Clicks" value={d.gsc.clicks.toLocaleString()} change={d.gsc.wow_clicks} sub={`${d.gsc.clicks_last.toLocaleString()} prior week`} />
            <MetricCard label="Impressions" value={`${Math.round(d.gsc.impressions/1000)}K`} change={d.gsc.wow_impressions} sub="prior week" />
            <MetricCard label="CTR" value={`${d.gsc.ctr.toFixed(2)}%`} sub="WoW" />
            <MetricCard label="Avg Position" value={d.gsc.avg_position} sub="WoW" />
            <MetricCard label="28-Day Clicks" value={d.gsc.trailing_28d_clicks.toLocaleString()} sub={`${d.gsc.mom_clicks > 0 ? "+" : ""}${d.gsc.mom_clicks}% MoM`} />
          </div>

          {/* Click breakdown */}
          <Section title="Click Breakdown (This Week)">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Branded", value: d.gsc.branded.toLocaleString(), note: "queries containing 'growthbook'" },
                { label: "Non-Branded", value: d.gsc.nonbranded.toLocaleString(), note: "organic discovery traffic" },
                { label: "Anonymized", value: d.gsc.anonymized.toLocaleString(), note: "low-volume queries (GSC privacy)" },
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

          {/* Content Recommendations — LLM-generated action items */}
          {(d.content_recommendations || []).length > 0 && (
            <Section title="Content Recommendations">
              <div style={{ ...card({ padding: "16px 20px" }) }}>
                {d.content_recommendations.map((rec, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: i < d.content_recommendations.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.accent, width: 24, flexShrink: 0, lineHeight: 1.4 }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: "#2C3E50", lineHeight: 1.6 }}>{rec}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Top 5 Content Opportunities — live data */}
          <Section title="Top 5 Competitor Content Opportunities">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
              Composite score (0–100): weighted blend of competitor domain authority, keyword difficulty (lower KD = easier to rank), and topic relevance. ≥75 = Quick Win | 60–74 = Content Gap | &lt;60 = Competitor Capture. KD 'n/a' = page too new, treat as low competition.
            </p>
            <Table
              headers={["Rank", "Topic", "Competitor", "Score", "KD", "Bucket", "Why It Matters"]}
              rows={d.opportunities.map(o => [
                `#${o.rank}`,
                <span style={{ display: "block", textAlign: "left" }}>{o.topic}</span>,
                <span style={{ display: "block", textAlign: "left" }}>{o.competitor}</span>,
                o.score, o.kd,
                <BucketBadge bucket={o.bucket} />,
                <span style={{ fontSize: 12, color: "#555" }}>{o.why}</span>
              ])}
            />
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
                <a href={`https://www.google.com/search?q=${encodeURIComponent(q.query)}+site:growthbook.io`} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none", display: "block", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{q.query}</a>,
                q.position, q.impressions.toLocaleString(), q.clicks,
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
                Note: GrowthBook ETV underreports actual organic traffic — branded search (~45% of clicks) is not counted by DataForSEO. See GSC tab for real click data.
              </p>
            </div>
          </Section>

          {/* Chart 5 — ETV trend over time, GrowthBook on secondary Y-axis */}
          {d.etv_trend && Object.keys(d.etv_trend).length > 0 && (() => {
            const allDates = [...new Set(Object.values(d.etv_trend).flatMap(pts => pts.map(p => p.date)))].sort();
            const lineData = allDates.map(date => {
              const row = { date: date.slice(5).replace("-", "/") }; // "03/27"
              Object.entries(d.etv_trend).forEach(([comp, pts]) => {
                const pt = pts.find(p => p.date === date);
                row[comp] = pt ? pt.etv : null;
              });
              return row;
            });
            const mainComps = Object.keys(d.etv_trend).filter(c => c !== "GrowthBook");
            return (
              <Section title="Competitor Total ETV — Weekly Trend">
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, textAlign: "left" }}>
                  GrowthBook (right axis, green) plotted separately due to scale difference — DataForSEO undercounts branded traffic.
                </p>
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart data={lineData} margin={{ left: 10, right: 60, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: C.success }} tickFormatter={v => v} domain={["auto", "auto"]} />
                    <RTooltip formatter={(v, name) => [v != null ? v.toLocaleString() : "—", name]} />
                    <Legend />
                    {mainComps.map(comp => (
                      <Line key={comp} yAxisId="left" type="monotone" dataKey={comp} stroke={COMP_COLORS[comp] || C.accent} strokeWidth={2} dot={false} connectNulls />
                    ))}
                    <Line yAxisId="right" type="monotone" dataKey="GrowthBook" stroke={C.success} strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 3 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </Section>
            );
          })()}

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
                <span style={{ display: "block", textAlign: "left" }}>{m.url}</span>, m.clicks, m.prior,
                <span style={{ color: C.success, fontWeight: 700 }}>+{m.change}</span>
              ])}
              compact
            />
          </Section>

          <Section title="Top Movers — Declines">
            <Table
              headers={["Page", "This Week", "Prior Week", "Change"]}
              rows={d.top_movers.declines.map(m => [
                <span style={{ display: "block", textAlign: "left" }}>{m.url}</span>, m.clicks, m.prior,
                <span style={{ color: C.danger, fontWeight: 700 }}>{m.change}</span>
              ])}
              compact
            />
          </Section>

          <Section title="Striking Distance (Positions 8–20)">
            <Table
              headers={["Query", "Position", "Impressions", "Clicks", "Opportunity"]}
              rows={d.striking_distance.map(q => [
                <a href={`https://www.google.com/search?q=${encodeURIComponent(q.query)}+site:growthbook.io`} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none", display: "block", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{q.query}</a>,
                q.position, q.impressions.toLocaleString(), q.clicks,
                <OpportunityBadge opp={q.opportunity} />
              ])}
              compact
            />
          </Section>

          {(d.compare_pages || []).length > 0 && (
            <Section title="Compare Pages (GSC)">
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
                GrowthBook /compare/ page performance from Google Search Console. Clicks, impressions, and average position this week vs prior week.
              </p>
              <Table
                headers={["Page", "Position", "Impressions", "Clicks (7d)", "WoW", "Clicks (28d)", "28d Δ"]}
                rows={(d.compare_pages || []).map(p => [
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none", display: "block", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{p.label}</a>,
                  p.position,
                  p.impressions.toLocaleString(),
                  p.clicks_this,
                  <span style={{ color: p.clicks_delta > 0 ? C.success : p.clicks_delta < 0 ? C.danger : C.muted, fontWeight: 700 }}>{p.clicks_delta > 0 ? "+" : ""}{p.clicks_delta}</span>,
                  p.clicks_28d,
                  <span style={{ color: p.clicks_28d_delta > 0 ? C.success : p.clicks_28d_delta < 0 ? C.danger : C.muted, fontWeight: 700 }}>{p.clicks_28d_delta > 0 ? "+" : ""}{p.clicks_28d_delta}</span>,
                ])}
                compact
              />
            </Section>
          )}
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
          {(() => {
            const counts = {};
            (d.new_content || []).forEach(n => { counts[n.competitor] = (counts[n.competitor] || 0) + 1; });
            const chartData = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
            return chartData.length > 0 ? (
              <Section title="New Pages Published This Week">
                <ResponsiveContainer width="100%" height={Math.max(120, chartData.length * 40)}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 30, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={95} />
                    <RTooltip formatter={(v) => [v, "New pages"]} />
                    <RBar dataKey="count" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, i) => <Cell key={i} fill={COMP_COLORS[entry.name] || C.accent} />)}
                    </RBar>
                  </BarChart>
                </ResponsiveContainer>
              </Section>
            ) : null;
          })()}
          <Section title="New Competitor Pages This Week (High-Threat)">
            <Table
              headers={["Competitor", "Page / Topic", "Published", "Threat", "KD"]}
              rows={d.new_content.map(n => [
                <span style={{ color: COMP_COLORS[n.competitor] || C.primary, fontWeight: 600, display: "block", textAlign: "left" }}>{n.competitor}</span>,
                <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none", display: "block", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{n.slug}</a>,
                n.date || "—",
                <span style={{ fontWeight: 700, color: n.threat >= 8 ? C.danger : C.warning }}>{n.threat}/10</span>,
                n.kd
              ])}
            />
            <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
              Pages scored 7–10 threat. Threat = competitor domain authority × keyword difficulty × topic relevance. Higher = more urgent to respond.
            </p>
          </Section>
        </>)}

        {/* ── ETV vs KD ── */}
        {tab === "etv_kd" && (<>
          {/* Chart 3 — Top 20 pages by ETV */}
          {(d.etv_kd || []).length > 0 && (() => {
            const top20 = d.etv_kd.slice(0, 20).map(r => ({
              label: (r.url || "").replace(/^www\./, "").split("/").slice(0, 3).join("/").slice(0, 38),
              etv: r.etv,
              competitor: r.competitor,
            })).reverse();
            return (
              <Section title="Top 20 Competitor Pages by Estimated Traffic">
                <ResponsiveContainer width="100%" height={540}>
                  <BarChart data={top20} layout="vertical" margin={{ left: 200, right: 50, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={195} />
                    <RTooltip formatter={(v) => [v.toLocaleString(), "Est. monthly traffic"]} />
                    <RBar dataKey="etv" radius={[0, 4, 4, 0]}>
                      {top20.map((entry, i) => <Cell key={i} fill={COMP_COLORS[entry.competitor] || C.accent} />)}
                    </RBar>
                  </BarChart>
                </ResponsiveContainer>
              </Section>
            );
          })()}

          {/* Chart 4 — ETV vs KD scatter */}
          {(d.etv_kd || []).length > 0 && (() => {
            const byComp = {};
            (d.etv_kd || []).forEach(r => {
              if (r.kd == null) return;
              if (!byComp[r.competitor]) byComp[r.competitor] = [];
              byComp[r.competitor].push({ x: r.kd, y: r.etv, title: r.title, url: r.url });
            });
            const comps = Object.keys(byComp).sort();
            return (
              <Section title="ETV vs Keyword Difficulty — Competitor Pages">
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, textAlign: "left" }}>
                  Top-left quadrant (low KD, high ETV) = highest-leverage content opportunities. Each dot = one competitor page.
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ left: 20, right: 30, top: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name="KD" domain={[0, 100]} label={{ value: "Keyword Difficulty", position: "insideBottom", offset: -10, fontSize: 12 }} tick={{ fontSize: 11 }} />
                    <YAxis type="number" dataKey="y" name="ETV" tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} tick={{ fontSize: 11 }} />
                    <RTooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const p = payload[0].payload;
                      return (
                        <div style={{ background: "#fff", border: `1px solid ${C.border}`, padding: "8px 12px", fontSize: 12, maxWidth: 260 }}>
                          <div style={{ fontWeight: 700, marginBottom: 4 }}>{payload[0].name || ""}</div>
                          <div style={{ color: C.muted, marginBottom: 2 }}>{(p.title || "").slice(0, 55)}</div>
                          <div>ETV: <strong>{(p.y || 0).toLocaleString()}</strong> · KD: <strong>{p.x}</strong></div>
                        </div>
                      );
                    }} />
                    <Legend />
                    {comps.map(comp => (
                      <Scatter key={comp} name={comp} data={byComp[comp]} fill={COMP_COLORS[comp] || C.accent} opacity={0.8} />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </Section>
            );
          })()}

          <Section title="Top Pages: ETV vs Keyword Difficulty">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
              Top competitor pages ranked by estimated monthly visitors (ETV), with their keyword difficulty (KD 0–100). Lower KD = easier to rank; higher ETV = more traffic at stake. Pages in the top-left quadrant (high ETV, low KD) are the highest-leverage targets.
            </p>
            <Table
              headers={["Competitor", "Title", "URL", "ETV", "KD"]}
              rows={d.etv_kd.map(row => [
                <span style={{ color: COMP_COLORS[row.competitor] || C.primary, fontWeight: 600 }}>{row.competitor}</span>,
                <span style={{ display: "block", textAlign: "left" }}>{row.title}</span>,
                <a href={`https://${row.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none", display: "block", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{row.url}</a>,
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
        Compy · GrowthBook Competitive Intelligence · {d.week || "—"} · Data: GSC + DataForSEO + YouTube API
      </div>
    </div>
  );
}
