import { Info } from "lucide-react";
import { productNarrative } from "../data/realityAnchors";

function RealityNote({ compact = false, className = "" }) {
  return (
    <div className={`reality-note${compact ? " reality-note--compact" : ""} ${className}`.trim()} role="note">
      <span className="reality-note-icon">
        <Info size={18} strokeWidth={1.75} />
      </span>
      <div className="reality-note-content">
        <span className="reality-note-title">Data note</span>
        <span className="reality-note-text">{productNarrative.prototypeNote}</span>
      </div>
    </div>
  );
}

export default RealityNote;
