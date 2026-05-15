import { Database, Building2, Landmark, BriefcaseBusiness, Globe, FileSpreadsheet, ClipboardList, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { dataSources } from "../data/sources";
import DataPipeline from "../components/DataPipeline";
import { SAMPLE_PARISH_COUNT, PROTOTYPE_COVERAGE_NOTE } from "../data/parishes";
import { dataStatusRows, productNarrative } from "../data/realityAnchors";
import SourceBadge from "../components/SourceBadge";

const icons = [Building2, Landmark, Globe, BriefcaseBusiness, Database, FileSpreadsheet, ClipboardList, Layers];

function DataSources() {
  return (
    <main className="container page-section">
      <section className="card">
        <p className="section-label">Data Sources</p>
        <h1>Integrated inputs for decision-ready intelligence</h1>
        <p style={{ marginTop: "0.75rem" }}>
          LALens is structured for LDOE, Census, NCES, BLS, and Louisiana Workforce Commission datasets. The live build combines public-source facts with model estimates in a 12-parish sample — it does not claim official statewide calculations until those sources are connected and validated.
        </p>
        <p className="tiny muted" style={{ marginTop: "0.5rem" }}>
          {PROTOTYPE_COVERAGE_NOTE} Rich metrics today: <strong>{SAMPLE_PARISH_COUNT}</strong> sample parishes; the map layer lists all <strong>64</strong> civil parishes.
        </p>
      </section>

      <section className="card">
        <p className="section-label">Current data status</p>
        <h3>What is connected vs planned</h3>
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

      <section className="card statewide-roadmap">
        <p className="section-label">Statewide coverage roadmap</p>
        <h3>Map vs scoring coverage</h3>
        <ul className="pipeline-steps-list">
          <li><strong>Map coverage:</strong> all 64 Louisiana parishes (approximate centroids for markers).</li>
          <li><strong>Current scoring coverage:</strong> {SAMPLE_PARISH_COUNT} sample parishes with model Opportunity Scores and dashboards.</li>
          <li><strong>Next step:</strong> connect official public datasets so every parish can receive validated metrics—not just geography.</li>
        </ul>
      </section>

      <section className="card">
        <p className="section-label">Why this is still valuable</p>
        <h3>{productNarrative.workflowTitle}</h3>
        <p>{productNarrative.workflowLead}</p>
        <p className="tiny muted" style={{ marginTop: "0.75rem" }}>{productNarrative.prototypeNote}</p>
        <p style={{ marginTop: "1rem" }}>
          <Link to="/methodology" className="btn btn-secondary btn-sm">See methodology</Link>
          {" "}
          <Link to="/platform" className="btn btn-primary btn-sm">Open decision preview</Link>
        </p>
      </section>

      <section className="source-grid">
        {dataSources.map((source, index) => {
          const Icon = icons[index % icons.length];
          return (
            <article key={source.name} className="card">
              <span className="icon-badge"><Icon size={14} /></span>
              <h3>{source.name}</h3>
              <p><strong>Contributes:</strong> {source.contributes}</p>
              <p><strong>Usage:</strong> {source.usage}</p>
              <span className="pill">{source.status}</span>
            </article>
          );
        })}
      </section>

      <section className="card">
        <p className="section-label">Pipeline</p>
        <h3>From raw sources to the live experience</h3>
        <ol className="pipeline-steps-list">
          <li><strong>Source datasets</strong> — LDOE, NCES, Census, LWC, BLS, and school finder extracts.</li>
          <li><strong>Cleaning and normalization</strong> — shared keys, units, and missing-data rules.</li>
          <li><strong>Parish-level joins</strong> — align education, workforce, and geography to parish boundaries.</li>
          <li><strong>Opportunity Score calculation</strong> — transparent weighted model (see Methodology).</li>
          <li><strong>Map, dashboard, and AI Insight Engine</strong> — exploration, evidence, and grounded Q&amp;A.</li>
        </ol>
        <DataPipeline />
      </section>
    </main>
  );
}

export default DataSources;
