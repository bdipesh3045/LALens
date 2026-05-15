import { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { rankParishesForInvestment } from "../utils/parishPriority";
import SourceBadge from "./SourceBadge";
import RealityNote from "./RealityNote";

function PriorityInvestmentTable({ parishList, onSelectParish, limit = 8 }) {
  const ranked = useMemo(() => rankParishesForInvestment(parishList).slice(0, limit), [parishList, limit]);

  return (
    <section className="card priority-table-card">
      <div className="priority-table-head">
        <div>
          <div className="priority-table-title-row">
            <h3>Priority investment analysis</h3>
            <SourceBadge type="model" />
          </div>
          <p className="tiny muted">
            Parish-level ranking from the sample Opportunity Score model. School-level sample matches appear in investment intake results.
          </p>
        </div>
        <a href="#platform-map" className="btn app-btn-gradient btn-sm priority-view-all">
          View map <ExternalLink size={14} aria-hidden />
        </a>
      </div>
      <div className="priority-table-scroll">
        <table className="priority-table">
          <thead>
            <tr>
              <th>Parish</th>
              <th>Region</th>
              <th>Need signal</th>
              <th>Pathway fit</th>
              <th>Match score</th>
              <th>Investment estimate</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((row, i) => (
              <tr
                key={row.id}
                className={onSelectParish ? "priority-row-click" : ""}
                onClick={() => onSelectParish?.(row.id)}
              >
                <td>
                  <div className="priority-inst-cell">
                    {i < 3 ? <span className={`priority-rank priority-rank--${i + 1}`}>{i + 1}</span> : null}
                    <strong>{row.name}</strong>
                  </div>
                </td>
                <td>{row.region}</td>
                <td>{row.needSignal}</td>
                <td className="priority-pathway-cell">{row.pathwayFit}</td>
                <td className="priority-score-cell">{row.matchScore}</td>
                <td className="priority-est-cell">
                  <span className="priority-estimate">{row.investmentEstimate}</span>
                  <SourceBadge type="demo" label="Demo estimate" className="priority-est-badge" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="priority-insight-box">
        <strong>Key insight:</strong> In the current sample, Claiborne, St. Landry, and Rapides combine high student-need and workforce-gap signals with pathway access constraints. This is a model estimate, not an official state allocation ranking.
      </div>
      <RealityNote compact />
    </section>
  );
}

export default PriorityInvestmentTable;
