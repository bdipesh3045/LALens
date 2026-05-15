import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { parishes } from "../data/parishes";
import { createParishMarkerIcon } from "../utils/parishMarkers";
import LaMapBounds from "./LaMapBounds";

/** Compact interactive Louisiana preview for the home hero. */
function HomeHeroMap() {
  const [selectedId, setSelectedId] = useState("");

  return (
    <div className="home-hero-map">
      <MapContainer
        center={[31.1, -91.9]}
        zoom={7}
        minZoom={6}
        maxZoom={11}
        scrollWheelZoom
        dragging
        touchZoom
        doubleClickZoom
        className="home-hero-map-inner"
        aria-label="Louisiana parishes preview map"
      >
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LaMapBounds />
        {parishes.map((parish) => {
          const selected = selectedId === parish.id;
          return (
            <Marker
              key={parish.id}
              position={parish.coordinates}
              icon={createParishMarkerIcon(parish, selected)}
              eventHandlers={{
                click: () => setSelectedId(parish.id)
              }}
            >
              <Popup>
                <strong>{parish.name}</strong>
                <br />
                {parish.hasMetrics ? (
                  <span className="tiny">Sample metrics · score {parish.opportunityScore}</span>
                ) : (
                  <span className="tiny">On map · metrics pending</span>
                )}
                <br />
                <Link to="/platform">Open full platform</Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="home-hero-map-cap">
        <span className="home-hero-map-hint">Drag, zoom, and tap markers — 64 parishes</span>
        <Link to="/platform" className="home-hero-map-cta">
          Full map &amp; dashboard
        </Link>
      </div>
    </div>
  );
}

export default HomeHeroMap;
