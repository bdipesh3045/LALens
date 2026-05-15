import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  ENROLLMENT_TREND_INDEX,
  WORKFORCE_GAP_BY_SECTOR,
  INVESTMENT_FOCUS_MIX
} from "../data/stateMetrics";
import SourceBadge from "./SourceBadge";

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #e6e8f0",
  borderRadius: 12,
  fontSize: 12
};

function gapColor(pct) {
  if (pct >= 40) return "#ef4444";
  if (pct >= 30) return "#d97706";
  return "#14b8a6";
}

function PlatformAnalytics() {
  return (
    <section className="platform-analytics-grid">
      <article className="card platform-chart-card">
        <div className="platform-chart-head">
          <h3>Louisiana enrollment and graduation context</h3>
          <SourceBadge type="demo" />
        </div>
        <p className="tiny muted platform-chart-sub">
          Public data trend area; demo index visualization until LDOE enrollment files are connected in-product.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={ENROLLMENT_TREND_INDEX}>
            <CartesianGrid stroke="#e6e8f0" strokeDasharray="4 4" />
            <XAxis dataKey="year" stroke="#697089" fontSize={11} />
            <YAxis stroke="#697089" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line type="monotone" dataKey="enrollmentIndex" name="Enrollment index" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="graduationContext" name="Graduation context" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </article>

      <article className="card platform-chart-card">
        <div className="platform-chart-head">
          <h3>Workforce opportunity by sector</h3>
          <SourceBadge type="model" label="LWC-informed model estimate" />
        </div>
        <p className="tiny muted platform-chart-sub">
          Louisiana workforce-demand categories including healthcare, trades, manufacturing, technology, and education pathways.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={WORKFORCE_GAP_BY_SECTOR} layout="vertical" margin={{ left: 8, right: 12 }}>
            <CartesianGrid stroke="#e6e8f0" strokeDasharray="4 4" horizontal={false} />
            <XAxis type="number" domain={[0, 60]} unit="%" stroke="#697089" fontSize={11} />
            <YAxis type="category" dataKey="sector" width={120} stroke="#697089" fontSize={10} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Gap index"]} />
            <Bar dataKey="gap" radius={[0, 6, 6, 0]}>
              {WORKFORCE_GAP_BY_SECTOR.map((entry) => (
                <Cell key={entry.sector} fill={gapColor(entry.gap)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="platform-chart-legend-row">
          <span><i className="legend-dot critical" /> Critical 40%+</span>
          <span><i className="legend-dot warning" /> Warning 30–39%</span>
          <span><i className="legend-dot moderate" /> Moderate &lt;30%</span>
        </div>
      </article>

      <article className="card platform-chart-card platform-chart-card--donut">
        <div className="platform-chart-head">
          <h3>Investment focus mix</h3>
          <SourceBadge type="demo" />
        </div>
        <p className="tiny muted platform-chart-sub">Example allocation categories for education-investment planning (demo estimate).</p>
        <div className="platform-donut-wrap">
          <ResponsiveContainer width="100%" height={168}>
            <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <Pie
                data={INVESTMENT_FOCUS_MIX}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={68}
                paddingAngle={2}
              >
                {INVESTMENT_FOCUS_MIX.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Demo share"]} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="platform-funding-legend" aria-label="Investment focus categories">
            {INVESTMENT_FOCUS_MIX.map((entry) => (
              <li key={entry.name}>
                <span className="platform-funding-legend-dot" style={{ background: entry.color }} aria-hidden />
                <span className="platform-funding-legend-name">{entry.name}</span>
                <span className="platform-funding-legend-val">{entry.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}

export default PlatformAnalytics;
