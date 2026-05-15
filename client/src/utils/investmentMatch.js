import { schools } from "../data/schools.js";
import { parishes } from "../data/parishes.js";

const ROLE_WEIGHTS = {
  corporate: { stem: 1.2, cte: 1.25, healthcare: 1.15, literacy: 0.85, "teacher-support": 0.9, "student-services": 0.8 },
  philanthropist: { literacy: 1.3, "early-childhood": 1.2, "student-services": 1.15, stem: 0.9, cte: 0.85, healthcare: 0.9 },
  education: { "teacher-support": 1.3, literacy: 1.15, stem: 1.0, cte: 1.05, "student-services": 1.1 },
  agency: { "student-services": 1.2, literacy: 1.1, cte: 1.0, healthcare: 1.0 },
  operator: { cte: 1.2, stem: 1.1, "teacher-support": 1.15, literacy: 1.0 }
};

const BUDGET_BANDS = {
  "10k-50k": { min: 0.01, max: 0.05, label: "classroom and tutoring scale" },
  "50k-250k": { min: 0.05, max: 0.25, label: "program-level support" },
  "250k-1m": { min: 0.25, max: 1, label: "school-wide initiatives" },
  "1m-5m": { min: 1, max: 5, label: "multi-site or district programs" },
  "5m-plus": { min: 5, max: 50, label: "transformational partnerships" }
};

const WHY_TEMPLATES = {
  literacy: "Literacy need and pathway fit align with your focus on reading intervention.",
  stem: "STEM-oriented programs and workforce demand overlap with your profile.",
  cte: "Career and technical education aligns with workforce-gap signals in this parish.",
  healthcare: "Healthcare pathway demand is elevated in regional workforce reporting.",
  "teacher-support": "Teacher pipeline and retention supports match your investment profile.",
  "student-services": "Student support services address high-need enrollment and access signals.",
  "early-childhood": "Early childhood foundation aligns with literacy and access priorities."
};

function parishOpportunityBoost(parishId) {
  const p = parishes.find((x) => x.id === parishId);
  if (!p?.hasMetrics) return 0;
  return (p.opportunityScore || 0) / 100;
}

function whyMatch(school, focusKey, parish) {
  const focusLine = WHY_TEMPLATES[focusKey] || "Need signals and pathway fit align with your selected focus.";
  const parishLine = parish?.hasMetrics
    ? `${parish.name.replace(" Parish", "")} scores ${parish.opportunityScore}/100 in the sample model.`
    : `${school.parishName} Parish is mapped; detailed scoring is pending.`;
  return `${focusLine} ${parishLine}`;
}

export function matchSchools({ role, budget, focus }) {
  const roleWeights = ROLE_WEIGHTS[role] || ROLE_WEIGHTS.philanthropist;
  const band = BUDGET_BANDS[budget] || BUDGET_BANDS["250k-1m"];
  const focusKey = focus || "literacy";
  const focusWeight = roleWeights[focusKey] ?? 1;

  const scored = schools.map((school) => {
    const parish = parishes.find((p) => p.id === school.parishId);
    const focusMatch = school.focusAreas?.includes(focusKey) ? 1 : 0.35;
    const needScore =
      (school.freeReducedLunchPct / 100) * 0.3 +
      focusMatch * 0.35 * focusWeight +
      parishOpportunityBoost(school.parishId) * 0.35;
    const matchPct = Math.min(96, Math.max(68, Math.round(needScore * 100)));
    return {
      ...school,
      matchPct,
      whyMatch: whyMatch(school, focusKey, parish),
      budgetFit: band.label,
      badge: "demo"
    };
  });

  return scored.sort((a, b) => b.matchPct - a.matchPct).slice(0, 5);
}

export const INTAKE_ROLES = [
  { id: "corporate", title: "Corporate sponsor", desc: "Workforce pipeline and CTE partnerships", icon: "briefcase" },
  { id: "philanthropist", title: "Philanthropist", desc: "Impact-driven giving in education", icon: "heart" },
  { id: "education", title: "Education organization", desc: "Partner with or support K-12 schools", icon: "book" },
  { id: "agency", title: "Public agency", desc: "Public investment or program alignment", icon: "landmark" },
  { id: "operator", title: "School operator", desc: "Charter, district, or network expansion", icon: "school" }
];

export const INTAKE_BUDGETS = [
  { id: "10k-50k", title: "$10,000 – $50,000", desc: "Classroom grants, supplies, tutoring" },
  { id: "50k-250k", title: "$50,000 – $250,000", desc: "Programs, teacher support, technology" },
  { id: "250k-1m", title: "$250,000 – $1 Million", desc: "School-wide initiatives, facilities" },
  { id: "1m-5m", title: "$1 Million – $5 Million", desc: "District programs, major infrastructure" },
  { id: "5m-plus", title: "$5 Million+", desc: "Transformational partnerships" }
];

export const INTAKE_FOCUS = [
  { id: "literacy", title: "Literacy and reading", desc: "K–3 intervention, Science of Reading", icon: "book" },
  { id: "stem", title: "STEM education", desc: "Science, technology, engineering, math", icon: "flask" },
  { id: "cte", title: "Career and technical education", desc: "CTE, trades, and workforce pathways", icon: "wrench" },
  { id: "healthcare", title: "Healthcare pathways", desc: "Nursing, allied health, and clinical pipelines", icon: "heart-pulse" },
  { id: "teacher-support", title: "Teacher support", desc: "Recruitment, retention, professional development", icon: "users" },
  { id: "student-services", title: "Student support services", desc: "Wraparound and access supports", icon: "hand-helping" }
];
