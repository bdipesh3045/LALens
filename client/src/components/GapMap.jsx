import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LocateFixed } from "lucide-react";
import { SAMPLE_METRIC_COUNT, TOTAL_LA_PARISH_COUNT } from "../data/parishes";
import { SCORE_COLORS, createParishMarkerIcon } from "../utils/parishMarkers";
import LaMapBounds from "./LaMapBounds";

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
              icon={createParishMarkerIcon(parish, selected)}
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
