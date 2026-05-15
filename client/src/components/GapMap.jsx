import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { SAMPLE_METRIC_COUNT, TOTAL_LA_PARISH_COUNT } from "../data/parishes";

const SCORE_COLORS = { Low: "#22c55e", Moderate: "#0ea5e9", High: "#f97316", Urgent: "#f43f5e" };

/** Pending: large hit target, small muted dot. Scored: saturated color, white ring, stronger shadow. */
function markerIcon(parish, selected) {
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

function LaMapBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      [
        [28.82, -94.25],
        [33.05, -88.72]
      ],
      { padding: [32, 32] }
    );
  }, [map]);
  return null;
}

function GapMap({ parishes, selectedParishId, onSelectParish }) {
  return (
    <section className="card map-card">
      <div className="section-head">
        <div>
          <p className="section-label">Gap Map</p>
          <h3>Opportunity zones by parish</h3>
          <p className="tiny muted" style={{ marginTop: "0.35rem" }}>
            Map shows all 64 Louisiana parishes. Opportunity scores are currently available for 12 sample parishes in this prototype.
          </p>
        </div>
        <span className="tiny muted">
          <LocateFixed size={12} /> Select a marker
        </span>
      </div>
      <div className="map-legend-wrap" role="group" aria-label="Map legend">
        <div className="map-legend-block">
          <p className="map-legend-heading">Opportunity score ({SAMPLE_METRIC_COUNT} sample parishes)</p>
          <p className="map-legend-hint tiny muted">Priority colors apply only where prototype metrics exist.</p>
          <div className="map-legend map-legend-scored">
            {Object.entries(SCORE_COLORS).map(([label, color]) => (
              <span key={label} className="tiny map-legend-chip">
                <i style={{ backgroundColor: color }} /> {label}
              </span>
            ))}
          </div>
        </div>
        <div className="map-legend-block map-legend-block--muted">
          <p className="map-legend-heading">Map coverage (all {TOTAL_LA_PARISH_COUNT} parishes)</p>
          <p className="map-legend-hint tiny muted">Muted dots are on the map for geography; scores are not shown until data is integrated.</p>
          <div className="map-legend">
            <span className="tiny map-legend-chip">
              <i className="map-legend-dot-pending" /> Parish on map, metrics pending
            </span>
          </div>
        </div>
      </div>
      <MapContainer center={[31.1, -91.9]} zoom={7} scrollWheelZoom className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LaMapBounds />
        {parishes.map((parish) => {
          const selected = selectedParishId === parish.id;
          return (
            <Marker
              key={parish.id}
              position={parish.coordinates}
              icon={markerIcon(parish, selected)}
              eventHandlers={{ click: () => onSelectParish(parish.id) }}
            >
              <Popup>
                <strong>{parish.name}</strong>
                <br />
                {parish.hasMetrics ? (
                  <>
                    <span className="popup-coverage popup-coverage--sample">Sample metrics</span>
                    <br />
                    Priority: {parish.priorityLevel}
                    <br />
                    Opportunity Score: {parish.opportunityScore}
                  </>
                ) : (
                  <>
                    <span className="popup-coverage popup-coverage--pending">On map, metrics pending</span>
                    <br />
                    No Opportunity Score in this prototype until sources are connected.
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </section>
  );
}

export default GapMap;
