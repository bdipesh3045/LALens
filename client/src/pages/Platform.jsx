import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, GraduationCap } from "lucide-react";
import { getFilteredParishes } from "../utils/filters";
import {
  parishes as localParishes,
  priorityOrder,
  SAMPLE_METRIC_COUNT,
  TOTAL_LA_PARISH_COUNT,
  PENDING_PARISH_COUNT
} from "../data/parishes";
import GapMap from "../components/GapMap";
import ParishDashboard from "../components/ParishDashboard";
import InsightChat from "../components/InsightChat";
import BrandLogo from "../components/BrandLogo";
import PlatformKpiStrip from "../components/PlatformKpiStrip";
import ParishDetailPanel from "../components/ParishDetailPanel";
import PriorityInvestmentTable from "../components/PriorityInvestmentTable";
const initialFilters = { coverage: "All", priority: "All", region: "All", workforce: "All" };

function Platform() {
  const [parishes, setParishes] = useState([]);
  const [selectedParishId, setSelectedParishId] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const base = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${base}/api/parishes`);
        const data = await res.json();
        setParishes(data);
        const firstScored = data.find((p) => p.hasMetrics && typeof p.opportunityScore === "number");
        setSelectedParishId(firstScored?.id || data[0]?.id);
      } catch {
        setParishes(localParishes);
        const firstScored = localParishes.find((p) => p.hasMetrics && typeof p.opportunityScore === "number");
        setSelectedParishId(firstScored?.id || localParishes[0]?.id);
      }
    })();
  }, []);

  const filtered = useMemo(() => getFilteredParishes(parishes, filters, search), [parishes, filters, search]);
  const selectedParish = useMemo(() => parishes.find((p) => p.id === selectedParishId), [parishes, selectedParishId]);

  const top = useMemo(() => {
    const scored = (filtered.length ? filtered : parishes).filter(
      (p) => p.hasMetrics && typeof p.opportunityScore === "number"
    );
    return [...scored].sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 6);
  }, [filtered, parishes]);

  const regions = useMemo(() => [...new Set(parishes.map((p) => p.region))].sort(), [parishes]);
  const sectors = useMemo(
    () => [...new Set(parishes.filter((p) => p.hasMetrics).flatMap((p) => p.topWorkforceDemand || []))].sort(),
    [parishes]
  );

  return (
    <main className="container page-section platform-page">
      <section className="card platform-toolbar-card">
        <div className="section-head platform-section-head">
          <BrandLogo variant="nav" className="platform-section-logo" />
          <div>
            <p className="section-label">Platform</p>
            <div className="platform-title-row">
              <h2>Gap Map + Decision Dashboard + AI Insight Engine</h2>
              <div className="platform-coverage-badges" aria-label="Coverage summary">
                <span className="coverage-stat-badge coverage-stat-badge--mapped">
                  <span className="coverage-stat-badge__n">{TOTAL_LA_PARISH_COUNT}</span>
                  <span className="coverage-stat-badge__lbl">mapped</span>
                </span>
                <span className="coverage-stat-badge coverage-stat-badge--scored">
                  <span className="coverage-stat-badge__n">{SAMPLE_METRIC_COUNT}</span>
                  <span className="coverage-stat-badge__lbl">scored</span>
                </span>
                <span className="coverage-stat-badge coverage-stat-badge--pending">
                  <span className="coverage-stat-badge__n">{PENDING_PARISH_COUNT}</span>
                  <span className="coverage-stat-badge__lbl">pending</span>
                </span>
              </div>
            </div>
            <p className="tiny muted platform-subcopy">
              Map shows all {TOTAL_LA_PARISH_COUNT} Louisiana parishes. Scores currently use a {SAMPLE_METRIC_COUNT}-record sample model and can expand as official LDOE, Census, NCES, BLS, and LWC datasets are connected.
            </p>
          </div>
        </div>
        <div className="filter-row platform-filter-row">
          <div className="search-wrap">
            <Search size={15} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search any parish" />
          </div>
          <div className="search-wrap">
            <SlidersHorizontal size={15} />
            <span className="tiny">Filters</span>
          </div>
          <select value={filters.coverage} onChange={(e) => setFilters((f) => ({ ...f, coverage: e.target.value }))}>
            <option value="All">All parishes</option>
            <option value="sample">Sample metrics</option>
            <option value="pending">Data pending</option>
          </select>
          <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
            <option>All</option>
            {priorityOrder.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select value={filters.region} onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}>
            <option>All</option>
            {regions.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select value={filters.workforce} onChange={(e) => setFilters((f) => ({ ...f, workforce: e.target.value }))}>
            <option>All</option>
            {sectors.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <Link to="/invest" className="btn btn-primary platform-invest-cta">
            <GraduationCap size={16} aria-hidden />
            K-12 intake
          </Link>
        </div>
      </section>

      <PlatformKpiStrip />

      <section id="platform-map" className="platform-map-row">
        <GapMap
          parishes={filtered.length ? filtered : parishes}
          selectedParishId={selectedParishId}
          onSelectParish={setSelectedParishId}
        />
        <div className="platform-map-side">
          <ParishDetailPanel parish={selectedParish} />
          <aside className="card top-list platform-top-list">
            <p className="section-label">Top opportunities</p>
            <h3 className="top-list-title">By opportunity score</h3>
            <ul>
              {top.length === 0 ? (
                <li className="top-list-empty tiny muted">No scored parishes match filters.</li>
              ) : (
                top.map((p, index) => (
                  <li key={p.id}>
                    <button type="button" className={selectedParishId === p.id ? "active" : ""} onClick={() => setSelectedParishId(p.id)}>
                      <span className="rank">{index + 1}</span>
                      <span>
                        {p.name}
                        <small>{p.region}</small>
                      </span>
                      <span className="tiny">{p.opportunityScore}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>
        </div>
      </section>

      <PriorityInvestmentTable
        parishList={parishes}
        onSelectParish={(parishId) => {
          setSelectedParishId(parishId);
          document.getElementById("platform-map")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <ParishDashboard parish={selectedParish} />
      <InsightChat selectedParishId={selectedParishId} />
    </main>
  );
}

export default Platform;
