# Normalized parish record (target schema)

Future pipeline output should be joinable to the app’s parish model. Field names below use snake_case for raw tables; the client may continue to use camelCase in JSON exports.

| Field | Type | Notes |
|-------|------|--------|
| `parish_id` | string | Stable slug, e.g. `east-baton-rouge` |
| `parish_name` | string | Display name |
| `student_need_score` | number 0–100 | Derived from LDOE + context |
| `enrollment_pressure_score` | number 0–100 | Enrollment trend / capacity signals |
| `workforce_gap_score` | number 0–100 | LWC / BLS aligned demand gap |
| `pathway_access_gap_score` | number 0–100 | Pathway availability vs demand |
| `feasibility_score` | number 0–100 | Partners, capacity, implementation readiness |
| `opportunity_score` | number 0–100 | Weighted blend (see app methodology) |
| `priority_level` | string | `Urgent` \| `High` \| `Moderate` \| `Low` from score bands |
| `proficiency_rate` | number | As published by source |
| `chronic_absenteeism_rate` | number | As published |
| `enrollment_change_percent` | number | Year-over-year or defined window |
| `graduation_rate` | number | As published |
| `poverty_rate` | number | Census or school-age poverty as defined |
| `top_workforce_demand` | string[] | Ranked sector labels |
| `recommended_intervention` | string | Model- or rules-generated narrative |
| `confidence` | string | Human-readable confidence label |
| `data_coverage_notes` | string | Gaps, imputations, and vintage |

## Opportunity Score (reference)

Default weights in the app: **35%** student need, **20%** enrollment pressure, **25%** workforce gap, **10%** pathway access gap, **10%** feasibility — applied to the five factor scores before priority bands.
