import { parishes } from "../data/parishes";

function needSignal(parish) {
  if (parish.studentNeedScore >= 80) return "High academic need";
  if (parish.workforceGapScore >= 78) return "Workforce gap";
  if (parish.pathwayAccessGapScore >= 75) return "Pathway access gap";
  if (parish.enrollmentPressureScore >= 65) return "Enrollment pressure";
  return "Mixed need signals";
}

function pathwayFit(parish) {
  const sectors = parish.topWorkforceDemand || [];
  if (sectors.length >= 2) return sectors.slice(0, 2).join(", ");
  return parish.recommendedIntervention?.split(" ")[0] || "Regional pathways";
}

function investmentRange(parish) {
  const score = parish.opportunityScore || 50;
  if (score >= 85) return "$1.5M–$3M demo range";
  if (score >= 70) return "$1M–$2M demo range";
  return "$750K–$1.5M demo range";
}

export function rankParishesForInvestment(parishList = parishes) {
  return parishList
    .filter((p) => p.hasMetrics && typeof p.opportunityScore === "number")
    .map((p) => ({
      id: p.id,
      name: p.name.replace(" Parish", ""),
      region: p.region,
      type: "Parish",
      needSignal: needSignal(p),
      pathwayFit: pathwayFit(p),
      matchScore: p.opportunityScore,
      investmentEstimate: investmentRange(p),
      priorityLevel: p.priorityLevel,
      badge: "model"
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
