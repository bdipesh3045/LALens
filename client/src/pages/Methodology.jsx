import { CheckCircle2 } from "lucide-react";
import MethodologyWeights from "../components/MethodologyWeights";

function Methodology() {
  return (
    <main className="container page-section">
      <section className="card">
        <p className="section-label">Methodology</p>
        <h1>How the Opportunity Score Works</h1>
        <p>The score is a transparent multi-factor decision-support model. It does not replace human judgment and it does not claim exact causal impact.</p>
        <p style={{ marginTop: "0.75rem" }}>
          The map layer includes <strong>all 64 Louisiana parishes</strong> for geography and navigation. The live prototype currently attaches detailed illustrative metrics to <strong>12 sample parishes</strong> so stakeholders can experience the full workflow. Scores on the Platform for those parishes are computed from the published factor weights and those sample values—not from official statewide LDOE or workforce releases. Validated inputs for every parish are part of the integration roadmap (LDOE, Census, NCES, BLS, Louisiana Workforce Commission).
        </p>
      </section>

      <section className="card formula-card">
        <h2>Opportunity Score Formula</h2>
        <p className="mono formula-text">35% Student Need + 20% Enrollment Pressure + 25% Workforce Gap + 10% Pathway Access Gap + 10% Feasibility</p>
      </section>

      <section className="feature-row">
        <article className="card"><h3>Student Need</h3><p>Academic proficiency, graduation, absenteeism, socioeconomic context.</p></article>
        <article className="card"><h3>Enrollment Pressure</h3><p>Enrollment growth or decline and stress on school models.</p></article>
        <article className="card"><h3>Workforce Gap</h3><p>Projected regional demand and pathway-to-opportunity alignment.</p></article>
        <article className="card"><h3>Pathway Access</h3><p>Availability of pathways tied to high-demand occupations.</p></article>
        <article className="card"><h3>Feasibility</h3><p>Partner capacity, employer links, implementation readiness.</p></article>
      </section>

      <section className="card">
        <p className="section-label">Model Pipeline</p>
        <div className="stepper">
          <span>Data Input</span><span>Normalization</span><span>Weighted Score</span><span>Recommendation</span><span>Human Review</span>
        </div>
      </section>

      <MethodologyWeights />

      <section className="card">
        <p className="section-label">Trust and Transparency</p>
        <ul className="trust-list">
          <li><CheckCircle2 size={14} /> Transparent inputs</li>
          <li><CheckCircle2 size={14} /> Adjustable weights</li>
          <li><CheckCircle2 size={14} /> Sensitivity analysis ready</li>
          <li><CheckCircle2 size={14} /> Evidence and limitations included</li>
        </ul>
      </section>
    </main>
  );
}

export default Methodology;
