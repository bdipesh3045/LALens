export const dataSources = [
  {
    name: "Louisiana Department of Education",
    contributes: "School performance, enrollment, attendance, report cards, intervention context",
    usage: "Student need, enrollment pressure, and district-level signals",
    status: "CSV-ready · integration planned"
  },
  {
    name: "Louisiana School Finder",
    contributes: "Public school profiles and accountability context",
    usage: "Pathway access and local accountability framing",
    status: "Future integration"
  },
  {
    name: "NCES EDGE",
    contributes: "School geocodes and location data",
    usage: "Map layers and distance-to-pathway analysis",
    status: "CSV-ready"
  },
  {
    name: "U.S. Census Bureau",
    contributes: "Poverty, demographics, population context (ACS)",
    usage: "Socioeconomic weighting and normalization",
    status: "API-ready"
  },
  {
    name: "Louisiana Workforce Commission",
    contributes: "Occupational projections and regional demand",
    usage: "Workforce gap and sector-fit scoring",
    status: "CSV-ready · integration planned"
  },
  {
    name: "Bureau of Labor Statistics",
    contributes: "Employment and wage estimates",
    usage: "Cross-check of demand assumptions",
    status: "API-ready · CSV-ready"
  },
  {
    name: "DevDays Challenge Brief",
    contributes: "Challenge goals and stakeholder priorities",
    usage: "Project framing and recommendation tone",
    status: "Included as project context"
  },
  {
    name: "Current Prototype Dataset (12 parishes)",
    contributes: "Twelve sample parish-level records used to demonstrate scoring, mapping, and AI workflow—not statewide data.",
    usage: "Drives the current demo until official public datasets are connected for all 64 Louisiana parishes.",
    status: "Mocked · sample only"
  }
];
