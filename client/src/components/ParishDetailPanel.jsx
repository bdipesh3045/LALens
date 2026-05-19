import { useEffect, useState } from "react";
import { Users, TrendingUp, DollarSign, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getSchoolsByParishId } from "../data/schools";
import SourceBadge from "./SourceBadge";
import censusLocal from "../data/censusProfiles.json";

const censusLocalMap = Object.fromEntries(censusLocal.map((p) => [p.parishId, p]));

function useCensusProfile(parishId) {
  const [data, setData] = useState(() => (parishId ? censusLocalMap[parishId] ?? null : null));

  useEffect(() => {
    if (!parishId) return;
    // Immediately use the bundled data
    setData(censusLocalMap[parishId] ?? null);
    // Try to upgrade to live API data in the background
    let cancelled = false;
    const base = import.meta.env.VITE_API_URL || "";
    fetch(`${base}/api/public-data/parish/${parishId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d) setData(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [parishId]);

  return data;
}

function ParishDetailPanel({ parish, onClose }) {
  const census = useCensusProfile(parish?.id);

  if (!parish) {
    return (
      <aside className="parish-detail-panel parish-detail-panel--empty card">
        <p className="section-label">Detailed analysis</p>
        <p className="tiny muted">Select a parish on the map to view population, opportunity score, workforce demand, and institutions.</p>
      </aside>
    );
  }

  const schools = getSchoolsByParishId(parish.id);
  const educationGap = parish.hasMetrics ? Math.max(8, Math.round(100 - (parish.proficiencyRate || 40))) : null;
  const score = parish.hasMetrics ? parish.opportunityScore : null;

  const population = census?.population ?? null;
  const medianIncome = census?.medianHouseholdIncome ?? null;

  const needs = parish.hasMetrics
    ? [
        parish.recommendedIntervention,
        ...(parish.topWorkforceDemand || []).slice(0, 2).map((s) => `${s} workforce expansion`)
      ].filter(Boolean)
    : ["Connect LDOE enrollment and performance data", "Integrate workforce projections"];

  return (
    <aside className="parish-detail-panel card">
      <div className="parish-detail-head">
        <div>
          <p className="section-label">Detailed analysis</p>
          <h3>{parish.name.replace(" Parish", "")}</h3>
        </div>
        {onClose ? (
          <button type="button" className="parish-detail-close" onClick={onClose} aria-label="Close panel">
            ×
          </button>
        ) : null}
      </div>

      <div className="parish-detail-stats">
        <div className="parish-stat-tile">
          <Users size={16} aria-hidden />
          <span className="parish-stat-val">
            {population !== null ? population.toLocaleString() : "—"}
          </span>
          <span className="parish-stat-lbl">Population</span>
        </div>

        {parish.hasMetrics ? (
          <div className={`parish-stat-tile parish-stat-tile--score${score >= 85 ? " urgent" : score >= 70 ? " high" : ""}`}>
            <TrendingUp size={16} aria-hidden />
            <span className="parish-stat-val">{score}/100</span>
            <span className="parish-stat-lbl">Opportunity</span>
          </div>
        ) : (
          <div className="parish-stat-tile parish-stat-tile--muted">
            <TrendingUp size={16} aria-hidden />
            <span className="parish-stat-val">—</span>
            <span className="parish-stat-lbl">Opportunity</span>
          </div>
        )}

        <div className="parish-stat-tile">
          <DollarSign size={16} aria-hidden />
          <span className="parish-stat-val">
            {medianIncome !== null ? `$${medianIncome.toLocaleString()}` : "—"}
          </span>
          <span className="parish-stat-lbl">Median income</span>
        </div>

        {parish.hasMetrics ? (
          <div className="parish-stat-tile parish-stat-tile--warn">
            <BookOpen size={16} aria-hidden />
            <span className="parish-stat-val">{educationGap}%</span>
            <span className="parish-stat-lbl">Education gap</span>
          </div>
        ) : (
          <div className="parish-stat-tile parish-stat-tile--muted">
            <BookOpen size={16} aria-hidden />
            <span className="parish-stat-val">—</span>
            <span className="parish-stat-lbl">Education gap</span>
          </div>
        )}
      </div>

      {census ? (
        <p className="parish-census-attr tiny muted">
          Population and income from U.S. Census Bureau ACS 5-Year · 2023 <SourceBadge type="public" label="Public source" />
        </p>
      ) : null}

      {parish.hasMetrics ? (
        <>
          <div className="parish-detail-block">
            <p className="parish-detail-block-title">Specific needs</p>
            <ul className="parish-needs-list">
              {needs.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>

          <div className="parish-detail-block">
            <p className="parish-detail-block-title">Workforce demand</p>
            <div className="parish-tag-row">
              {(parish.topWorkforceDemand || []).map((s) => (
                <span key={s} className="parish-tag parish-tag--teal">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="parish-detail-block">
            <p className="parish-detail-block-title">Urgent programs</p>
            <div className="parish-tag-row">
              <span className="parish-tag parish-tag--red">Pathways</span>
              {(parish.topWorkforceDemand || []).slice(0, 2).map((s) => (
                <span key={s} className="parish-tag parish-tag--red">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {schools.length > 0 ? (
            <div className="parish-detail-block">
              <p className="parish-detail-block-title">Institutions in parish</p>
              {schools.slice(0, 2).map((s) => (
                <article key={s.id} className="parish-school-card">
                  <div>
                    <strong>{s.name}</strong>
                    <p className="tiny muted">
                      {s.type} · {s.enrollment.toLocaleString()} students
                    </p>
                  </div>
                  <span className="parish-school-funding">
                    {s.investmentRange} <SourceBadge type="demo" className="priority-est-badge" />
                  </span>
                </article>
              ))}
            </div>
          ) : null}

          <Link to="/invest" className="btn btn-primary parish-allocate-btn">
            <DollarSign size={16} aria-hidden />
            Investment intake
          </Link>
        </>
      ) : (
        <p className="tiny muted parish-detail-pending">
          Opportunity scores pending. Detailed scoring will appear when LDOE and NCES feeds are connected.
        </p>
      )}
    </aside>
  );
}

export default ParishDetailPanel;
