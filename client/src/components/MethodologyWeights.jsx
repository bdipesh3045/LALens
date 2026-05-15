import { useMemo, useState } from "react";
import { parishes } from "../data/parishes";
import { computeOpportunityScore, DEFAULT_WEIGHTS, normalizeWeights } from "../utils/scoring";

const initialPercents = {
  studentNeed: 35,
  enrollmentPressure: 20,
  workforceGap: 25,
  pathwayAccessGap: 10,
  feasibility: 10
};

const SLIDER_LABELS = {
  studentNeed: "Student Need",
  enrollmentPressure: "Enrollment Pressure",
  workforceGap: "Workforce Gap",
  pathwayAccessGap: "Pathway Access Gap",
  feasibility: "Feasibility"
};

function percentsToWeightObject(p) {
  return {
    studentNeedScore: p.studentNeed,
    enrollmentPressureScore: p.enrollmentPressure,
    workforceGapScore: p.workforceGap,
    pathwayAccessGapScore: p.pathwayAccessGap,
    feasibilityScore: p.feasibility
  };
}

function MethodologyWeights() {
  const sampleParish = useMemo(() => parishes.find((x) => x.id === "claiborne") || parishes[0], []);
  const [percents, setPercents] = useState(initialPercents);
  const total = useMemo(() => Object.values(percents).reduce((s, x) => s + x, 0), [percents]);

  const factors = useMemo(
    () => ({
      studentNeedScore: sampleParish.studentNeedScore,
      enrollmentPressureScore: sampleParish.enrollmentPressureScore,
      workforceGapScore: sampleParish.workforceGapScore,
      pathwayAccessGapScore: sampleParish.pathwayAccessGapScore,
      feasibilityScore: sampleParish.feasibilityScore
    }),
    [sampleParish]
  );

  const defaultScore = useMemo(() => computeOpportunityScore(factors, DEFAULT_WEIGHTS), [factors]);
  const adjustedWeights = useMemo(() => normalizeWeights(percentsToWeightObject(percents)), [percents]);
  const adjustedScore = useMemo(() => computeOpportunityScore(factors, adjustedWeights), [factors, adjustedWeights]);

  return (
    <section className="card">
      <p className="section-label">Illustrative weighting demo</p>
      <h3>How weights change the score (sample parish)</h3>
      <p className="tiny muted" style={{ marginBottom: "0.75rem" }}>
        Example parish: <strong>{sampleParish.name}</strong>. Changing weights here illustrates how priorities affect rankings. The platform uses the default model unless custom weights are enabled. These sliders demonstrate model sensitivity; they do not change live parish rankings on the Platform page in this prototype.
      </p>
      <div className="weights-demo-scores">
        <p><span className="tiny">Default model score</span> <strong className="mono">{defaultScore}</strong></p>
        <p><span className="tiny">Adjusted score (normalized sliders)</span> <strong className="mono">{adjustedScore}</strong></p>
      </div>
      <div className="weights-grid">
        {Object.entries(percents).map(([key, val]) => (
          <label key={key}>
            <span className="tiny">{SLIDER_LABELS[key]}</span>
            <input
              type="range"
              min={1}
              max={60}
              value={val}
              onChange={(e) => setPercents((w) => ({ ...w, [key]: Number(e.target.value) }))}
            />
            <strong>{val}%</strong>
          </label>
        ))}
      </div>
      <p className="tiny">Total slider sum: {total}% (weights are normalized to 100% for the adjusted score)</p>
    </section>
  );
}

export default MethodologyWeights;
