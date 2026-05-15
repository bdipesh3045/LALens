/**
 * Placeholder ingest script — does NOT download or scrape any data.
 *
 * TODO: Add real download steps (curl, agency API clients, or manual drop).
 * TODO: Parse LDOE / Census / NCES / LWC / BLS into staging tables.
 * TODO: Join to Louisiana parish boundaries and emit normalized rows.
 * TODO: Validate each row against the field list in schema.md
 * TODO: Export JSON to server/data or load into a database consumed by Express.
 *
 * Production should use a job runner, secrets management, and idempotent runs.
 *
 * Run: node data-pipeline/ingest_placeholder.js
 */

const REQUIRED_OUTPUT_FIELDS = [
  "parish_name",
  "student_need_score",
  "enrollment_pressure_score",
  "workforce_gap_score",
  "pathway_access_gap_score",
  "feasibility_score",
  "opportunity_score",
  "priority_level",
  "proficiency_rate",
  "chronic_absenteeism_rate",
  "enrollment_change_percent",
  "graduation_rate",
  "poverty_rate",
  "top_workforce_demand",
  "recommended_intervention",
  "confidence",
  "data_coverage_notes"
];

/** @param {Record<string, unknown>} row */
function validateParishRowShape(row) {
  const missing = REQUIRED_OUTPUT_FIELDS.filter((k) => row[k] === undefined || row[k] === null);
  return { ok: missing.length === 0, missing };
}

console.log("[data-pipeline] ingest_placeholder loaded. No I/O performed.");
console.log("[data-pipeline] Expected output fields:", REQUIRED_OUTPUT_FIELDS.join(", "));

module.exports = { validateParishRowShape, REQUIRED_OUTPUT_FIELDS };
