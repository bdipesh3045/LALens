/** Public-source facts and consistent disclaimer labels for LALens UI. */

export const statewideFacts = [
  {
    id: "mastery",
    label: "Grades 3–8 Mastery+",
    value: "35%",
    year: "2024–2025",
    source: "Louisiana Department of Education",
    sourceType: "Public source",
    interpretation:
      "A majority of students remain below Mastery+, which supports the need for targeted academic intervention."
  },
  {
    id: "graduation",
    label: "High school graduation rate",
    value: "83%+",
    year: "2022–2023",
    source: "Louisiana Department of Education",
    sourceType: "Public source",
    interpretation:
      "Graduation outcomes are improving, but pathway alignment still matters for workforce readiness."
  },
  {
    id: "performance",
    label: "Statewide performance score",
    value: "80.9",
    year: "2024–2025",
    source: "LDOE / BESE reporting",
    sourceType: "Public source",
    interpretation: "State performance is improving, but school-level and parish-level gaps remain uneven."
  },
  {
    id: "healthcare",
    label: "Healthcare workforce",
    value: "320K workers",
    year: "2025 report",
    source: "Louisiana Workforce Commission",
    sourceType: "Public source",
    interpretation: "Healthcare is a strong pathway-alignment opportunity for K-12 and postsecondary programs."
  }
];

export const dataDisclaimers = {
  official: "Public source",
  model: "Model estimate",
  demo: "Demo estimate",
  pending: "Data integration pending"
};

export const productNarrative = {
  problemTitle: "What problem does this solve?",
  problemLead:
    "Louisiana has education data, workforce data, demographic data, and school performance data, but those signals are scattered. LALens brings them into one decision workflow so funders and operators can see where a new program, school model, or career pathway could matter most.",
  workflowTitle: "LALens is not another data dashboard.",
  workflowLead:
    "It is a decision workflow. It helps users move from scattered public data to a ranked investment brief that explains the need, the opportunity, the risk, and the next action.",
  prototypeNote:
    "This prototype uses public-source facts and model estimates. Official parish-level scoring will update as LDOE, Census, NCES, BLS, and Louisiana Workforce Commission datasets are integrated."
};

export const problemMiniCards = [
  {
    title: "Fragmented data",
    body: "School performance, enrollment, poverty, and workforce projections live in different places."
  },
  {
    title: "Unclear priorities",
    body: "Leaders need to know which parishes and schools have the strongest case for support."
  },
  {
    title: "Actionable recommendations",
    body: "LALens turns the data into a ranked brief with evidence, risks, and suggested partners."
  }
];

export const scoreFactorHelp = {
  studentNeed:
    "Uses proficiency, graduation, absenteeism, and poverty indicators when connected. Current values are model estimates in the sample.",
  enrollmentPressure: "Uses enrollment change and population-shift signals from the sample dataset.",
  workforceGap: "Uses regional workforce-demand categories informed by LWC public reporting concepts.",
  pathwayAccess: "Uses available career pathways, dual enrollment, and partner access when connected.",
  feasibility: "Uses partner proximity, implementation capacity, and risk signals in the sample."
};

export const dataStatusRows = [
  { layer: "Louisiana parishes", status: "Mapped", usedFor: "Gap Map geography" },
  { layer: "LDOE performance / graduation", status: "Public-source reference", usedFor: "Student need context" },
  { layer: "LDOE enrollment", status: "Integration target", usedFor: "Enrollment pressure" },
  { layer: "Census ACS / QuickFacts", status: "Public-source reference", usedFor: "Poverty and demographics" },
  { layer: "LWC workforce projections", status: "Public-source reference", usedFor: "Workforce gap" },
  { layer: "NCES school geocodes", status: "Integration target", usedFor: "School map layer" },
  { layer: "Pathway inventory", status: "Future integration", usedFor: "Pathway access" }
];
