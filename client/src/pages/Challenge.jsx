import { GraduationCap, BriefcaseBusiness, Building2, MapPinned, Network } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";

function Challenge() {
  return (
    <main className="container page-section">
      <section className="card">
        <div className="challenge-hero-head">
          <BrandLogo variant="hero" />
          <div>
            <p className="section-label">DevDays Challenge</p>
            <h1>LALens</h1>
          </div>
        </div>
        <p>Louisiana’s education landscape is shifting. Student needs are changing. Workforce demand is evolving. Decision-makers need a unified picture of where to invest, what to build, and why.</p>
      </section>

      <section className="feature-row">
        <article className="card"><h3>Fragmented Data</h3><p>Education and workforce data exist across disconnected systems.</p></article>
        <article className="card"><h3>Student Need</h3><p>Outcomes and access gaps vary significantly by parish.</p></article>
        <article className="card"><h3>Workforce Alignment</h3><p>Pathways must map to local demand, not generic assumptions.</p></article>
        <article className="card"><h3>Pathway Access</h3><p>Opportunity depends on equitable access to quality programs.</p></article>
        <article className="card"><h3>Decision Bottlenecks</h3><p>Leaders need comparable evidence across regions.</p></article>
      </section>

      <section className="feature-row">
        <article className="card"><span className="icon-badge"><BriefcaseBusiness size={14} /></span><h3>Funders</h3><p>Prioritize investment opportunities.</p></article>
        <article className="card"><span className="icon-badge"><Building2 size={14} /></span><h3>School Operators</h3><p>Identify expansion opportunities.</p></article>
        <article className="card"><span className="icon-badge"><MapPinned size={14} /></span><h3>Policymakers</h3><p>Understand regional opportunity gaps.</p></article>
        <article className="card"><span className="icon-badge"><Network size={14} /></span><h3>Workforce Partners</h3><p>Align pathways with local demand.</p></article>
        <article className="card"><span className="icon-badge"><GraduationCap size={14} /></span><h3>Communities</h3><p>Advocate for better student pathways.</p></article>
      </section>

      <section className="card wide-note">
        <h3>Ready to explore the live prototype?</h3>
        <Link className="btn btn-primary" to="/platform">Explore the Platform</Link>
      </section>
    </main>
  );
}

export default Challenge;
