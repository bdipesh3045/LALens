import { Database, Wrench, Layers, ChartColumnBig, Bot } from "lucide-react";

const steps = [
  { icon: Database, label: "Source datasets" },
  { icon: Wrench, label: "Cleaning and normalization" },
  { icon: Layers, label: "Parish-level joins" },
  { icon: ChartColumnBig, label: "Opportunity Score calculation" },
  { icon: Bot, label: "Map, dashboard, and AI Insight Engine" }
];

function DataPipeline() {
  return (
    <div className="pipeline pipeline-spaced">
      {steps.map(({ icon: Icon, label }) => (
        <article key={label} className="card pipeline-node">
          <span className="icon-badge"><Icon size={14} /></span>
          <p>{label}</p>
        </article>
      ))}
    </div>
  );
}

export default DataPipeline;
