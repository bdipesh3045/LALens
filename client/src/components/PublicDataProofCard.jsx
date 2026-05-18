import { useEffect, useState } from "react";
import { Users, DollarSign, TrendingDown, Car, Database, AlertCircle } from "lucide-react";

function StatRow({ icon: Icon, label, value, sub }) {
  return (
    <div className="census-stat-row">
      <span className="census-stat-icon" aria-hidden>
        <Icon size={14} />
      </span>
      <span className="census-stat-label">{label}</span>
      <span className="census-stat-value">
        {value}
        {sub ? <small className="census-stat-sub">{sub}</small> : null}
      </span>
    </div>
  );
}

function PublicDataProofCard({ parishId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!parishId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setProfile(null);

    const base = import.meta.env.VITE_API_URL || "";
    fetch(`${base}/api/public-data/parish/${parishId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [parishId]);

  if (!parishId) return null;

  if (loading) {
    return (
      <aside className="card census-proof-card census-proof-card--loading" aria-live="polite">
        <p className="census-proof-loading-text">Loading Census profile…</p>
      </aside>
    );
  }

  if (error || !profile) {
    return (
      <aside className="card census-proof-card census-proof-card--error" aria-live="polite">
        <div className="census-proof-error-row">
          <AlertCircle size={15} className="census-proof-error-icon" aria-hidden />
          <p className="census-proof-error-text">Public Census profile is temporarily unavailable.</p>
        </div>
      </aside>
    );
  }

  const incomeDisplay =
    profile.medianHouseholdIncome > 0
      ? `$${profile.medianHouseholdIncome.toLocaleString()}`
      : "N/A";

  const populationDisplay =
    profile.population > 0 ? profile.population.toLocaleString() : "N/A";

  const isFallback = profile.dataStatus?.toLowerCase().includes("fallback");

  return (
    <aside className="card census-proof-card" aria-label="Public Census data profile">
      <header className="census-proof-header">
        <div className="census-proof-title-row">
          <Database size={15} className="census-proof-icon" aria-hidden />
          <p className="census-proof-title">Public Census layer</p>
        </div>
        <div className="census-proof-badges">
          <span className="census-badge census-badge--public">Public source</span>
          <span className="census-badge census-badge--acs">Census ACS 5-Year</span>
          <span className="census-badge census-badge--year">{profile.sourceYear}</span>
          {isFallback ? (
            <span className="census-badge census-badge--fallback">Cached</span>
          ) : (
            <span className="census-badge census-badge--live">Live API</span>
          )}
        </div>
      </header>

      <p className="census-proof-parish-name">{profile.parishName}</p>

      <div className="census-proof-stats">
        <StatRow
          icon={Users}
          label="Population"
          value={populationDisplay}
        />
        <StatRow
          icon={DollarSign}
          label="Median household income"
          value={incomeDisplay}
        />
        <StatRow
          icon={TrendingDown}
          label="Poverty rate"
          value={`${profile.povertyRate}%`}
          sub="of population"
        />
        <StatRow
          icon={Car}
          label="No-vehicle households"
          value={`${profile.noVehicleHouseholdRate}%`}
          sub="of households"
        />
      </div>

      <p className="census-proof-note">
        These demographic indicators are pulled from the public Census API. Opportunity Scores remain
        prototype model estimates until official education and workforce datasets are fully integrated.
      </p>

      <p className="census-proof-source">
        Source: {profile.source} · {profile.sourceYear}
      </p>
    </aside>
  );
}

export default PublicDataProofCard;
