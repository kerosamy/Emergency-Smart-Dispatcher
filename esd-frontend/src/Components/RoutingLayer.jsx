import { Polyline, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

export default function RoutingLayer({ vehicle, incident }) {
  const map = useMap();
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (!vehicle || !incident) return;

    const fetchRoute = async () => {
      const res = await fetch(
        `http://localhost:8080/api/route?startLat=${vehicle.lat}&startLng=${vehicle.lng}&endLat=${incident.lat}&endLng=${incident.lng}`
      );
      const data = await res.json();
      const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      console.log(coords);
      setPositions(coords);
    };

    fetchRoute();
  }, [vehicle, incident]);

  if (!positions.length) return null;

  return <Polyline positions={positions} pathOptions={{ color: "blue", weight: 4 }} />;
}
