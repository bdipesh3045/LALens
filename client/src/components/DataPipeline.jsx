import { Database, Wrench, Layers, ChartColumnBig } from "lucide-react";
import BrandLogo from "./BrandLogo";

const steps = [
  { icon: Database, label: "Source datasets" },
  { icon: Wrench, label: "Cleaning and normalization" },
  { icon: Layers, label: "Parish-level joins" },
  { icon: ChartColumnBig, label: "Opportunity Score calculation" },
  { label: "Map, dashboard, and AI Insight Engine", logo: true }
];

function DataPipeline() {
  return (
    <div className="pipeline pipeline-spaced">
      {steps.map((step) => (
        <article key={step.label} className="card pipeline-node">
          <span className="icon-badge">
            {step.logo ? <BrandLogo variant="badge" alt="" /> : <step.icon size={14} />}
          </span>
          <p>{step.label}</p>
        </article>
      ))}
    </div>
  );
}

export default DataPipeline;
