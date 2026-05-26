import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, GraduationCap } from "lucide-react";
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
  const [searchParams] = useSearchParams();
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
        const parishFromUrl = searchParams.get("parish");
        if (parishFromUrl && data.find((p) => p.id === parishFromUrl)) {
          setSelectedParishId(parishFromUrl);
        } else {
          const firstScored = data.find((p) => p.hasMetrics && typeof p.opportunityScore === "number");
          setSelectedParishId(firstScored?.id || data[0]?.id);
        }
      } catch {
        setParishes(localParishes);
        const parishFromUrl = searchParams.get("parish");
        if (parishFromUrl && localParishes.find((p) => p.id === parishFromUrl)) {
          setSelectedParishId(parishFromUrl);
        } else {
          const firstScored = localParishes.find((p) => p.hasMetrics && typeof p.opportunityScore === "number");
          setSelectedParishId(firstScored?.id || localParishes[0]?.id);
        }
      }
    })();
  }, [searchParams]);

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
    <main className="app-page platform-page">
      <header className="card platform-hero">
        <div className="platform-hero-top">
          <BrandLogo variant="nav" className="platform-section-logo" />
          <div>
            <p className="app-page-kicker">Platform</p>
            <h1>
              Gap map, <span className="app-gradient-text">dashboard</span>, and insight engine
            </h1>
            <p className="app-page-lead platform-hero-lead">
              Browse all {TOTAL_LA_PARISH_COUNT} Louisiana parishes with live Census data.
              Opportunity Scores use a {SAMPLE_METRIC_COUNT}-parish prototype and will expand as official datasets connect.
            </p>
          </div>
        </div>

        <ul className="platform-coverage-badges" aria-label="Coverage summary">
          <li className="coverage-stat-badge coverage-stat-badge--mapped">
            <span className="coverage-stat-badge__n">{TOTAL_LA_PARISH_COUNT}</span>
            <span className="coverage-stat-badge__lbl">mapped</span>
          </li>
          <li className="coverage-stat-badge coverage-stat-badge--scored">
            <span className="coverage-stat-badge__n">{SAMPLE_METRIC_COUNT}</span>
            <span className="coverage-stat-badge__lbl">scored</span>
          </li>
          <li className="coverage-stat-badge coverage-stat-badge--pending">
            <span className="coverage-stat-badge__n">{PENDING_PARISH_COUNT}</span>
            <span className="coverage-stat-badge__lbl">pending</span>
          </li>
        </ul>

        <div className="platform-filter-row">
          <div className="platform-search">
            <Search size={16} aria-hidden />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parishes" />
          </div>
          <select
            value={filters.coverage}
            onChange={(e) => setFilters((f) => ({ ...f, coverage: e.target.value }))}
            aria-label="Coverage filter"
          >
            <option value="All">All parishes</option>
            <option value="sample">Sample metrics</option>
            <option value="pending">Data pending</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
            aria-label="Priority filter"
          >
            <option>All</option>
            {priorityOrder.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            value={filters.region}
            onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
            aria-label="Region filter"
          >
            <option>All</option>
            {regions.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            value={filters.workforce}
            onChange={(e) => setFilters((f) => ({ ...f, workforce: e.target.value }))}
            aria-label="Workforce filter"
          >
            <option>All</option>
            {sectors.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <Link to="/invest" className="btn app-btn-gradient platform-invest-cta">
            <GraduationCap size={16} aria-hidden />
            Investment intake
          </Link>
        </div>
      </header>

      <PlatformKpiStrip />

      <section className="card platform-census-summary" aria-label="Public Census data layer summary">
        <div className="platform-census-summary-inner">
          <div className="platform-census-summary-head">
            <p className="app-page-kicker">Public Census layer</p>
            <h2 className="platform-census-summary-title">Real demographic data for all 64 parishes</h2>
          </div>
          <ul className="platform-census-summary-stats">
            <li>
              <span className="platform-census-stat-n">64</span>
              <span className="platform-census-stat-lbl">parish profiles</span>
            </li>
            <li>
              <span className="platform-census-stat-n">4</span>
              <span className="platform-census-stat-lbl">demographic fields</span>
            </li>
          </ul>
          <div className="platform-census-summary-meta">
            <span className="census-badge census-badge--public">Public source</span>
            <span className="census-badge census-badge--acs">Census ACS 5-Year</span>
            <span className="census-badge census-badge--live">Live API</span>
          </div>
          <p className="platform-census-summary-fields">
            Fields: population, median household income, poverty rate, no-vehicle households
          </p>
        </div>
      </section>

      <section id="platform-map" className="platform-workspace">
        <div className="platform-workspace-head">
          <p className="app-page-kicker">Gap map</p>
          <h2 className="app-section-title">Select a parish to explore</h2>
        </div>

        <div className="platform-map-row">
          <div className="platform-map-left">
            <GapMap
              parishes={filtered.length ? filtered : parishes}
              selectedParishId={selectedParishId}
              onSelectParish={setSelectedParishId}
            />

            <div className="card top-list platform-top-list">
              <p className="app-page-kicker">Top opportunities</p>
              <h3 className="top-list-title">By opportunity score</h3>
              <ul>
                {top.length === 0 ? (
                  <li className="top-list-empty">No scored parishes match your filters.</li>
                ) : (
                  top.map((p, index) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className={selectedParishId === p.id ? "active" : ""}
                        onClick={() => setSelectedParishId(p.id)}
                      >
                        <span className="rank">{index + 1}</span>
                        <span className="top-list-parish">
                          <span className="top-list-name">{p.name}</span>
                          <small className="top-list-region">{p.region}</small>
                        </span>
                        <span className="top-list-score">{p.opportunityScore}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <aside className="platform-sidebar">
            <ParishDetailPanel parish={selectedParish} />
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

      <section className="platform-lower-grid" aria-label="Parish dashboard and insight engine">
        <header className="platform-lower-head platform-lower-head--dash">
          <p className="app-page-kicker">Parish dashboard</p>
          <h2 className="app-section-title">Score breakdown and evidence</h2>
        </header>
        <header className="platform-lower-head platform-lower-head--chat">
          <p className="app-page-kicker">AI insight engine</p>
          <h2 className="app-section-title">Ask about this parish</h2>
        </header>

        <div className="platform-lower-block">
          <ParishDashboard parish={selectedParish} />
        </div>

        <div className="platform-lower-block platform-lower-block--chat">
          <InsightChat selectedParishId={selectedParishId} />
        </div>
      </section>
    </main>
  );
}

export default Platform;
