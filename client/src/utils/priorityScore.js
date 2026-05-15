/** Priority investment score: (workforce gap × poverty index) / current funding */

export function computePriorityScore(school) {
  const gap = Number(school.workforceGapPct) || 0;
  const poverty = Number(school.povertyIndex) || 0;
  const funding = Math.max(Number(school.currentFundingM) || 0.1, 0.1);
  return Math.round(((gap * poverty) / funding) * 10) / 10;
}

export function rankSchoolsByPriority(schoolList) {
  return [...schoolList]
    .map((s) => ({ ...s, priorityScore: computePriorityScore(s) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

export function gapBarClass(pct) {
  if (pct >= 40) return "critical";
  if (pct >= 30) return "warning";
  return "moderate";
}
