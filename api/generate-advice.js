// Live, on-click content-advice generation for the Compy dashboard.
//
// The dashboard is a static site, so this Vercel serverless function is the
// "backend" the "Generate advice" button calls. On each click it:
//   1. fetches the page's actual live content (so the advice is page-aware),
//   2. assembles the full context the dashboard has for that row (ACP/NCV scores,
//      verdict, position/impressions) plus the strategic objective,
//   3. calls Claude (same model family the pipeline uses) to write specific edits.
//
// Requires an LLM key in the Vercel project env: ANTHROPIC_API_KEY (preferred) or
// OPENROUTER_API_KEY. Without one it returns 503 and the button shows a graceful
// "advice unavailable" message.

export const maxDuration = 30; // page fetch + LLM can take >10s

const SYSTEM = `You are GrowthBook's SEO/AEO content strategist. GrowthBook is an open-source A/B testing and feature-flagging platform. Given a specific page's actual content, its performance data, and GrowthBook's strategic objective (maximize AI-citation share + bottom-funnel signups per unit of effort), write CONCRETE, page-specific edits — not generic advice.

Rules:
- 2-4 bullets, each a specific change tied to what IS or ISN'T already on the page (e.g. "You have a comparison table but no FAQPage schema — add it", "The intro is 3 paragraphs; lead instead with a 40-word answer capsule for the query X").
- Prioritize AI-Overview citation (answer capsules, schema, definitional clarity) and moving the page into the top 5 / converting to signups.
- If the page already does something well, say so briefly and build on it.
- Plain text bullets starting with "- ". No preamble, no markdown headers. Keep under 120 words.`;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPageText(url) {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "CompyBot/1.0 (+growthbook competitive intelligence)" },
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) return "";
    const html = await r.text();
    return stripHtml(html).slice(0, 9000);
  } catch {
    return "";
  }
}

async function callClaude(system, userText) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (anthropicKey) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 700,
        system,
        messages: [{ role: "user", content: userText }],
      }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error?.message || `Anthropic HTTP ${r.status}`);
    return (j?.content || []).map((b) => b.text || "").join("").trim();
  }
  if (openrouterKey) {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openrouterKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-6",
        max_tokens: 700,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userText },
        ],
      }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error?.message || `OpenRouter HTTP ${r.status}`);
    return (j?.choices?.[0]?.message?.content || "").trim();
  }
  const e = new Error("No LLM API key configured in Vercel (set ANTHROPIC_API_KEY or OPENROUTER_API_KEY).");
  e.code = 503;
  throw e;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }
  if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ error: "Advice unavailable — no LLM API key configured in Vercel." });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const item = body.item || {};
    const context = body.context || {};
    const pageText = item.url ? await fetchPageText(item.url) : "";

    const userText = JSON.stringify({
      page: {
        title: item.title,
        url: item.url,
        track: item.track,
        ncvScore: item.ncvScore,
        strategicValue: item.strategicValue,
        performance: item.performance,
        verdict: item.verdict,
        position: item.position,
        impressions: item.impressions,
        weeksOld: item.weeksOld,
      },
      strategicContext: context,
      currentPageContent: pageText || "(page content could not be fetched — advise from the data and URL/topic)",
    });

    const advice = await callClaude(SYSTEM, userText);
    return res.status(200).json({ advice, pageFetched: Boolean(pageText) });
  } catch (e) {
    const code = e.code === 503 ? 503 : 500;
    return res.status(code).json({ error: String(e.message || e) });
  }
}
