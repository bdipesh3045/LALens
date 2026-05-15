import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function LaMapBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      [
        [28.82, -94.25],
        [33.05, -88.72]
      ],
      { padding: [28, 28] }
    );
  }, [map]);
  return null;
}
