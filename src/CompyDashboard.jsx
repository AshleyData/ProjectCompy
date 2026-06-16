import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  BarChart, Bar as RBar, XAxis, YAxis, Tooltip as RTooltip, Legend,
  ScatterChart, Scatter, ZAxis, LineChart, Line,
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

// External-data URLs (competitor sitemaps, GSC pages, DataForSEO) may lack a
// scheme or, in the hostile case, carry a javascript: scheme — only ever link
// to http(s). Scheme-less values get https:// prepended.
function safeHref(url) {
  const u = (url || "").trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return "#"; // javascript:, data:, etc.
  return u ? `https://${u}` : "#";
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
const DataTable = Table;

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.primary, borderBottom: `2px solid ${C.accent}`, paddingBottom: 6, marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  );
}

function BubbleChart({ competitors }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 700, H = 360;
  const ml = 55, mr = 24, mt = 20, mb = 52;
  const plotW = W - ml - mr, plotH = H - mt - mb;
  const maxPages = 430, minDA = 25, maxDA = 90;
  const maxETV = Math.max(...competitors.map(c => c.etv));
  const toX = p => ml + (p / maxPages) * plotW;
  const toY = da => mt + plotH - ((da - minDA) / (maxDA - minDA)) * plotH;
  const toR = etv => 6 + Math.sqrt(etv / maxETV) * 38;
  const xTicks = [0, 100, 200, 300, 400];
  const yTicks = [30, 40, 50, 60, 70, 80, 90];
  return (
    <Section title="Content Volume vs. Domain Authority">
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 8, textAlign: "left" }}>
        X-axis: pages of content &nbsp;|&nbsp; Y-axis: Moz Domain Authority &nbsp;|&nbsp; Bubble size: estimated organic traffic (ETV)
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block', margin: '0 auto', minWidth: 320 }}>
          {yTicks.map(v => (
            <line key={"y"+v} x1={ml} x2={ml+plotW} y1={toY(v)} y2={toY(v)} stroke="#DEE2E6" strokeWidth={1} strokeDasharray="4 3" />
          ))}
          {xTicks.map(v => (
            <line key={"x"+v} x1={toX(v)} x2={toX(v)} y1={mt} y2={mt+plotH} stroke="#DEE2E6" strokeWidth={1} strokeDasharray="4 3" />
          ))}
          <line x1={ml} x2={ml+plotW} y1={mt+plotH} y2={mt+plotH} stroke="#999" strokeWidth={1.5} />
          <line x1={ml} x2={ml} y1={mt} y2={mt+plotH} stroke="#999" strokeWidth={1.5} />
          {xTicks.map(v => (
            <g key={"xt"+v}>
              <line x1={toX(v)} x2={toX(v)} y1={mt+plotH} y2={mt+plotH+5} stroke="#999" />
              <text x={toX(v)} y={mt+plotH+18} textAnchor="middle" fontSize={11} fill="#6C757D">{v}</text>
            </g>
          ))}
          {yTicks.map(v => (
            <g key={"yt"+v}>
              <line x1={ml-5} x2={ml} y1={toY(v)} y2={toY(v)} stroke="#999" />
              <text x={ml-9} y={toY(v)+4} textAnchor="end" fontSize={11} fill="#6C757D">{v}</text>
            </g>
          ))}
          <text x={ml+plotW/2} y={H-8} textAnchor="middle" fontSize={12} fill="#6C757D">Pages of Content</text>
          <text x={14} y={mt+plotH/2} textAnchor="middle" fontSize={12} fill="#6C757D"
            transform={`rotate(-90,14,${mt+plotH/2})`}>Domain Authority</text>
          {[...competitors].sort((a,b) => b.etv - a.etv).map(c => {
            const cx = toX(c.pages), cy = toY(c.da || 0), r = toR(c.etv);
            const color = COMP_COLORS[c.name] || C.accent;
            const isGB = c.name === 'GrowthBook';
            return (
              <g key={c.name} onMouseEnter={() => setTooltip({c,cx,cy})} onMouseLeave={() => setTooltip(null)} style={{cursor:'pointer'}}>
                <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.72}
                  stroke={color} strokeWidth={1} />
                <text x={cx} y={cy - r - 4} textAnchor="middle" fontSize={10} fill={color}
                  fontWeight={isGB ? 700 : 500}>{c.name}</text>
              </g>
            );
          })}
          {tooltip && (()=>{
            const {c, cx, cy} = tooltip;
            const bx = Math.min(cx+14, W-185), by = Math.max(Math.min(cy-15, H-80), mt);
            return (
              <g>
                <rect x={bx} y={by} width={172} height={70} rx={6} fill="white" stroke="#DEE2E6" strokeWidth={1} />
                <text x={bx+10} y={by+19} fontSize={12} fontWeight={700} fill={COMP_COLORS[c.name]||C.primary}>{c.name}</text>
                <text x={bx+10} y={by+36} fontSize={11} fill="#333">{"DA: "}{c.da||0}{"   Pages: "}{c.pages}</text>
                <text x={bx+10} y={by+53} fontSize={11} fill="#333">{"ETV: "}{c.etv.toLocaleString()}</text>
              </g>
            );
          })()}
        </svg>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 14px', marginTop:10, justifyContent:'center' }}>
        {competitors.map(c => (
          <div key={c.name} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12 }}>
            <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background: COMP_COLORS[c.name]||C.accent }} />
            <span style={{ color: C.muted }}>{c.name}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize:11, color:C.muted, textAlign:'left', marginTop:8 }}>
        DA scores from Moz (fetched 2026-04-03). GrowthBook ETV undercounts branded traffic (~55% of clicks).
      </p>
    </Section>
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

// Primary tabs carry the decision-layer story (Strategy first). Everything else is
// reference material reachable from the "More ▾" drawer. The Opportunities tab was
// retired into Strategy, so it no longer appears here.
const PRIMARY_TABS = [
  { id: "strategy", label: "🧭 Strategy" },
  { id: "seo_scorecard", label: "🏆 SEO Scorecard" },
  { id: "summary", label: "📊 Summary" },
];
const MORE_TABS = [
  { id: "competitors", label: "🏁 Competitors" },
  { id: "gsc", label: "📈 GSC Detail" },
  { id: "youtube", label: "▶️ YouTube" },
  { id: "content", label: "🆕 New Content" },
  { id: "etv_kd", label: "📉 ETV vs KD" },
  { id: "growthbook", label: "📗 GrowthBook" },
];
const TABS = [...PRIMARY_TABS, ...MORE_TABS];

