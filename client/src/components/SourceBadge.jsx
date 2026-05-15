import { dataDisclaimers } from "../data/realityAnchors";

const STYLES = {
  public: "source-badge source-badge--public",
  model: "source-badge source-badge--model",
  demo: "source-badge source-badge--demo",
  pending: "source-badge source-badge--pending"
};

const DEFAULT_LABELS = {
  public: dataDisclaimers.official,
  model: dataDisclaimers.model,
  demo: dataDisclaimers.demo,
  pending: dataDisclaimers.pending
};

function SourceBadge({ type = "model", label, className = "" }) {
  const text = label || DEFAULT_LABELS[type] || DEFAULT_LABELS.model;
  return (
    <span className={`${STYLES[type] || STYLES.model} ${className}`.trim()} title={text}>
      {text}
    </span>
  );
}

export default SourceBadge;
