import { Polyline, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

export default function RoutingLayer({ vehicle, incident }) {
  const map = useMap();
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (!vehicle || !incident) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/route?startLat=${vehicle.lat}&startLng=${vehicle.lng}&endLat=${incident.lat}&endLng=${incident.lng}`
        );
        const data = await res.json();
        
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setPositions(coords);
        }
      } catch (err) {
        console.error("Routing error:", err);
      }
    };

    fetchRoute();
  }, [vehicle, incident]);

  if (!positions.length) return null;

  // Key Coordinates
  const startPoint = [vehicle.lat, vehicle.lng]; 
  const firstRoutePoint = positions[0]; 
  const lastRoutePoint = positions[positions.length - 1]; 
  const destinationPoint = [incident.lat, incident.lng]; 

  // Style for the "Off-Road" connectors
  const connectorStyle = {
    color: "#A0A0A0", // Light Grey
    weight: 3,
    dashArray: "10, 10", // Explicitly dashed
    opacity: 0.6
  };

  return (
    <>
      {/* 1. START CONNECTOR (Vehicle to Road) */}
      <Polyline
        positions={[startPoint, firstRoutePoint]}
        pathOptions={connectorStyle}
      />

      {/* 2. MAIN VIBRANT ROUTE (Solid Cyan) */}
      <Polyline 
        positions={positions} 
        pathOptions={{ 
          color: "#00FFFF", // Vibrant Cyan
          weight: 4,        // Slightly thicker for importance
          opacity: 1,
          dashArray: null,  // FORCE SOLID LINE
          lineJoin: "round"
        }} 
      />

      {/* 3. END CONNECTOR (Road to Incident) */}
      <Polyline
        positions={[lastRoutePoint, destinationPoint]}
        pathOptions={connectorStyle}
      />
    </>
  );
}