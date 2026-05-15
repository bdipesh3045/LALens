/** Opportunity Score model: weighted factor blend (0–100). */

export const DEFAULT_WEIGHTS = {
  studentNeedScore: 0.35,
  enrollmentPressureScore: 0.2,
  workforceGapScore: 0.25,
  pathwayAccessGapScore: 0.1,
  feasibilityScore: 0.1
};

const FACTOR_KEYS = Object.keys(DEFAULT_WEIGHTS);

const DRIVER_LABELS = {
  studentNeedScore: "Student Need",
  enrollmentPressureScore: "Enrollment Pressure",
  workforceGapScore: "Workforce Gap",
  pathwayAccessGapScore: "Pathway Access Gap",
  feasibilityScore: "Feasibility"
};

function clamp0to100(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.min(100, Math.max(0, x));
}

/**
 * Normalize arbitrary non-negative weights so they sum to 1.
 * Missing or invalid keys fall back to DEFAULT_WEIGHTS for that key.
 */
export function normalizeWeights(weights) {
  const merged = {};
  let sum = 0;
  for (const k of FACTOR_KEYS) {
    const raw = weights && Object.prototype.hasOwnProperty.call(weights, k) ? Number(weights[k]) : NaN;
    const v = Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_WEIGHTS[k];
    merged[k] = v;
    sum += v;
  }
  if (sum <= 0) return { ...DEFAULT_WEIGHTS };
  const out = {};
  for (const k of FACTOR_KEYS) out[k] = merged[k] / sum;
  return out;
}

/**
 * @param {object} factors — five factor scores (0–100 each)
 * @param {object} [weights] — optional custom weights (normalized internally)
 * @returns {number} rounded integer 0–100
 */
export function computeOpportunityScore(factors, weights = DEFAULT_WEIGHTS) {
  const w = normalizeWeights(weights);
  let total = 0;
  for (const k of FACTOR_KEYS) {
    total += clamp0to100(factors?.[k]) * (w[k] ?? 0);
  }
  return Math.round(total);
}

/** @param {number} score — opportunity score 0–100 */
export function getPriorityLevel(score) {
  const s = clamp0to100(score);
  if (s >= 85) return "Urgent";
  if (s >= 70) return "High";
  if (s >= 50) return "Moderate";
  return "Low";
}

/**
 * Top contributors by weighted contribution (value × weight).
 * @returns {{ key: string, label: string, value: number, contribution: number }[]}
 */
export function explainScoreDrivers(parish, weights = DEFAULT_WEIGHTS) {
  if (!parish) return [];
  const w = normalizeWeights(weights);
  const scored = FACTOR_KEYS.map((key) => {
    const value = clamp0to100(parish[key]);
    const contribution = value * (w[key] ?? 0);
    return { key, label: DRIVER_LABELS[key], value, contribution };
  });
  scored.sort((a, b) => b.contribution - a.contribution);
  return scored.slice(0, 3);
}
