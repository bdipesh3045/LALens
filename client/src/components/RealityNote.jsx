import { productNarrative } from "../data/realityAnchors";

function RealityNote({ compact = false, className = "" }) {
  return (
    <p className={`reality-note${compact ? " reality-note--compact" : ""} ${className}`.trim()} role="note">
      {productNarrative.prototypeNote}
    </p>
  );
}

export default RealityNote;
