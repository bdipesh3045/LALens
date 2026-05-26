import { BarChart3, MapPinned, BriefcaseBusiness, Sparkles } from "lucide-react";

function HomePlanningCard() {
  return (
    <article className="home-planning-card">
      <span className="home-planning-deco" aria-hidden>01</span>
      <div className="home-planning-badge">
        <Sparkles size={20} strokeWidth={1.75} />
      </div>
      <h2 className="home-planning-title">Find the next high-impact education investment</h2>
      <p className="home-planning-sub">A decision workflow for funders, school operators, and policy leaders.</p>
      <div className="home-planning-minis">
        <div className="home-planning-mini">
          <BarChart3 size={16} />
          <span>Opportunity Score</span>
        </div>
        <div className="home-planning-mini">
          <MapPinned size={16} />
          <span>Gap Map</span>
        </div>
        <div className="home-planning-mini">
          <BriefcaseBusiness size={16} />
          <span>Workforce Alignment</span>
        </div>
      </div>
      <hr className="home-planning-divider" />
      <p className="home-planning-out">
        <strong>Output:</strong> A ranked parish brief with evidence, risks, and suggested partners.
        Built for discussion, not official allocation.
      </p>
    </article>
  );
}

export default HomePlanningCard;
