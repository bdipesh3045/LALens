/**
 * Resolve which parish the user is asking about from free text (RAG-style retrieval
 * over the parish catalog). UI selection is a fallback handled by the caller.
 */

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/parish/gi, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const row = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const cur = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = cur;
    }
  }
  return row[n];
}

/** Manual aliases for demo typos and short names */
const EXTRA_ALIASES = {
  claiborne: ["claireborn", "clairborne", "clayborn", "claiborn", "claborne"],
  "st-landry": ["saint landry", "st landry"],
  "east-baton-rouge": ["ebr", "baton rouge", "east baton"],
  orleans: ["new orleans"]
};

function parishTokens(parish) {
  const short = normalize(parish.name.replace(/parish/i, ""));
  const fromId = parish.id.replace(/-/g, " ");
  const extras = EXTRA_ALIASES[parish.id] || [];
  return [short, fromId, normalize(fromId), ...extras.map(normalize)].filter(Boolean);
}

/**
 * @param {string} message
 * @param {Array<{ id: string, name: string }>} parishes
 * @returns {object | null}
 */
export function resolveParishFromUserMessage(message, parishes) {
  const normMsg = normalize(message);
  if (!normMsg) return null;

  for (const p of parishes) {
    for (const tok of parishTokens(p)) {
      if (tok.length >= 3 && normMsg.includes(tok)) return p;
    }
  }

  const words = normMsg.split(" ").filter((w) => w.length >= 4);
  let best = null;
  let bestDist = Infinity;

  for (const p of parishes) {
    const short = normalize(p.name.replace(/parish/i, ""));
    const first = short.split(" ")[0] || short;
    if (first.length < 4) continue;

    for (const w of words) {
      if (w.length < 5) continue;
      const d = levenshtein(w, first);
      const maxLen = Math.max(w.length, first.length);
      const threshold = maxLen >= 9 ? 3 : maxLen >= 7 ? 2 : 1;
      if (d <= threshold && d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
  }

  return best;
}