// Live, on-click page-aware advice. Calls the /api/generate-advice serverless
// function, which fetches the page's real content + the row's ACP/NCV context and
// asks Claude for specific edits. Each cell owns its request state.
function AdviceCell({ item, context, fallback }) {
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [advice, setAdvice] = useState("");
  const [err, setErr] = useState("");

  async function generate() {
    setState("loading");
    setErr("");
    try {
      const r = await fetch("/api/generate-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item, context }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setAdvice(data.advice || "(no advice returned)");
      setState("done");
    } catch (e) {
      setErr(String(e.message || e));
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div style={{ fontSize: 11, textAlign: "left", lineHeight: 1.5, whiteSpace: "pre-wrap", color: "#2C3E50" }}>
        {advice}
        <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>✨ generated by Claude from this page</div>
      </div>
    );
  }
  if (state === "loading") {
    return <span style={{ fontSize: 11, color: C.muted }}>Analyzing the page…</span>;
  }
  return (
    <div style={{ textAlign: "left" }}>
      <button onClick={generate} style={{
        fontSize: 11, fontWeight: 600, color: C.white, background: C.accent, border: "none",
        borderRadius: 5, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap",
      }}>✨ Generate advice</button>
      {state === "error" && (
        <div style={{ fontSize: 10, color: C.danger, marginTop: 4 }}>
          {err}{" "}
          <button onClick={generate} style={{ border: "none", background: "none", color: C.accent, cursor: "pointer", fontSize: 10, padding: 0, textDecoration: "underline" }}>retry</button>
          {fallback ? <div style={{ color: C.muted, marginTop: 3 }}>Playbook: {fallback}</div> : null}
        </div>
      )}
    </div>
  );
}

export default function CompyDashboard() {
  const [tab, setTab] = useState("strategy");
  const [moreOpen, setMoreOpen] = useState(false);
  // Recently-Shipped track filter: null = show all; else "AI (Insights)" | "Editorial".
  const [ncvTrack, setNcvTrack] = useState(null);
  const [d, setD] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // On mount: find and load the most recent data file immediately, then populate dropdown
  useEffect(() => {
    // Build candidate dates: last 60 days
    const candidates = [];
    const d0 = new Date();
    for (let i = 0; i < 60; i++) {
      const dt = new Date(d0);
      dt.setDate(d0.getDate() - i);
      candidates.push(dt.toISOString().slice(0, 10));
    }

    // Walk candidates SEQUENTIALLY (not in parallel) — stop as soon as the first valid file is found,
    // then continue scanning the rest only to build the dropdown (never overwrite d after first load).
    let loaded = false;
    const tryLoad = async () => {
      const found = [];
      for (let i = 0; i < candidates.length; i++) {
        const date = candidates[i];
        try {
          const r = await fetch(`/data/${date}.json`);
          if (!r.ok) continue;
          const data = await r.json();
          const hasData = !!(data && data.week);  // any coherent payload, not just ones with gb_pages
          if (hasData) {
            if (!loaded) {
              loaded = true;
              setD(data);
              setSelectedDate(date);
            }
            found.push(date);
          }
        } catch (_) { /* skip */ }
      }
      if (found.length === 0) setLoadError("No data file found.");
      else setAvailableDates(found);
    };
    tryLoad();
  }, []);

  const loadDate = (date) => {
    fetch(`/data/${date}.json`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => { setD(data); setSelectedDate(date); })
      .catch(() => setLoadError(`Failed to load data for ${date}.`));
  };

  if (!d) {
    return (
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F0F2F5" }}>
        {loadError
          ? <div style={{ color: "#C0392B", fontSize: 16 }}>⚠️ {loadError}</div>
          : <div style={{ color: "#6C757D", fontSize: 16 }}>Loading Compy data…</div>}
      </div>
    );
  }

  // The generator emits {data_missing: true, clicks: null, ...} (without ctr,
  // clicks_last, branded, …) when GSC data was unavailable for the run. Every
  // GSC render below must go through this guard or null-safe accessors —
  // unguarded .toLocaleString()/.toFixed() white-screened the whole dashboard.
  const gscMissing = !!d.gsc?.data_missing;


  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: C.primary, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700 }}>🔍 Compy Weekly Brief</div>
          <div style={{ color: "#AED6F1", fontSize: 12 }}>GrowthBook Competitive Intelligence · Week of {d.week || "—"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {availableDates.length > 1 && (
            <select
              value={selectedDate || ""}
              onChange={e => loadDate(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.12)", color: C.white, border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", outline: "none",
              }}
            >
              {availableDates.map(date => (
                <option key={date} value={date} style={{ background: C.primary, color: C.white }}>
                  {date}
                </option>
              ))}
            </select>
          )}
          <div style={{ color: "#AED6F1", fontSize: 12, textAlign: "right" }}>
            {gscMissing
              ? <>GSC data unavailable for this run</>
              : <>
                  GSC: {(d.gsc.clicks||0).toLocaleString()} clicks · {(d.gsc.wow_clicks ?? 0) > 0 ? "+" : ""}{d.gsc.wow_clicks ?? 0}% WoW<br />
                  {Math.round((d.gsc.impressions||0)/1000)}K impressions · {(d.gsc.wow_impressions ?? 0) > 0 ? "+" : ""}{d.gsc.wow_impressions ?? 0}% WoW
                </>}
          </div>
        </div>
      </div>

      {/* Tabs — three primary tabs always visible; the rest live behind "More ▾".
          The outer bar must NOT set overflow (an overflow on either axis computes
          the other axis to "auto" too, which clips the absolutely-positioned
          dropdown). The primary tabs scroll inside their own inner container; the
          More button + dropdown sit in the non-clipping outer bar. */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", position: "relative" }}>
        <div style={{ display: "flex", overflowX: "auto", flex: 1, minWidth: 0 }}>
          {PRIMARY_TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setMoreOpen(false); }} style={{
              padding: "11px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13,
              fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? C.accent : C.muted, whiteSpace: "nowrap",
              borderBottom: tab === t.id ? `3px solid ${C.accent}` : "3px solid transparent",
            }}>{t.label}</button>
          ))}
        </div>
        {/* More drawer: holds reference tabs. Highlights when one of its tabs is active. */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {(() => {
            const activeInMore = MORE_TABS.find(t => t.id === tab);
            return (
              <button onClick={() => setMoreOpen(o => !o)} style={{
                padding: "11px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13,
                fontWeight: activeInMore ? 700 : 400, color: activeInMore || moreOpen ? C.accent : C.muted, whiteSpace: "nowrap",
                borderBottom: activeInMore ? `3px solid ${C.accent}` : "3px solid transparent",
              }}>{activeInMore ? activeInMore.label : "More"} ▾</button>
            );
          })()}
          {moreOpen && (
            <div style={{
              position: "absolute", right: 0, top: "100%", background: C.white, border: `1px solid ${C.border}`,
              borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 30, minWidth: 180, padding: "4px 0",
            }}>
              {MORE_TABS.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setMoreOpen(false); }} style={{
                  display: "block", width: "100%", textAlign: "left", padding: "9px 16px", border: "none",
                  background: tab === t.id ? C.bg : "none", cursor: "pointer", fontSize: 13,
                  fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? C.accent : C.muted, whiteSpace: "nowrap",
                }}>{t.label}</button>
              ))}
            </div>
          )}
        </div>
        {/* Click-outside overlay: closes the drawer when clicking anywhere else.
            Sits below the dropdown (zIndex 30) but above page content. */}
        {moreOpen && (
          <div onClick={() => setMoreOpen(false)} style={{
            position: "fixed", inset: 0, zIndex: 20, background: "transparent",
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── SUMMARY ── */}
        {tab === "summary" && (<>

          {/* Executive Summary — rendered as markdown so the new bulleted format
              (headers, **bold**, lists) displays correctly. Falls back to plain
              text for the legacy 3-paragraph format. */}
          <Section title="Executive Summary">
            <div style={{ ...card({ padding: 20 }), lineHeight: 1.65, color: "#2C3E50", fontSize: 14, textAlign: "left" }}>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h2 style={{ margin: "16px 0 8px", fontSize: 18, color: C.primary }}>{children}</h2>,
                  h2: ({ children }) => <h3 style={{ margin: "16px 0 8px", fontSize: 16, color: C.primary }}>{children}</h3>,
                  h3: ({ children }) => <h4 style={{ margin: "14px 0 6px", fontSize: 14, color: C.primary }}>{children}</h4>,
                  p:  ({ children }) => <p style={{ margin: "8px 0" }}>{children}</p>,
                  ul: ({ children }) => <ul style={{ margin: "6px 0 10px 20px", paddingLeft: 0 }}>{children}</ul>,
                  li: ({ children }) => <li style={{ margin: "4px 0" }}>{children}</li>,
                  strong: ({ children }) => <strong style={{ color: "#1B2631" }}>{children}</strong>,
                  code: ({ children }) => <code style={{ background: "#F4F6F7", padding: "1px 4px", borderRadius: 3, fontSize: 13 }}>{children}</code>,
                }}
              >
                {Array.isArray(d.exec_summary) ? d.exec_summary.join("\n\n") : (d.exec_summary || "")}
              </ReactMarkdown>
            </div>
          </Section>

          {/* GA4 Traffic */}
          {d.ga4?.main_site && (
            <Section title="Site Traffic (GA4)">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                <MetricCard
                  label="Sessions (main site)"
                  value={(d.ga4?.main_site?.sessions ?? 0).toLocaleString()}
                  change={d.ga4?.main_site?.wow_sessions_pct}
                  sub="vs prior week"
                />
                <MetricCard
                  label="Users (main site)"
                  value={(d.ga4?.main_site?.users ?? 0).toLocaleString()}
                  change={d.ga4?.main_site?.wow_users_pct}
                  sub="vs prior week"
                />
                <MetricCard
                  label="Sessions (docs)"
                  value={(d.ga4?.docs?.sessions ?? 0).toLocaleString()}
                  change={d.ga4?.docs?.wow_sessions_pct}
                  sub="vs prior week"
                />
                <MetricCard
                  label="Pageviews (main)"
                  value={(d.ga4?.main_site?.pageviews ?? 0).toLocaleString()}
                  sub={`${d.ga4.main_site.week_start} – ${d.ga4.main_site.week_end}`}
                />
              </div>
              <div style={{ ...card({ padding: "12px 14px" }) }}>
                {(d.ga4?.main_site?.channels || []).slice(0, 6).map((ch, i, arr) => (
                  <Bar
                    key={ch.channel || i}
                    label={ch.channel || "Unknown"}
                    value={ch.sessions ?? 0}
                    max={arr?.[0]?.sessions || 1}
                    color={C.accent}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* GSC Scorecard row */}
          <Section title="Search Performance (GSC)">
            {gscMissing ? (
              <div style={{ ...card({ padding: "16px 20px" }), color: C.danger, fontSize: 13 }}>
                ⚠️ GSC data unavailable for this run{d.gsc.error ? ` — ${d.gsc.error}` : ""}.
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                <MetricCard label="Clicks" value={(d.gsc.clicks ?? 0).toLocaleString()} change={d.gsc.wow_clicks} sub={`${(d.gsc.clicks_last ?? 0).toLocaleString()} prior week`} />
                <MetricCard label="Impressions" value={`${Math.round((d.gsc.impressions ?? 0)/1000)}K`} change={d.gsc.wow_impressions} sub="prior week" />
                <MetricCard label="CTR" value={`${(d.gsc.ctr ?? 0).toFixed(2)}%`} sub="WoW" />
                <MetricCard label="Avg Position" value={d.gsc.avg_position ?? "—"} sub="WoW" />
                <MetricCard label="28-Day Clicks" value={(d.gsc.trailing_28d_clicks ?? 0).toLocaleString()} sub={`${(d.gsc.mom_clicks ?? 0) > 0 ? "+" : ""}${d.gsc.mom_clicks ?? 0}% MoM`} />
              </div>
            )}
          </Section>

          {/* Click breakdown */}
          {!gscMissing && (
          <Section title="Click Breakdown (This Week)">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Branded", value: (d.gsc.branded ?? 0).toLocaleString(), note: "queries containing 'growthbook'" },
                { label: "Non-Branded", value: (d.gsc.nonbranded ?? 0).toLocaleString(), note: "organic discovery traffic" },
                { label: "Anonymized", value: (d.gsc.anonymized ?? 0).toLocaleString(), note: "low-volume queries (GSC privacy)" },
              ].map((b, i) => (
                <div key={i} style={{ ...card({ padding: "14px 18px", flex: 1, minWidth: 160 }) }}>
                  <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase" }}>{b.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.primary, margin: "4px 0 2px" }}>{b.value}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{b.note}</div>
                </div>
              ))}
            </div>
          </Section>
          )}

          {/* Content Recommendations — LLM-generated action items */}
          {(() => { const _recs = Array.isArray(d.content_recommendations) ? d.content_recommendations : (d.content_recommendations || "").split("\n").filter(l => /^\d+\./.test(l.trim())); return _recs.length > 0 && (
            <Section title="Content Recommendations">
              <div style={{ ...card({ padding: "16px 20px" }) }}>
                {_recs.map((rec, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: i < _recs.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.accent, width: 24, flexShrink: 0, lineHeight: 1.4 }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: "#2C3E50", lineHeight: 1.6 }}>{rec}</div>
                  </div>
                ))}
              </div>
            </Section>
          ); })()}

          {/* Competitor content opportunities moved to the Strategy tab (ACP +
              Content Opportunities) to keep Summary a high-level recap. */}

          <p style={{ fontSize: 11, color: '#888', marginTop: 16, paddingTop: 8, borderTop: '1px solid #333', textAlign: 'left' }}>
            📅 GSC: {d.gsc?.week_start || '—'} to {d.gsc?.week_end || '—'} · GA4: {d.ga4?.main_site?.week_start || '—'} to {d.ga4?.main_site?.week_end || '—'} · Run: {d.week || '—'}
          </p>

        </>)}

        {/* Opportunities tab retired — its Content Opportunities + Striking
            Distance sections now live inside the Strategy tab below. */}

        {/* ── STRATEGY (🧭 ACP decision layer) ── */}
        {tab === "strategy" && (() => {
          const strat = d.strategy;
          if (!strat || !(strat.opportunities || []).length) {
            return <Section title="🧭 Strategy"><div style={{ ...card({ padding: "16px 20px" }), color: C.muted, fontSize: 13 }}>Strategy scoring will appear after the next pipeline run.</div></Section>;
          }
          const ns = strat.northStar || {};
          const opps = strat.opportunities || [];
          const HZ = [
            { key: "Harvest", emoji: "🌾", desc: "Fix & instrument what exists", color: C.success, ns: "AI Citation Rate" },
            { key: "Own the Category", emoji: "🚩", desc: "Plant the flag", color: C.accent, ns: "AI Share of Voice" },
            { key: "Build the Moat", emoji: "🏰", desc: "Compounding assets", color: "#6A5ACD", ns: "Brand Search + Topical Authority" },
          ];
          const isActNow = o => (o.persistence || "").includes("gate");

          // ── Competitor Heat inputs ──────────────────────────────────────────
          // Demand signal only (never a trigger). Three quick reads kept from the
          // old tactical tabs, per user request: (1) top competitor moves this week,
          // (2) per-competitor ETV WoW arrows, (3) the loudest competitor YouTube
          // outlier. GrowthBook is excluded from all three — this is competitor heat.
          const heatMoves = (d.new_content || [])
            .filter(n => n.competitor && !n.competitor.startsWith("GrowthBook"))
            .sort((a, b) => (b.threat ?? 0) - (a.threat ?? 0))
            .slice(0, 5);
          // WoW from the two most-recent weekly ETV points (already ≥7 days apart).
          const heatEtv = Object.entries(d.etv_trend || {})
            .filter(([comp]) => comp !== "GrowthBook")
            .map(([comp, pts]) => {
              const clean = (pts || []).filter(p => p.etv != null);
              const last = clean[clean.length - 1], prev = clean[clean.length - 2];
              const wow = last && prev && prev.etv ? Math.round(((last.etv - prev.etv) / prev.etv) * 100) : null;
              return { comp, etv: last?.etv ?? null, wow };
            })
            .filter(r => r.etv != null)
            .sort((a, b) => (b.etv ?? 0) - (a.etv ?? 0));
          const heatVideo = ((d.youtube?.channels) || [])
            .filter(c => c.name !== "GrowthBook")
            .flatMap(c => (c.videos || []).filter(v => v.is_outlier).map(v => ({ ...v, competitor: c.name })))
            .sort((a, b) => (b.mult ?? 0) - (a.mult ?? 0))[0] || null;
          const hasHeat = heatMoves.length || heatEtv.length || heatVideo;

          return (<>
            {/* Competitor Heat — demand signal snapshot (competitor activity only) */}
            {hasHeat && (
              <Section title="🔥 Competitor Heat">
                <p style={{ fontSize: 11, color: C.muted, marginTop: 0, marginBottom: 12, textAlign: "left" }}>
                  A demand signal, not a to-do list. Competitor activity informs the Demand and Strategic-Fit
                  scores above — it never triggers an action on its own.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                  {/* Top competitor moves */}
                  <div style={{ ...card({ padding: "12px 14px" }), flex: 1, minWidth: 280 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 8 }}>Top moves this week</div>
                    {heatMoves.length === 0
                      ? <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>No high-threat competitor pages this week.</div>
                      : heatMoves.map((n, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 6 }}>
                            {n.threat != null && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: n.threat >= 8 ? C.danger : C.warning, whiteSpace: "nowrap" }}>{n.threat}/10</span>
                            )}
                            <span style={{ fontSize: 12, lineHeight: 1.35, textAlign: "left" }}>
                              <span style={{ fontWeight: 600, color: COMP_COLORS[n.competitor] || C.primary }}>{n.competitor}</span>
                              {" — "}
                              {n.url
                                ? <a href={safeHref(n.url)} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{n.slug}</a>
                                : <span style={{ color: "#2C3E50" }}>{n.slug}</span>}
                            </span>
                          </div>
                        ))}
                  </div>
                  {/* Per-competitor ETV WoW */}
                  <div style={{ ...card({ padding: "12px 14px" }), flex: 1, minWidth: 240 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 8 }}>Organic ETV · WoW</div>
                    {heatEtv.length === 0
                      ? <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>No ETV trend yet.</div>
                      : heatEtv.map((r, i) => {
                          const up = r.wow != null && r.wow > 0, flat = r.wow == null || r.wow === 0;
                          return (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5, fontSize: 12 }}>
                              <span style={{ fontWeight: 600, color: COMP_COLORS[r.comp] || C.primary }}>{r.comp}</span>
                              <span style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                                <span style={{ color: "#2C3E50" }}>{r.etv.toLocaleString()}</span>
                                <span style={{ fontWeight: 700, minWidth: 52, textAlign: "right", color: flat ? C.muted : (up ? C.success : C.danger) }}>
                                  {flat ? "—" : `${up ? "▲" : "▼"} ${Math.abs(r.wow)}%`}
                                </span>
                              </span>
                            </div>
                          );
                        })}
                  </div>
                  {/* Loudest competitor YouTube outlier */}
                  <div style={{ ...card({ padding: "12px 14px" }), flex: 1, minWidth: 240 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 8 }}>Video outlier</div>
                    {!heatVideo
                      ? <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>No competitor video exceeded 2× channel average.</div>
                      : <div style={{ fontSize: 12, lineHeight: 1.4, textAlign: "left" }}>
                          <span style={{ fontWeight: 600, color: COMP_COLORS[heatVideo.competitor] || C.primary }}>{heatVideo.competitor}</span>
                          {" — "}
                          {heatVideo.url
                            ? <a href={heatVideo.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{heatVideo.title}</a>
                            : <span style={{ color: "#2C3E50" }}>{heatVideo.title}</span>}
                          <div style={{ marginTop: 6, color: C.success, fontWeight: 700 }}>
                            🔥 {heatVideo.mult != null ? heatVideo.mult.toFixed(1) : "?"}× channel avg · {(heatVideo.views || 0).toLocaleString()} views
                          </div>
                        </div>}
                  </div>
                </div>
              </Section>
            )}

            {/* North-star strip */}
            <Section title="🧭 North-Star Metrics">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <MetricCard label="AI Share of Voice" value={ns.aiShareOfVoice?.value != null ? `${ns.aiShareOfVoice.value}%` : "—"} change={ns.aiShareOfVoice?.trend4wk} sub={`target ${ns.aiShareOfVoice?.target || "15-25"}%`} />
                <MetricCard label="AI Citation Rate" value={ns.aiCitationRate?.value != null ? `${ns.aiCitationRate.value}%` : "—"} change={ns.aiCitationRate?.trend4wk} sub="vs 4-wk" />
                <MetricCard label="AI Mention Rate" value={ns.aiMentionRate?.value != null ? `${ns.aiMentionRate.value}%` : "—"} change={ns.aiMentionRate?.trend4wk} sub="vs 4-wk" />
                <MetricCard label="AI-Sourced Pipeline" value="—" sub="instrumentation pending" />
              </div>
            </Section>

            {/* Footprint trajectory — GrowthBook's organic ranking footprint over
                time (DataForSEO historical_rank_overview). A portfolio-level
                "are we persistently growing?" signal, distinct from the per-keyword
                gate. Only renders when the payload carries strategy.portfolio. */}
            {strat.portfolio && (strat.portfolio.series || []).length > 0 && (() => {
              const pf = strat.portfolio;
              const dirColor = pf.direction === "growing" ? C.success
                : pf.direction === "declining" ? C.danger : C.muted;
              const dirArrow = pf.direction === "growing" ? "▲"
                : pf.direction === "declining" ? "▼" : "▬";
              return (
                <Section title="📈 Search Footprint Trajectory">
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>
                    <div style={{ ...card({ padding: "14px 18px", minWidth: 220 }), display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ fontSize: 12, color: C.muted }}>Keywords in Top 10</div>
                      <div style={{ fontSize: 34, fontWeight: 800, color: C.primary, lineHeight: 1.1 }}>
                        {(pf.top10 ?? 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: dirColor, marginTop: 2 }}>
                        {dirArrow} {pf.top10Delta3mo > 0 ? "+" : ""}{pf.top10Delta3mo} vs 3 mo ago · {pf.direction}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                        {(pf.striking ?? 0).toLocaleString()} in striking distance (11–20) · ETV {(pf.etv ?? 0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ ...card({ padding: "12px 14px" }), flex: 1, minWidth: 320 }}>
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={pf.series} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} width={36} />
                          <RTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="top10" name="Top 10" stroke={C.success} strokeWidth={2.5} dot={{ r: 2 }} />
                          <Line type="monotone" dataKey="striking" name="Striking (11–20)" stroke={C.accent} strokeWidth={2} strokeDasharray="5 3" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: "left" }}>
                    GrowthBook's monthly organic keyword footprint (DataForSEO). Top-10 growth = a persistently expanding presence, not single-week noise.
                  </p>
                </Section>
              );
            })()}

            {/* Portfolio board */}
            <Section title="🎯 Opportunity Portfolio">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                {HZ.map(h => {
                  const items = opps.filter(o => o.horizon === h.key).slice(0, 6);
                  return (
                    <div key={h.key} style={{ flex: 1, minWidth: 250 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: h.color }}>{h.emoji} {h.key}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{h.desc} · → moves {h.ns}</div>
                      {items.length === 0 && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>None this week.</div>}
                      {items.map((o, i) => (
                        <div key={i} style={{ ...card({ padding: "10px 12px", marginBottom: 8 }) }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.primary, lineHeight: 1.3 }}>{o.title}</div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                            <span style={{ fontSize: 22, fontWeight: 800, color: h.color }}>{o.acpScore}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, background: C.bg, color: C.primary, padding: "1px 6px", borderRadius: 4 }}>{o.effortTier}</span>
                            {isActNow(o)
                              ? <span style={{ fontSize: 10, color: C.success, fontWeight: 700 }}>● act-now</span>
                              : <span style={{ fontSize: 10, color: C.muted }}>○ watch</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Scored opportunity table */}
            <Section title="📋 Scored Opportunities (ACP)">
              <details style={{ marginBottom: 10 }}>
                <summary style={{ cursor: "pointer", fontSize: 12, color: C.accent }}>Methodology — how ACP is scored</summary>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
                  ACP = (0.30·Pipeline + 0.30·AI-Citation + 0.20·Demand + 0.10·Winnability + 0.10·Strategic Fit) × 20 ÷ effort divisor (XS 1.0, S 1.5, M 2.5, L 4.0). Objective: maximize AI-citation share + bottom-funnel pipeline per unit of effort. Competitor activity feeds Demand / Strategic Fit only — never the trigger. An item is "act-now" only after clearing a ≥{strat.persistenceGate?.minWeeks ?? 2}-week / magnitude persistence gate; otherwise "watch". {strat.note}
                </div>
              </details>
              <Table
                compact
                headers={["Opportunity", "Type", "ACP", "Pipe", "AI-Cite", "Demand", "Win", "Fit", "Effort", "Horizon", "Status", "Action"]}
                rows={opps.map(o => [
                  o.title,
                  o.type,
                  <strong style={{ color: C.primary }}>{o.acpScore}</strong>,
                  o.subScores.pipeline, o.subScores.aiCitation, o.subScores.demand, o.subScores.winnability, o.subScores.strategicFit,
                  o.effortTier,
                  o.horizon,
                  isActNow(o) ? <span style={{ color: C.success, fontWeight: 600 }}>act-now</span> : <span style={{ color: C.muted }}>watch</span>,
                  <span style={{ fontSize: 11 }}>{o.action}</span>,
                ])}
              />
            </Section>

            {/* Tactical content gaps — retired here from the old Opportunities tab.
                Composite competitor-gap score; complements the strategic ACP table. */}
            {(d.opportunities || []).length > 0 && (
              <Section title="🎯 Content Opportunities (competitor gaps)">
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
            )}

            {/* Striking Distance — retired here from the old Opportunities tab
                (this is now its single home; the GSC Detail copy was dropped). */}
            {(d.striking_distance || []).length > 0 && (
              <Section title="📈 Striking Distance (Positions 8–20)">
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
            )}

            {/* Recently Shipped — New Content Value (AI vs Editorial) */}
            {strat.recentlyShipped && (strat.recentlyShipped.items || []).length > 0 && (() => {
              const rs = strat.recentlyShipped;
              const VC = { "Winner": C.success, "Stranded": C.warning, "Surprise": C.accent, "Let it ride": C.muted };
              return (
                <Section title="🌱 Recently Shipped — Is It Working?">
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 0, marginBottom: 8 }}>
                    GrowthBook pages published in the last {rs.windowWeeks} weeks, scored on strategic value × realized GSC traction (age-adjusted). AI-generated <code>/insights/</code> is tracked separately from editorial. Winner = promote · Stranded = refresh · Surprise = harvest intent · Let it ride = deprioritize.
                  </p>
                  <details style={{ marginBottom: 12 }}>
                    <summary style={{ cursor: "pointer", fontSize: 12, color: C.accent }}>What do NCV, Strat, Perf, and the verdicts mean?</summary>
                    <div style={{ fontSize: 12, color: "#2C3E50", marginTop: 8, lineHeight: 1.6, textAlign: "left" }}>
                      <p style={{ margin: "0 0 8px" }}>Each page is scored on two independent 0–5 axes, then bucketed into a verdict. The question this answers: <em>of what we recently published, what's worth more investment vs. what to leave alone?</em></p>
                      <ul style={{ margin: "0 0 8px 18px", padding: 0 }}>
                        <li style={{ margin: "3px 0" }}><strong>Strat (Strategic Value, 0–5)</strong> — how valuable the topic is <em>regardless of traffic</em>: funnel proximity (bottom-funnel comparison/pricing pages score highest) × 0.4 + AI-citation potential (comparison and definitional formats get cited most) × 0.4 + strategic fit (categories GrowthBook should own — feature flags, experimentation, A/B testing) × 0.2.</li>
                        <li style={{ margin: "3px 0" }}><strong>Performance (0–5)</strong> — realized GSC traction, <em>age-adjusted</em>. Ranks each page's velocity (impressions ÷ weeks live) against the rest of the cohort, then +1 if it's already averaging a top-10 position. A 2-week-old page isn't penalized for not yet matching an 8-week-old one. <em>(Shown in the table as the concrete Impr / Clicks / Pos columns rather than a raw score.)</em></li>
                        <li style={{ margin: "3px 0" }}><strong>NCV (New Content Value, 0–100)</strong> — the headline score: an equal 50/50 blend of Strat and Perf. High NCV = a strategically valuable page that's also earning traction.</li>
                      </ul>
                      <p style={{ margin: "0 0 4px" }}>The four <strong>verdicts</strong> come from crossing the two axes (high = ≥3):</p>
                      <ul style={{ margin: "0 0 0 18px", padding: 0 }}>
                        <li style={{ margin: "3px 0" }}><strong style={{ color: C.success }}>Winner</strong> — high Strat <em>and</em> high Perf. On-strategy and working. <em>Promote: add internal links + a signup CTA and amplify.</em></li>
                        <li style={{ margin: "3px 0" }}><strong style={{ color: C.warning }}>Stranded</strong> — high Strat, low Perf. Right topic, weak traction. <em>Refresh: rewrite the title, add an answer capsule + internal links to unstick it.</em></li>
                        <li style={{ margin: "3px 0" }}><strong style={{ color: C.accent }}>Surprise</strong> — low Strat, high Perf. Unexpected traction on a lower-priority topic. <em>Harvest the intent: add a bottom-funnel follow-up or CTA to convert it.</em></li>
                        <li style={{ margin: "3px 0" }}><strong style={{ color: C.muted }}>Let it ride</strong> — low Strat <em>and</em> low Perf. <em>Don't reinvest — leave it.</em></li>
                      </ul>
                    </div>
                  </details>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, textAlign: "left" }}>
                    Click a cohort to filter the list below by track{ncvTrack ? <> · <button onClick={() => setNcvTrack(null)} style={{ border: "none", background: "none", color: C.accent, cursor: "pointer", fontSize: 11, padding: 0, textDecoration: "underline" }}>show all</button></> : null}
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                    {rs.cohorts.map(c => {
                      const active = ncvTrack === c.track;
                      return (
                      <div key={c.track}
                        onClick={() => setNcvTrack(active ? null : c.track)}
                        role="button"
                        aria-pressed={active}
                        title={active ? "Click to show all tracks" : `Show only ${c.track} pages`}
                        style={{ ...card({ padding: "12px 16px", flex: 1, minWidth: 250 }), cursor: "pointer",
                          // Light outline by default; darker + bolder when selected.
                          border: active ? `3px solid ${C.primary}` : `2px solid ${C.border}`,
                          background: active ? "#EAF2FB" : undefined,
                          opacity: ncvTrack && !active ? 0.55 : 1, transition: "opacity .12s, border-color .12s, border-width .12s" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{c.track} {active ? "▾" : ""}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: C.primary, margin: "2px 0" }}>{c.count} <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>pages</span></div>
                        <div style={{ fontSize: 12, color: C.muted }}>{c.impressions.toLocaleString()} impr · {c.clicks} clicks · avg pos {c.avgPosition ?? "—"}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                          {Object.entries(c.verdicts).map(([v, n]) => (
                            <span key={v} style={{ fontSize: 10, fontWeight: 600, color: VC[v], background: C.bg, padding: "1px 6px", borderRadius: 4 }}>{v} {n}</span>
                          ))}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                  <Table
                    compact
                    headers={["Page", "Track", "NCV", "Strat", "Impr", "Clicks", "Pos", "Verdict", "Action"]}
                    rows={rs.items.filter(it => !ncvTrack || it.track === ncvTrack).slice(0, 25).map(it => [
                      it.title,
                      it.track,
                      <strong style={{ color: C.primary }}>{it.ncvScore}</strong>,
                      it.strategicValue,
                      it.impressions.toLocaleString(),
                      (it.clicks ?? 0).toLocaleString(),
                      it.position ?? "—",
                      <span style={{ color: VC[it.verdict], fontWeight: 600 }}>{it.verdict}</span>,
                      <AdviceCell
                        item={it}
                        fallback={it.action}
                        context={{
                          brand: "GrowthBook",
                          objective: "Maximize AI-citation share + bottom-funnel signups per unit of effort.",
                          methodology: strat.note,
                          northStar: strat.northStar,
                          portfolio: strat.portfolio,
                          verdictMeaning: { Winner: "promote", Stranded: "refresh", Surprise: "harvest intent", "Let it ride": "deprioritize" },
                        }}
                      />,
                    ])}
                  />
                </Section>
              );
            })()}

            {/* GrowthBook video performance — own-channel signal sits next to own
                content (Recently Shipped) so "is what we ship working?" covers
                video too. Full per-video detail still lives in the YouTube drawer. */}
            {(() => {
              const gbCh = ((d.youtube?.channels) || []).find(c => c.name === "GrowthBook");
              if (!gbCh) return null;
              const recent = (gbCh.videos || [])
                .filter(v => v.date)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 6);
              if (recent.length === 0) return null;
              const outlierCount = (gbCh.videos || []).filter(v => v.is_outlier).length;
              return (
                <Section title="🎬 GrowthBook Video — Is It Working?">
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 0, marginBottom: 10 }}>
                    GrowthBook's recent videos vs channel average ({gbCh.avg_views?.toLocaleString() || "—"} views).
                    {outlierCount > 0 ? ` ${outlierCount} running ≥2× average this week.` : " None ≥2× average this week."}
                    {" "}Full per-video detail in the YouTube drawer.
                  </p>
                  <Table
                    compact
                    headers={["Published", "Title", "Views", "vs Avg", "Outlier?"]}
                    rows={recent.map(v => [
                      v.date,
                      v.url
                        ? <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{v.title}</a>
                        : v.title,
                      (v.views || 0).toLocaleString(),
                      <span style={{ color: v.mult != null && v.mult >= 2 ? C.success : "inherit", fontWeight: v.mult != null && v.mult >= 2 ? 700 : 400 }}>
                        {v.mult != null ? v.mult.toFixed(1) + "×" : "—"}
                      </span>,
                      v.is_outlier ? <span style={{ color: C.success, fontWeight: 700 }}>🔥 Yes</span> : <span style={{ color: C.muted }}>No</span>,
                    ])}
                  />
                </Section>
              );
            })()}

            <p style={{ fontSize: 11, color: "#888", marginTop: 16, paddingTop: 8, borderTop: "1px solid #333", textAlign: "left" }}>
              🧭 ACP strategic scoring · {opps.length} opportunities · Run: {d.week || "—"}
            </p>
          </>);
        })()}

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
                Note: GrowthBook ETV underreports actual organic traffic — branded search (~55% of clicks) is not counted by DataForSEO. See GSC tab for real click data.
              </p>
            </div>
          </Section>

          {/* Bubble Chart — Content Volume vs DA vs ETV (pure SVG) */}
          <BubbleChart competitors={d.competitors} />

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

          <p style={{ fontSize: 11, color: '#888', marginTop: 16, paddingTop: 8, borderTop: '1px solid #333', textAlign: 'left' }}>
            📅 ETV snapshot: {d.week || '—'} (DataForSEO) · GSC compare: {d.gsc?.week_start || '—'} to {d.gsc?.week_end || '—'}
          </p>
        </>)}

        {/* ── GSC DETAIL ── */}
        {tab === "gsc" && (<>
          {d.gsc?.page_split && Object.keys(d.gsc.page_split).some(k => ["homepage","pricing","docs","all_other_pages"].includes(k)) && (() => {
            const ps = d.gsc.page_split;
            const fmt = (v) => v != null ? `${v > 0 ? "+" : ""}${v}%` : "—";
            const clr = (v) => v == null ? C.muted : v > 0 ? C.success : v < 0 ? C.danger : C.muted;
            const rows = [
              ["Homepage (/)", ps.homepage],
              ["Pricing (/pricing)", ps.pricing],
              ["Docs (docs.*)", ps.docs],
              ["All other pages", ps.all_other_pages],
            ].filter(([, s]) => s != null);
            return (
              <Section title="Clicks by Section">
                <Table
                  headers={["Section", "Clicks", "WoW", "Impressions", "Imp WoW"]}
                  rows={rows.map(([label, s]) => [
                    <span style={{ display: "block", textAlign: "left" }}>{label}</span>,
                    (s.clicks || 0).toLocaleString(),
                    <span style={{ color: clr(s.clicks_wow_pct), fontWeight: 700 }}>{fmt(s.clicks_wow_pct)}</span>,
                    (s.impressions || 0).toLocaleString(),
                    <span style={{ color: clr(s.impressions_wow_pct) }}>{fmt(s.impressions_wow_pct)}</span>,
                  ])}
                  compact
                />
              </Section>
            );
          })()}

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

          {/* Striking Distance moved to the Strategy tab (single home) to remove
              the duplicate that previously appeared in both GSC Detail and Opportunities. */}

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

          <p style={{ fontSize: 11, color: '#888', marginTop: 16, paddingTop: 8, borderTop: '1px solid #333', textAlign: 'left' }}>
            📅 GSC window: {d.gsc?.week_start || '—'} to {d.gsc?.week_end || '—'} (Mon–Sun, 1-week lag)
          </p>
        </>)}

        {/* ── YOUTUBE ── */}
        {tab === "youtube" && (() => {
          const channels = d.youtube.channels;
          const gbCh = channels.find(c => c.name === "GrowthBook") || { videos: [], avg_views: 0, video_count: 0 };
          // Show all videos from the payload sorted by date, most recent first (Python already applies 90-day window)
          const gbAllRecent = (gbCh.videos || [])
            .filter(v => v.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
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

            <Section title="GrowthBook — Recent Videos (Last 90 Days)">
              {gbAllRecent.length === 0 ? (
                <p style={{ color: '#888', fontSize: 13 }}>No GrowthBook videos published in the last 21 days.</p>
              ) : (
                <Table
                  headers={["Published", "Title", "Views", "vs Avg", "Outlier?"]}
                  rows={gbAllRecent.map(v => ([
                    v.date,
                    <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{v.title}</a>,
                    (v.views || 0).toLocaleString(),
                    <span style={{ color: v.mult != null && v.mult >= 2 ? C.success : "inherit", fontWeight: v.mult != null && v.mult >= 2 ? 700 : 400 }}>
                      {v.mult != null ? v.mult.toFixed(1) + "×" : "—"}
                    </span>,
                    v.is_outlier ? <span style={{ color: C.success, fontWeight: 700 }}>🔥 Yes</span> : <span style={{ color: C.muted }}>No</span>,
                  ]))}
                  compact
                />
              )}
              <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
                Most recent GrowthBook videos (up to 10), sorted by date. 90-day lookback window. Channel avg: {gbCh.avg_views?.toLocaleString() || '—'} views.
              </p>
            </Section>

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

            <p style={{ fontSize: 11, color: '#888', marginTop: 16, paddingTop: 8, borderTop: '1px solid #333', textAlign: 'left' }}>
              📅 YouTube: 90-day lookback from {d.week || '—'} · Outlier = 2× channel average
            </p>
          </>);
        })()}

        {/* ── NEW CONTENT ── */}
        {tab === "content" && (<>
          {(() => {
            const counts = {};
            const gbUrls = new Set();
            (d.new_content || []).forEach(n => {
              // Normalise "GrowthBook Blog" / "GrowthBook Site" → "GrowthBook"
              const name = n.competitor.startsWith("GrowthBook") ? "GrowthBook" : n.competitor;
              counts[name] = (counts[name] || 0) + 1;
              if (name === "GrowthBook" && n.url) gbUrls.add(n.url);
            });
            // GrowthBook also has GSC-detected pages in gb_new_content. Count only the
            // ones whose URL isn't already in new_content (which already carries the
            // sitemap rows). Previously this blindly added gb_sitemap_new_count on top,
            // so any page present in both sources was counted twice (28 + 28 = 56).
            (d.gb_new_content || []).forEach(p => {
              if (p.url && !gbUrls.has(p.url)) {
                counts["GrowthBook"] = (counts["GrowthBook"] || 0) + 1;
                gbUrls.add(p.url);
              }
            });
            // Recharts layout="vertical" renders first item at top — sort descending so largest is on top
            const chartData = Object.entries(counts)
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => ({ name, count }));
            return chartData.length > 0 ? (
              <Section title="New Pages Published This Week">
                <ResponsiveContainer width="100%" height={Math.max(120, chartData.length * 44)}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 120, right: 40, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={115} />
                    <RTooltip formatter={(v, _, props) => [v, props.payload.name === "GrowthBook" ? "New pages (sitemap + GSC)" : "New pages (sitemap)"]} />
                    <RBar dataKey="count" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, i) => <Cell key={i} fill={COMP_COLORS[entry.name] || C.accent} />)}
                    </RBar>
                  </BarChart>
                </ResponsiveContainer>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: "left" }}>
                  All counts from sitemap monitoring (week-over-week diff). GrowthBook includes both main site (www.growthbook.io) and blog new pages.
                </p>
              </Section>
            ) : null;
          })()}
          <Section title="New Competitor Pages This Week (High-Threat)">
            {(() => {
              // Sitemap-based rows (competitors + GrowthBook Blog/Site)
              const sitemapRows = (d.new_content || []).map(n => ({
                ...n,
                competitor: n.competitor.startsWith("GrowthBook") ? "GrowthBook" : n.competitor,
                source: n.source || "sitemap",
              }));
              // GSC/sitemap-based GrowthBook rows from gb_new_content (already merged in Python)
              // Deduplicate against sitemapRows to avoid double-counting
              const sitemapUrls = new Set(sitemapRows.map(r => r.url));
              const gbRows = (d.gb_new_content || [])
                .filter(p => !sitemapUrls.has(p.url))
                .map(p => ({
                  competitor: "GrowthBook",
                  slug: p.slug || (p.url || "").replace(/\/$/, "").split("/").pop() || p.url,
                  url: p.url,
                  date: p.date || "—",
                  threat: p.threat ?? null,
                  kd: p.kd ?? null,
                  clicks: p.clicks ?? 0,
                  source: p.source || "gsc",
                }));
              const allRows = [...sitemapRows, ...gbRows];
              // Compute counts for header
              const gbAllRows = allRows.filter(r => r.competitor === "GrowthBook");
              const gbSitemapCount = gbAllRows.filter(r => r.source === "sitemap").length;
              const gbGscCount = gbAllRows.filter(r => r.source === "gsc").length;
              return (
                <>
                  {gbAllRows.length > 0 && (
                    <p style={{ fontSize: 12, color: C.muted, marginBottom: 8, textAlign: "left" }}>
                      <strong style={{ color: C.primary }}>GrowthBook:</strong> {gbAllRows.length} new page{gbAllRows.length !== 1 ? "s" : ""} this week
                      {" "}({gbSitemapCount} from sitemap, {gbGscCount} from GSC)
                    </p>
                  )}
                  <Table
                    headers={["Competitor", "Page / Topic", "Published", "Threat", "KD", "Source"]}
                    rows={allRows.map(n => {
                      const dispName = n.competitor;
                      const isSitemapOnly = n.source === "sitemap" && (n.clicks === 0 || n.clicks == null);
                      return [
                        <span style={{ color: COMP_COLORS[dispName] || C.primary, fontWeight: 600, display: "block", textAlign: "left" }}>{dispName}</span>,
                        <a href={safeHref(n.url)} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none", display: "block", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{n.slug}</a>,
                        n.date || "—",
                        n.threat != null ? <span style={{ fontWeight: 700, color: n.threat >= 8 ? C.danger : C.warning }}>{n.threat}/10</span> : <span style={{ color: C.muted }}>—</span>,
                        n.kd != null ? n.kd : "—",
                        isSitemapOnly
                          ? <span style={{ color: C.muted, fontSize: 11 }} title="Sitemap detected — no GSC data yet">Sitemap</span>
                          : <span style={{ color: C.accent, fontSize: 11 }}>{n.source === "gsc" ? "GSC" : "Sitemap"}</span>
                      ];
                    })}
                  />
                </>
              );
            })()}
            <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
              Competitors: pages scored ≥5 threat (domain authority × keyword difficulty × topic relevance). GrowthBook: new blog posts &lt;90 days old from GSC.
            </p>
          </Section>

          <p style={{ fontSize: 11, color: '#888', marginTop: 16, paddingTop: 8, borderTop: '1px solid #333', textAlign: 'left' }}>
            📅 New pages: since prior weekly run · Run: {d.week || '—'}
          </p>

        </>)}

        {/* ── ETV vs KD ── */}
        {tab === "etv_kd" && (<>
          {/* Chart 3 — Top 20 pages by ETV */}
          {(d.etv_kd || []).length > 0 && (() => {
            // Recharts layout="vertical" renders first item at top — sort descending so largest is on top
            const top20 = [...d.etv_kd]
              .sort((a, b) => b.etv - a.etv)
              .slice(0, 20)
              .map(r => ({
                label: (r.url || "").replace(/^https?:\/\//, ""),
                etv: r.etv,
                competitor: r.competitor,
              }));
            return (
              <Section title="Top 20 Competitor Pages by Estimated Traffic">
                <ResponsiveContainer width="100%" height={580}>
                  <BarChart data={top20} layout="vertical" margin={{ left: 10, right: 50, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={360} />
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
                <a href={safeHref(row.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none", display: "block", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{(row.url || "").replace(/^https?:\/\//, "")}</a>,
                row.etv.toLocaleString(),
                <span style={{ fontWeight: 700, color: row.kd >= 60 ? C.danger : row.kd >= 30 ? C.warning : C.success }}>{row.kd}</span>,
              ])}
            />
            <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
              KD color: <span style={{ color: C.success, fontWeight: 700 }}>green = easy (&lt;30)</span> · <span style={{ color: C.warning, fontWeight: 700 }}>orange = moderate (30–59)</span> · <span style={{ color: C.danger, fontWeight: 700 }}>red = hard (60+)</span>.
              Source: DataForSEO. GrowthBook ETV underreports — see GSC for actual traffic.
            </p>
          </Section>

          <p style={{ fontSize: 11, color: '#888', marginTop: 16, paddingTop: 8, borderTop: '1px solid #333', textAlign: 'left' }}>
            📅 ETV + KD snapshot: {d.week || '—'} (DataForSEO)
          </p>
        </>)}

        {/* ── GROWTHBOOK ── */}
        {tab === "growthbook" && (() => {
          const gbPages = Array.isArray(d.gb_pages) ? d.gb_pages : [];
          // Table: full list sorted by clicks desc (homepage included)
          const gbSorted = [...gbPages].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
          // Graphs: exclude homepage, /pricing, and pages with ≤1 click
          const isHomepage = (p) => (p.url || "").replace(/^https?:\/\//, "").replace(/\/$/, "") === "www.growthbook.io";
          const isPricing = (p) => (p.url || "").includes("/pricing");
          const gbGraphPages = gbPages.filter((p) => !isHomepage(p) && !isPricing(p) && (p.clicks || 0) > 1);
          // Recharts layout="vertical" renders first item at top — sort descending so largest is on top
          const top20Bars = [...gbGraphPages]
            .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
            .slice(0, 20)
            .map((p) => ({
              ...p,
              label: (p.url || "").replace(/^https?:\/\//, ""),
            }));
          const scatterData = gbGraphPages
            .filter((p) => typeof p.avg_position === "number" && typeof p.clicks === "number")
            .map((p) => ({
              x: p.avg_position,
              y: p.clicks,
              z: p.impressions || 0,
              url: p.url || "",
              shortUrl: (p.url || "").replace(/^https?:\/\//, ""),
            }));

          return (
            <>
              {(d.homepage_weekly || []).length > 0 && (
                <Section title="Homepage Clicks by Week (2026)">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={d.homepage_weekly} margin={{ left: 10, right: 20, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 10, fill: C.muted }}
                        tickFormatter={w => w ? w.slice(5) : w}
                        interval="preserveStartEnd"
                      />
                      <YAxis tick={{ fontSize: 10, fill: C.muted }} tickFormatter={v => v.toLocaleString()} width={55} />
                      <RTooltip
                        contentStyle={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }}
                        formatter={(v) => [v.toLocaleString(), "Clicks"]}
                        labelFormatter={(w) => `Week of ${w}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke={COMP_COLORS["GrowthBook"] || C.accent}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: 'left' }}>
                    Weekly homepage (www.growthbook.io/) clicks from Google Search Console. Week = Mon-Sun.
                  </p>
                </Section>
              )}

              <Section title="Top GrowthBook Pages by GSC Clicks (28 days)">
                <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 8, marginTop: 0 }}>
                  Homepage and /pricing excluded from charts — see full table below.
                </p>
                {top20Bars.length === 0 ? (
                  <div style={{ ...card({ padding: "16px 20px", color: C.muted }) }}>
                    GrowthBook page data will appear after the next weekly run.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={580}>
                    <BarChart data={top20Bars} layout="vertical" margin={{ left: 10, right: 50, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={360} />
                      <RTooltip formatter={(v) => [Number(v || 0).toLocaleString(), "Clicks"]} />
                      <RBar dataKey="clicks" radius={[0, 4, 4, 0]} fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Section>

              <Section title="GrowthBook Pages: Clicks vs Position">
                <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 8, marginTop: 0 }}>
                  Homepage and /pricing excluded. Dot size = impressions. Pages in the top-left quadrant (low position, high clicks) are your strongest performers.
                </p>
                {scatterData.length === 0 ? (
                  <div style={{ ...card({ padding: "16px 20px", color: C.muted }) }}>
                    No GrowthBook page points available yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ left: 20, right: 30, top: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Avg Position (lower = better)"
                        domain={[20, 1]}
                        label={{ value: "Avg Position (lower = better)", position: "insideBottom", offset: -10, fontSize: 12 }}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Clicks (28d)"
                        label={{ value: "Clicks (28d)", angle: -90, position: "insideLeft", fontSize: 12 }}
                        tick={{ fontSize: 11 }}
                      />
                      <ZAxis type="number" dataKey="z" range={[40, 200]} name="Impressions" />
                      <RTooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={({ payload }) => {
                          if (!payload || !payload.length) return null;
                          const p = payload[0].payload || {};
                          const shown = (p.shortUrl || "").length > 80 ? `${p.shortUrl.slice(0, 80)}...` : (p.shortUrl || "");
                          return (
                            <div style={{ background: "#fff", border: `1px solid ${C.border}`, padding: "8px 12px", fontSize: 12, maxWidth: 300 }}>
                              <div style={{ fontWeight: 700, marginBottom: 4 }}>{shown}</div>
                              <div>Clicks: <strong>{Number(p.y || 0).toLocaleString()}</strong></div>
                              <div>Position: <strong>{Number(p.x || 0).toFixed(2)}</strong></div>
                            </div>
                          );
                        }}
                      />
                      <Scatter data={scatterData} fill="#4CAF50" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </Section>

              <Section title="GrowthBook Pages — Full GSC Data">
                <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 8, marginTop: 0 }}>
                  Pages with ≥2 clicks, sorted largest first (28-day GSC window).
                </p>
                <DataTable
                  headers={["URL", "Clicks", "Impressions", "CTR", "Avg Position"]}
                  rows={gbSorted.filter((row) => (row.clicks || 0) >= 2).map((row) => {
                    const ctrRaw = Number(row.ctr || 0);
                    const ctrPct = ctrRaw <= 1 ? ctrRaw * 100 : ctrRaw;
                    return [
                      <a href={row.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none", display: "block", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.textDecoration="underline"} onMouseOut={e => e.currentTarget.style.textDecoration="none"}>{row.url}</a>,
                      Number(row.clicks || 0).toLocaleString(),
                      Number(row.impressions || 0).toLocaleString(),
                      `${ctrPct.toFixed(2)}%`,
                      Number(row.avg_position || 0).toFixed(2),
                    ];
                  })}
                />
              </Section>
            </>
          );
        })()}

        {/* ── SEO SCORECARD ── */}
        {tab === "seo_scorecard" && (() => {
          const aeo = d.athenahq || {
            share_of_voice: 10.6, share_of_voice_mom: 0.9,
            mention_rate: 34.1, mention_rate_mom: 4.4,
            citation_rate: 7.0, citation_rate_mom: 2.4,
            is_sample: true, history: [],
          };
          const aeoIsSample = !d.athenahq;
          const sem = d.keyword_rankings || {};
          const hw = d.homepage_weekly || [];

          // 4-week branded clicks from homepage_weekly (last 4 vs prior 4)
          const last4w = hw.slice(-4);
          const prev4w = hw.slice(-8, -4);
          const sum4w = arr => arr.reduce((s, w) => s + (w.clicks || 0), 0);
          const branded4wCur = sum4w(last4w);
          const branded4wPrv = sum4w(prev4w);
          const branded4wPct = prev4w.length === 4 && branded4wPrv > 0
            ? +((branded4wCur - branded4wPrv) / branded4wPrv * 100).toFixed(1) : null;

          // Monthly branded from homepage_weekly
          const mbMap = {};
          hw.forEach(w => { const m = w.week.slice(0, 7); mbMap[m] = (mbMap[m] || 0) + (w.clicks || 0); });
          const monthlyBranded = Object.entries(mbMap).sort(([a],[b]) => a.localeCompare(b))
            .map(([mo, clicks]) => ({ label: mo.slice(5), v: clicks }));

          // AEO trend history (needs ≥2 points to chart)
          const aeoHist = (aeo.history || []).length >= 2 ? aeo.history : null;

          // AEO period-over-period pp delta (oldest vs newest snapshot in history)
          const aeo4wMom = aeoHist ? {
            sov:      +((aeoHist[aeoHist.length-1].share_of_voice ?? 0) - (aeoHist[0].share_of_voice ?? 0)).toFixed(1),
            mention:  +((aeoHist[aeoHist.length-1].mention_rate   ?? 0) - (aeoHist[0].mention_rate   ?? 0)).toFixed(1),
            citation: +((aeoHist[aeoHist.length-1].citation_rate  ?? 0) - (aeoHist[0].citation_rate  ?? 0)).toFixed(1),
          } : { sov: null, mention: null, citation: null };

          // ── KPI card ──────────────────────────────────────────────
          const KpiCard = ({ label, value, pct, period, pending, sample }) => {
            const clr = (pct == null) ? C.muted : pct > 0 ? C.success : pct < 0 ? C.danger : C.muted;
            return (
              <div style={{ ...card({ padding: "13px 16px", flex: 1, minWidth: 130 }), position: "relative" }}>
                {sample && <div style={{ position:"absolute", top:4, right:6, fontSize:9, background:"#F0D060", color:"#7A6000", padding:"1px 4px", borderRadius:3, fontWeight:700 }}>SAMPLE</div>}
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: pending ? C.muted : C.primary, margin: "3px 0 2px" }}>
                  {pending ? "—" : value}
                </div>
                <div style={{ fontSize: 11, color: clr }}>
                  {pct != null
                    ? `${pct > 0 ? "↑" : pct < 0 ? "↓" : ""} ${Math.abs(pct)}% ${period}`
                    : <span style={{ color: C.muted, fontStyle: "italic" }}>— {period}</span>}
                </div>
              </div>
            );
          };

          // ── Group label ────────────────────────────────────────────
          const GL = ({ txt, color = C.primary }) => (
            <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, marginTop: 2 }}>{txt}</div>
          );

          // ── Trend chart (or placeholder) ───────────────────────────
          const TrendLine = ({ data, color, label, isPct, h = 130 }) => {
            if (!data || data.length < 2) return (
              <div style={{ height: h, ...card({ background: "#F8F9FA", display:"flex", alignItems:"center", justifyContent:"center", padding:8 }) }}>
                <div style={{ fontSize: 11, color: C.muted, textAlign:"center" }}>Building history…</div>
              </div>
            );
            return (
              <ResponsiveContainer width="100%" height={h}>
                <LineChart data={data} margin={{ left: 2, right: 8, top: 6, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} width={38}
                    tickFormatter={v => isPct ? `${v}%` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                  <RTooltip formatter={v => [isPct ? `${v}%` : v.toLocaleString(), label]} />
                  <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            );
          };

          // ── 7 metric definitions (used across all sections) ────────
          const SEO_METRICS = [
            { id:"organic",  label:"Organic Search",     color: C.accent },
            { id:"ai",       label:"AI Assistant",       color: "#9B59B6" },
            { id:"branded",  label:"Branded Clicks",      color: C.success },
            { id:"top10",    label:"Top 10 Keywords",     color: "#8B4513" },
            { id:"signups",  label:"Total Sign-ups",      color: "#6A5ACD" },
          ];
          const AEO_METRICS = [
            { id:"sov",      label:"AI Share of Voice",  color: "#E67E22", isPct: true },
            { id:"mention",  label:"AI Mention Rate",    color: "#1ABC9C", isPct: true },
            { id:"citation", label:"AI Citation Rate",   color: "#E74C3C", isPct: true },
          ];
          const ALL_METRICS = [...SEO_METRICS, ...AEO_METRICS];

          // ── Per-metric data for each section ───────────────────────

          // Total sign-ups (Hex). Clean weekly series (drop duplicate-window
          // re-runs), clipped to weeks up to the selected dashboard date.
          const suAll = (d.signups?.trend || []).filter(p => !p.overlap);
          const suUpto = suAll.filter(p => p.week <= d.week);
          const suCur = d.signups?.total ?? (suUpto.length ? suUpto[suUpto.length - 1].total : null);
          const suPrev = suUpto.length >= 2 ? suUpto[suUpto.length - 2].total : null;
          const suWowPct = (suCur != null && suPrev) ? +(((suCur - suPrev) / suPrev) * 100).toFixed(1) : null;
          const suSum = arr => arr.reduce((s, p) => s + (p.total || 0), 0);
          const su4wCur = suSum(suUpto.slice(-4));
          const su4wPrev = suSum(suUpto.slice(-8, -4));
          const su4wPct = (suUpto.slice(-8, -4).length === 4 && su4wPrev > 0)
            ? +(((su4wCur - su4wPrev) / su4wPrev) * 100).toFixed(1) : null;
          const suWeekly = suUpto.map(p => ({ label: p.week.slice(5), v: p.total }));
          const suMoMap = {};
          suUpto.forEach(p => { const m = p.week.slice(0, 7); suMoMap[m] = (suMoMap[m] || 0) + (p.total || 0); });
          const suMonthly = Object.entries(suMoMap).sort(([a], [b]) => a.localeCompare(b)).map(([mo, v]) => ({ label: mo.slice(5), v }));

          // SEO Scorecard series from d.seo_trends, clipped to <= the selected week.
          // Organic Search and AI Assistant are separate GA4 channels. Monthly:
          // sessions summed per month; top-10 keeps the latest in-month value
          // (point-in-time count, not summable).
          const seoT = d.seo_trends || {};
          const _clip = a => (a || []).filter(p => p.week <= d.week);
          const orgT = _clip(seoT.organic_search);
          const aiT = _clip(seoT.ai_assistant);
          const top10T = _clip(seoT.top10);
          const _cur = a => (a.length ? a[a.length - 1].v : null);
          const _wow = a => { const c = _cur(a), p = a.length >= 2 ? a[a.length - 2].v : null; return (c != null && p) ? +(((c - p) / p) * 100).toFixed(1) : null; };
          const _sum = a => a.reduce((s, p) => s + (p.v || 0), 0);
          const _4w = a => _sum(a.slice(-4));
          const _4wp = a => { const c = _sum(a.slice(-4)), p = _sum(a.slice(-8, -4)); return (a.slice(-8, -4).length === 4 && p > 0) ? +(((c - p) / p) * 100).toFixed(1) : null; };
          const _ser = a => a.map(p => ({ label: p.week.slice(5), v: p.v }));
          const _kpi = a => (_cur(a) != null ? { value: _cur(a).toLocaleString(), pct: _wow(a) } : { pending: true });
          const _kpi4 = a => (_4w(a) > 0 ? { value: _4w(a).toLocaleString(), pct: _4wp(a) } : { pending: true });
          const _moAgg = (a, mode) => {
            const m = {}, order = [];
            (a || []).forEach(p => { const mo = p.week.slice(0, 7); if (!(mo in m)) { m[mo] = (mode === "sum" ? 0 : null); order.push(mo); } m[mo] = mode === "sum" ? m[mo] + (p.v || 0) : p.v; });
            return order.map(mo => ({ label: mo.slice(5), v: m[mo] }));
          };

          const wowData = {
            organic:  _kpi(orgT),
            ai:       _kpi(aiT),
            branded:  { value: (d.gsc?.branded ?? 0).toLocaleString(), pct: null },
            top10:    { value: sem.top10_count ?? "—", pct: sem.top10_mom ?? null },
            signups:  suCur != null ? { value: suCur.toLocaleString(), pct: suWowPct } : { pending: true },
            sov:      { value: `${aeo.share_of_voice}%`, pct: aeo.share_of_voice_mom, sample: aeoIsSample },
            mention:  { value: `${aeo.mention_rate}%`,   pct: aeo.mention_rate_mom,   sample: aeoIsSample },
            citation: { value: `${aeo.citation_rate}%`,  pct: aeo.citation_rate_mom,  sample: aeoIsSample },
          };

          const fourWkData = {
            organic:  _kpi4(orgT),
            ai:       _kpi4(aiT),
            branded:  { value: branded4wCur.toLocaleString(), pct: branded4wPct },
            top10:    sem.top10_count != null
              ? { value: sem.top10_count.toLocaleString(), pct: sem.top10_mom ?? null }
              : { pending: true },
            signups:  su4wCur > 0 ? { value: su4wCur.toLocaleString(), pct: su4wPct } : { pending: true },
            sov:      { value: `${aeo.share_of_voice}%`, pct: aeo4wMom.sov,      sample: aeoIsSample },
            mention:  { value: `${aeo.mention_rate}%`,   pct: aeo4wMom.mention,  sample: aeoIsSample },
            citation: { value: `${aeo.citation_rate}%`,  pct: aeo4wMom.citation, sample: aeoIsSample },
          };

          const weeklyCharts = {
            organic:  orgT.length >= 2 ? _ser(orgT) : null,
            ai:       aiT.length >= 2 ? _ser(aiT) : null,
            branded:  hw.map(w => ({ label: w.week.slice(5), v: w.clicks })),
            top10:    top10T.length >= 2 ? _ser(top10T) : null,
            signups:  suWeekly.length >= 2 ? suWeekly : null,
            sov:      aeoHist ? aeoHist.map(h => ({ label: (h.month||"").slice(5), v: h.share_of_voice })) : null,
            mention:  aeoHist ? aeoHist.map(h => ({ label: (h.month||"").slice(5), v: h.mention_rate }))   : null,
            citation: aeoHist ? aeoHist.map(h => ({ label: (h.month||"").slice(5), v: h.citation_rate }))  : null,
          };

          const monthlyCharts = {
            organic:  _moAgg(orgT, "sum").length >= 2 ? _moAgg(orgT, "sum") : null,
            ai:       _moAgg(aiT, "sum").length >= 2 ? _moAgg(aiT, "sum") : null,
            branded:  monthlyBranded,
            top10:    _moAgg(top10T, "last").length >= 2 ? _moAgg(top10T, "last") : null,
            signups:  suMonthly.length >= 2 ? suMonthly : null,
            sov:      aeoHist ? aeoHist.map(h => ({ label: (h.month||"").slice(5), v: h.share_of_voice })) : null,
            mention:  aeoHist ? aeoHist.map(h => ({ label: (h.month||"").slice(5), v: h.mention_rate }))   : null,
            citation: aeoHist ? aeoHist.map(h => ({ label: (h.month||"").slice(5), v: h.citation_rate }))  : null,
          };

          // ── Row of KPI cards for one section ──────────────────────
          const KpiSection = ({ dataMap, period }) => (
            <>
              <GL txt="📈 SEO" />
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
                {SEO_METRICS.map(m => <KpiCard key={m.id} label={m.label} period={period} {...dataMap[m.id]} />)}
              </div>
              <GL txt="🤖 AEO — AI Visibility" color={C.accent} />
              {aeoIsSample && <div style={{ fontSize:11, color:"#7A6000", background:"#FFF9E6", border:"1px solid #F0D060", borderRadius:4, padding:"4px 10px", marginBottom:6 }}>Sample data (Apr 2026) — connect AthenaHQ API for live figures</div>}
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {AEO_METRICS.map(m => <KpiCard key={m.id} label={m.label} period={period} {...dataMap[m.id]} />)}
              </div>
            </>
          );

          // ── Grid of 7 trend charts ─────────────────────────────────
          const ChartGrid = ({ chartMap }) => (
            <>
              <GL txt="📈 SEO" />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:14, marginBottom:16 }}>
                {SEO_METRICS.map(m => (
                  <div key={m.id}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.primary, marginBottom:4 }}>{m.label}</div>
                    <TrendLine data={chartMap[m.id]} color={m.color} label={m.label} isPct={m.isPct} />
                  </div>
                ))}
              </div>
              <GL txt="🤖 AEO — AI Visibility" color={C.accent} />
              {aeoIsSample && <div style={{ fontSize:11, color:"#7A6000", background:"#FFF9E6", border:"1px solid #F0D060", borderRadius:4, padding:"4px 10px", marginBottom:6 }}>Sample data — trend charts available once AthenaHQ API is connected</div>}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:14 }}>
                {AEO_METRICS.map(m => (
                  <div key={m.id}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.accent, marginBottom:4 }}>{m.label}</div>
                    <TrendLine data={chartMap[m.id]} color={m.color} label={m.label} isPct={m.isPct} />
                  </div>
                ))}
              </div>
            </>
          );

          return (<>
            {/* ── SECTION 1: WoW ── */}
            <Section title="1 — This Week vs Prior Week">
              <KpiSection dataMap={wowData} period="WoW" />
            </Section>

            {/* ── SECTION 2: 4-Week ── */}
            <Section title="2 — Last 4 Weeks vs Prior 4 Weeks">
              <KpiSection dataMap={fourWkData} period="4-week" />
              {prev4w.length < 4 && (
                <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
                  Sessions, keywords, and AEO 4-week comparisons will populate as more weekly pipeline runs accumulate. Branded clicks use homepage GSC history.
                </p>
              )}
            </Section>

            {/* ── SECTION 3: Weekly Charts ── */}
            <Section title="3 — Weekly Trends">
              <ChartGrid chartMap={weeklyCharts} />
              <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
                Branded clicks (homepage GSC) and Total Sign-ups (Hex) available now. Sessions, keywords, and AEO charts build as weekly pipeline runs accumulate.
              </p>
            </Section>

            {/* ── SECTION 4: Monthly Charts ── */}
            <Section title="4 — Monthly Trends">
              <ChartGrid chartMap={monthlyCharts} />
              <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
                Branded clicks aggregated monthly from GSC homepage data. Other metrics build as data accumulates.
              </p>
            </Section>

            {/* ── SECTION 5: New Keywords ── */}
            <Section title="5 — New Keywords Entering Top 10">
              {(sem.new_top10 || []).length > 0 ? (
                <>
                  <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
                    {sem.new_top10.length} keyword{sem.new_top10.length !== 1 ? "s" : ""} newly entered top 10 since {sem.prev_snapshot_date || "last snapshot"}.
                  </p>
                  <Table
                    headers={["Keyword", "Position", "Previous", "Search Vol"]}
                    rows={sem.new_top10.map(k => [
                      k.keyword,
                      <span style={{ fontWeight: 700, color: C.success }}>{k.position}</span>,
                      k.prev_position ?? <span style={{ color: C.muted }}>New</span>,
                      (k.search_volume || 0).toLocaleString(),
                    ])}
                  />
                </>
              ) : (sem.top10_keywords || []).length > 0 ? (
                <>
                  <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
                    Showing all {sem.top10_keywords.length} current top-10 keywords. Week-over-week "new" tracking starts after the second snapshot.
                  </p>
                  <Table
                    headers={["Position", "Keyword", "Search Volume", "URL"]}
                    rows={sem.top10_keywords.map(k => [
                      <span style={{ fontWeight: 700, color: C.primary }}>{k.position}</span>,
                      k.keyword,
                      (k.search_volume || 0).toLocaleString(),
                      <a href={k.url} target="_blank" rel="noopener noreferrer"
                         style={{ fontSize: 11, color: C.accent, textDecoration: "none" }}
                         onMouseOver={e => e.currentTarget.style.textDecoration = "underline"}
                         onMouseOut={e => e.currentTarget.style.textDecoration = "none"}>
                        {(k.url || "").replace(/^https?:\/\//, "").slice(0, 55)}
                      </a>,
                    ])}
                  />
                </>
              ) : (
                <p style={{ fontSize: 13, color: C.muted }}>No keyword data available yet.</p>
              )}
            </Section>

            <p style={{ fontSize: 11, color: "#888", marginTop: 16, paddingTop: 8, borderTop: "1px solid #333", textAlign: "left" }}>
              📅 GA4: {d.ga4?.main_site?.week_start || "—"} – {d.ga4?.main_site?.week_end || "—"} ·
              GSC: {d.gsc?.week_start || "—"} – {d.gsc?.week_end || "—"} ·
              Keywords: {sem.snapshot_date || "—"} · AEO: {aeoIsSample ? "sample (Apr 2026)" : "live"}
            </p>
          </>);
        })()}

      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 24px", textAlign: "center", color: C.muted, fontSize: 12, background: C.white }}>
        Compy · GrowthBook Competitive Intelligence · {d.week || "—"} · Data: GSC + DataForSEO + YouTube API
      </div>
    </div>
  );
}
