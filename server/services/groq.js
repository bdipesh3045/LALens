const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

/** Handles pasted .env lines, quotes, and BOM so the key actually reaches Groq */
export function readGroqApiKey() {
  let k = process.env.GROQ_API_KEY;
  if (!k) return "";
  k = String(k).replace(/^\ufeff/, "").trim();
  if (/^GROQ_API_KEY\s*=/i.test(k)) {
    k = k.replace(/^GROQ_API_KEY\s*=\s*/i, "").trim();
  }
  k = k.replace(/^["']|["']$/g, "").trim();
  return k;
}

export function isGroqConfigured() {
  return readGroqApiKey().length > 10;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
}

let warnedMissingGroqKey = false;

export async function generateGroqInsight({ message, selectedParish, contextParishes, history = [] }) {
  const apiKey = readGroqApiKey();
  if (!apiKey) {
    if (!warnedMissingGroqKey) {
      warnedMissingGroqKey = true;
      console.warn("[groq] GROQ_API_KEY missing or empty after parsing; using rule-based fallback.");
    }
    return null;
  }

  try {
    const context = {
      datasetCoverage: `The parishCatalog array contains ${contextParishes.length} Louisiana parishes (full map layer). Only entries with hasMetrics true carry prototype Opportunity Scores and narrative fields; others are geography-only pending official data integration.`,
      focusParish: selectedParish,
      parishCatalog: contextParishes,
      methodology: {
        formula: "35% Student Need + 20% Enrollment Pressure + 25% Workforce Gap + 10% Pathway Access Gap + 10% Feasibility",
        caution: "Decision-support model only. No exact causal impact claims."
      }
    };

    const systemPrompt = `
You are the AI Insight Engine for Louisiana Opportunity Navigator.
You must answer ONLY from the JSON in the latest user message under "Grounding context". That object includes datasetCoverage, focusParish (the parish the user most likely means), and parishCatalog (all Louisiana parishes in the catalog). Do not invent statistics, parishes, source agency names not present in the JSON, or causal projections.
Never claim, imply, or quantify exact causal impact of programs, policies, or investments (no ROI, effect sizes, or “proven outcomes” unless explicitly present in the JSON—which it is not).
You are using a 64-parish map catalog with prototype metrics for a subset only (see hasMetrics on each record). Do not imply official statewide scoring for parishes where hasMetrics is false.
If focusParish or the parish under discussion has hasMetrics false, do not state or imply an Opportunity Score, priority tier, or numeric metric values that are not present in that parish’s JSON. Instead explain that the parish is mapped for geography only, that detailed metrics are not yet integrated, and list the data categories still needed (LDOE performance/enrollment/attendance, Census ACS demographics, Louisiana Workforce Commission projections, NCES school locations, pathway inventory) as integration next steps—not as if they are already in the dataset.
For investment or ranking questions across parishes, rank or compare only entries with hasMetrics true and state explicitly that ranking is limited to parishes with prototype metrics in this build.
If the user asks for data that is not present in the JSON, say what is missing.
If the user names a parish, use its entry from parishCatalog. If it is missing, say so.
If requested information is missing in the JSON, say "missing in prototype dataset" for that item.
Keep a professional civic-tech tone. Use these exact headings:
1. Direct answer
2. Evidence from available data
3. Recommendation
4. Confidence level
5. Limitation or caution
`;

    const prior = sanitizeHistory(history);
    const userPayload = `Question: ${message}\n\nGrounding context:\n${JSON.stringify(context)}`;

    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        max_tokens: 900,
        messages: [{ role: "system", content: systemPrompt.trim() }, ...prior, { role: "user", content: userPayload }]
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.warn("[groq] API error", response.status, errText.slice(0, 500));
      return null;
    }
    const payload = await response.json();
    const answer = payload?.choices?.[0]?.message?.content?.trim();
    if (!answer) return null;
    const confidence = answer.match(/Confidence level[:\s]+(.+)/i)?.[1]?.trim() || selectedParish?.confidence || "Medium";

    return {
      answer,
      sources: [
        "Louisiana parish catalog (64 mapped, retrieved)",
        "Sample prototype metrics subset (where hasMetrics is true, retrieved)",
        "Opportunity score methodology (retrieved)"
      ],
      confidence
    };
  } catch (e) {
    console.warn("[groq] request failed", e?.message || e);
    return null;
  }
}
