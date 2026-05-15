import L from "leaflet";

export const SCORE_COLORS = { Low: "#22c55e", Moderate: "#0ea5e9", High: "#f97316", Urgent: "#f43f5e" };

/** Pending: large hit target, small muted dot. Scored: saturated color, white ring, stronger shadow. */
export function createParishMarkerIcon(parish, selected) {
  const pending = !parish.hasMetrics;
  if (pending) {
    const sel = selected ? " gap-map-marker--pending-selected" : "";
    return L.divIcon({
      className: `gap-map-marker gap-map-marker--pending${sel}`,
      html: '<span class="gap-map-dot-pending" aria-hidden="true"></span>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -12]
    });
  }
  const color = SCORE_COLORS[parish.priorityLevel] || "#64748b";
  const sel = selected ? " gap-map-marker--scored-selected" : "";
  return L.divIcon({
    className: `gap-map-marker gap-map-marker--scored${sel}`,
    html: `<span class="gap-map-dot-scored" style="background:${color};box-shadow:0 3px 14px rgba(0,0,0,0.22),0 0 0 2px ${color}66,0 0 20px ${color}44;"></span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -14]
  });
}
