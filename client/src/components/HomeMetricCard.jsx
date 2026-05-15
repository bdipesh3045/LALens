function HomeMetricCard({ icon: Icon, value, label, hint, accent }) {
  return (
    <article className={`home-metric-card ${accent || ""}`}>
      {Icon ? (
        <span className="home-metric-icon">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      ) : null}
      <span className="home-metric-value">{value}</span>
      <span className="home-metric-label">{label}</span>
      {hint ? <span className="home-metric-hint">{hint}</span> : null}
    </article>
  );
}

export default HomeMetricCard;
