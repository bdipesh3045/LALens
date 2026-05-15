/**
 * Sample school records for K-12 intake matching only.
 * Names reflect real Louisiana school types; scores and funding ranges are demo estimates.
 */

export const schools = [
  {
    id: "tensas-elementary",
    name: "Tensas Elementary School",
    parishId: "claiborne",
    parishName: "Tensas",
    type: "Elementary",
    enrollment: 234,
    freeReducedLunchPct: 95,
    needSignal: "High poverty / literacy need",
    pathwayFit: "Literacy, math foundations",
    investmentRange: "$750K–$1.2M estimated",
    programs: ["Literacy First", "Math Foundations"],
    focusAreas: ["literacy", "early-childhood", "student-services"],
    sampleMatch: true
  },
  {
    id: "st-landry-voc",
    name: "St. Landry Parish Vocational High",
    parishId: "st-landry",
    parishName: "St. Landry",
    type: "High School",
    enrollment: 580,
    freeReducedLunchPct: 88,
    needSignal: "Workforce gap",
    pathwayFit: "Agriculture, skilled trades",
    investmentRange: "$1M–$2M estimated",
    programs: ["Agriculture", "Skilled Trades"],
    focusAreas: ["cte", "stem", "teacher-support"],
    sampleMatch: true
  },
  {
    id: "madison-high",
    name: "Madison Parish High School",
    parishId: "claiborne",
    parishName: "Madison",
    type: "High School",
    enrollment: 412,
    freeReducedLunchPct: 92,
    needSignal: "Rural access / STEM",
    pathwayFit: "Agricultural science, basic STEM",
    investmentRange: "$900K–$1.8M estimated",
    programs: ["Agricultural Science", "Basic STEM"],
    focusAreas: ["stem", "cte"],
    sampleMatch: true
  },
  {
    id: "natchitoches-lab",
    name: "Northwestern State University Lab School",
    parishId: "rapides",
    parishName: "Natchitoches",
    type: "K-12",
    enrollment: 312,
    freeReducedLunchPct: 68,
    needSignal: "Regional partner potential",
    pathwayFit: "STEM foundations",
    investmentRange: "$750K–$1.3M estimated",
    programs: ["Literacy Lab", "STEM Foundations"],
    focusAreas: ["literacy", "stem"],
    sampleMatch: true
  },
  {
    id: "rapides-central",
    name: "Rapides Central High School",
    parishId: "rapides",
    parishName: "Rapides",
    type: "High School",
    enrollment: 945,
    freeReducedLunchPct: 81,
    needSignal: "Healthcare demand",
    pathwayFit: "Healthcare academy",
    investmentRange: "$1M–$2M estimated",
    programs: ["Healthcare Academy", "CTE"],
    focusAreas: ["healthcare", "cte"],
    sampleMatch: true
  },
  {
    id: "caddo-career",
    name: "Caddo Career & Technology Center",
    parishId: "caddo",
    parishName: "Caddo",
    type: "Career Center",
    enrollment: 520,
    freeReducedLunchPct: 78,
    needSignal: "Workforce alignment",
    pathwayFit: "Manufacturing, healthcare",
    investmentRange: "$1M–$2M estimated",
    programs: ["Manufacturing", "Healthcare Pathway"],
    focusAreas: ["cte", "healthcare"],
    sampleMatch: true
  },
  {
    id: "orleans-health",
    name: "Warren Easton Charter High School",
    parishId: "orleans",
    parishName: "Orleans",
    type: "High School",
    enrollment: 720,
    freeReducedLunchPct: 82,
    needSignal: "Urban pathway expansion",
    pathwayFit: "Healthcare, culinary arts",
    investmentRange: "$750K–$1.5M estimated",
    programs: ["Healthcare", "Culinary Arts"],
    focusAreas: ["healthcare", "cte", "student-services"],
    sampleMatch: true
  },
  {
    id: "benjamin-franklin",
    name: "Benjamin Franklin High School",
    parishId: "orleans",
    parishName: "Orleans",
    type: "High School",
    enrollment: 892,
    freeReducedLunchPct: 18,
    needSignal: "STEM pathway depth",
    pathwayFit: "IB, STEM, arts",
    investmentRange: "$750K–$1.5M estimated",
    programs: ["International Baccalaureate", "STEM"],
    focusAreas: ["stem", "literacy"],
    sampleMatch: true
  },
  {
    id: "lafayette-renaissance",
    name: "Lafayette Renaissance Charter",
    parishId: "lafayette",
    parishName: "Lafayette",
    type: "High School",
    enrollment: 654,
    freeReducedLunchPct: 38,
    needSignal: "CTE expansion",
    pathwayFit: "Career technical education",
    investmentRange: "$1M–$2.1M estimated",
    programs: ["CTE", "Dual Enrollment"],
    focusAreas: ["cte", "stem"],
    sampleMatch: true
  },
  {
    id: "terrebonne-maritime",
    name: "Terrebonne Maritime Academy",
    parishId: "terrebonne",
    parishName: "Terrebonne",
    type: "High School",
    enrollment: 420,
    freeReducedLunchPct: 58,
    needSignal: "Coastal workforce pathways",
    pathwayFit: "Maritime trades, logistics",
    investmentRange: "$900K–$1.4M estimated",
    programs: ["Maritime Trades", "Logistics"],
    focusAreas: ["cte", "stem"],
    sampleMatch: true
  }
];

export function getSchoolsByParishId(parishId) {
  return schools.filter((s) => s.parishId === parishId);
}

export function formatFunding(millions) {
  if (!millions && millions !== 0) return "See range";
  if (millions >= 1) return `$${millions.toFixed(1)}M`;
  return `$${(millions * 1000).toFixed(0)}K`;
}
