import {
  Database,
  Building2,
  Landmark,
  BriefcaseBusiness,
  Globe,
  FileSpreadsheet,
  ClipboardList,
  Layers,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { dataSources } from "../data/sources";
import DataPipeline from "../components/DataPipeline";
import { SAMPLE_PARISH_COUNT, PROTOTYPE_COVERAGE_NOTE, TOTAL_LA_PARISH_COUNT } from "../data/parishes";
import { dataStatusRows, productNarrative } from "../data/realityAnchors";
import SourceBadge from "../components/SourceBadge";

const icons = [Building2, Landmark, Globe, BriefcaseBusiness, Database, FileSpreadsheet, ClipboardList, Layers];

const PIPELINE = [
  { title: "Source datasets", body: "LDOE, NCES, Census, LWC, BLS, and school finder extracts." },
  { title: "Cleaning and normalization", body: "Shared keys, units, and missing-data rules." },
  { title: "Parish-level joins", body: "Align education, workforce, and geography to parish boundaries." },
  { title: "Opportunity Score calculation", body: "Transparent weighted model (see Methodology)." },
  { title: "Map, dashboard, and AI Insight Engine", body: "Exploration, evidence, and grounded Q&A." }
];

function DataSources() {
  return (
    <main className="app-page">
      <header className="card app-page-hero">
        <p className="app-page-kicker">Data sources</p>
        <h1>
          Integrated inputs for <span className="app-gradient-text">decision-ready</span> intelligence
        </h1>
        <p className="app-page-lead">
          LALens is structured for LDOE, Census, NCES, BLS, and Louisiana Workforce Commission datasets. The live build
          combines public-source facts with model estimates in a {SAMPLE_PARISH_COUNT}-parish sample. It does not claim
          official statewide calculations until those sources are connected and validated.
        </p>
        <p className="app-page-note">{PROTOTYPE_COVERAGE_NOTE}</p>
        <div className="app-page-hero-actions">
          <Link to="/platform" className="btn app-btn-gradient">
            Open platform <ArrowRight size={16} aria-hidden />
          </Link>
          <Link to="/methodology" className="btn btn-secondary">
            See methodology
          </Link>
        </div>
      </header>

      <section className="card app-status-card">
        <p className="app-page-kicker">Current data status</p>
        <h2 className="app-section-title">What is connected vs planned</h2>
        <div className="data-status-table-wrap">
          <table className="data-status-table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Status</th>
                <th>Used for</th>
              </tr>
            </thead>
            <tbody>
              {dataStatusRows.map((row) => (
                <tr key={row.layer}>
                  <td>{row.layer}</td>
                  <td>
                    <SourceBadge
                      type={
                        row.status.includes("Mapped")
                          ? "public"
                          : row.status.includes("reference")
                            ? "public"
                            : row.status.includes("target") || row.status.includes("Future")
                              ? "pending"
                              : "model"
                      }
                      label={row.status}
                    />
                  </td>
                  <td>{row.usedFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card app-roadmap-card">
        <p className="app-page-kicker">Coverage roadmap</p>
        <h2 className="app-section-title">Map vs scoring coverage</h2>
        <ul className="app-roadmap-list">
          <li>
            <strong>Map coverage:</strong> all {TOTAL_LA_PARISH_COUNT} Louisiana parishes (approximate centroids).
          </li>
          <li>
            <strong>Scoring coverage:</strong> {SAMPLE_PARISH_COUNT} sample parishes with model Opportunity Scores and
            dashboards.
          </li>
          <li>
            <strong>Next step:</strong> connect official public datasets so every parish can receive validated metrics,
            not just geography.
          </li>
        </ul>
      </section>

      <section className="card app-value-card">
        <p className="app-page-kicker">Why this is still valuable</p>
        <h2 className="app-section-title">{productNarrative.workflowTitle}</h2>
        <p>{productNarrative.workflowLead}</p>
        <p className="app-page-note">{productNarrative.prototypeNote}</p>
      </section>

      <section className="app-page-section">
        <p className="app-page-kicker">Source catalog</p>
        <h2 className="app-section-title">Datasets in the integration plan</h2>
        <ul className="app-source-grid">
          {dataSources.map((source, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li key={source.name} className="card app-source-card">
                <span className="app-source-icon" aria-hidden>
                  <Icon size={18} />
                </span>
                <h3>{source.name}</h3>
                <p>
                  <strong>Contributes:</strong> {source.contributes}
                </p>
                <p>
                  <strong>Usage:</strong> {source.usage}
                </p>
                <SourceBadge type="demo" label={source.status} />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card app-pipeline-card">
        <p className="app-page-kicker">Pipeline</p>
        <h2 className="app-section-title">From raw sources to the live experience</h2>
        <ol className="app-pipeline-detail-list">
          {PIPELINE.map((step, i) => (
            <li key={step.title}>
              <span className="app-pipeline-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </div>
            </li>
          ))}
        </ol>
        <DataPipeline />
      </section>
    </main>
  );
}

export default DataSources;
