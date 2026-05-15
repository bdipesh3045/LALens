import { computeOpportunityScore, getPriorityLevel } from "./scoring.js";

const PENDING_FIELDS = {
  opportunityScore: null,
  priorityLevel: "Pending",
  recommendedIntervention: "Data integration pending",
  recommendationSummary:
    "This parish is included for statewide map coverage. Detailed education, workforce, and pathway metrics are not yet integrated in the current prototype.",
  keyEvidence: ["Parish geography is available.", "Official metric integration is pending."],
  risks: ["No parish-level score should be interpreted until source data is connected."],
  potentialPartners: [],
  confidence: "Not Available",
  studentNeedScore: null,
  enrollmentPressureScore: null,
  workforceGapScore: null,
  pathwayAccessGapScore: null,
  feasibilityScore: null,
  proficiencyRate: null,
  chronicAbsenteeismRate: null,
  enrollmentChangePercent: null,
  graduationRate: null,
  povertyRate: null,
  topWorkforceDemand: [],
  enrollmentTrend: [],
  workforceFit: []
};

/** Slug-style id from display name (fallback helper). */
export function normalizeParishId(nameOrId) {
  if (!nameOrId || typeof nameOrId !== "string") return "";
  const s = nameOrId
    .toLowerCase()
    .replace(/parish/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s;
}

function enrichMetricRecord(p) {
  const factors = {
    studentNeedScore: p.studentNeedScore,
    enrollmentPressureScore: p.enrollmentPressureScore,
    workforceGapScore: p.workforceGapScore,
    pathwayAccessGapScore: p.pathwayAccessGapScore,
    feasibilityScore: p.feasibilityScore
  };
  const opportunityScore = computeOpportunityScore(factors);
  const priorityLevel = getPriorityLevel(opportunityScore);
  return {
    ...p,
    opportunityScore,
    priorityLevel,
    hasMetrics: true,
    coverageStatus: "sample"
  };
}

/**
 * @param {Array<{ id: string, name: string, region: string, coordinates: number[] }>} geoList
 * @param {Array<object>} metricRecords raw factor rows (same shape as parishRecords)
 */
export function mergeParishGeographyWithMetrics(geoList, metricRecords) {
  const metricMap = new Map(metricRecords.map((m) => [m.id, enrichMetricRecord(m)]));
  return geoList.map((geo) => {
    const hit = metricMap.get(geo.id);
    if (hit) {
      return {
        ...geo,
        ...hit,
        name: hit.name || geo.name,
        region: hit.region || geo.region,
        coordinates: hit.coordinates || geo.coordinates,
        hasMetrics: true,
        coverageStatus: "sample"
      };
    }
    return {
      ...geo,
      ...PENDING_FIELDS,
      hasMetrics: false,
      coverageStatus: "pending"
    };
  });
}

/** Safe accessor for UI (returns the merged parish object as-is). */
export function getDisplayParish(parish) {
  return parish || null;
}
