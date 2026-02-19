import { Polyline, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

export default function RoutingLayer({ start, end }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    console.log("RoutingLayer received start and end:", start, end);
    if (!start || !end) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/route?startLat=${start.lat}&startLng=${start.lng}&endLat=${end.lat}&endLng=${end.lng}`
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
  }, [start, end]);

  if (!positions.length) return null;

  const startPoint = [start.lat, start.lng]; 
  const firstRoutePoint = positions[0]; 
  const lastRoutePoint = positions[positions.length - 1]; 
  const destinationPoint = [end.lat, end.lng]; 

  const connectorStyle = {
    color: "#A0A0A0",
    weight: 3,
    dashArray: "10, 10",
    opacity: 0.6
  };

  return (
    <>
      <Polyline positions={[startPoint, firstRoutePoint]} pathOptions={connectorStyle} />
      <Polyline 
        positions={positions} 
        pathOptions={{ color: "#00FFFF", weight: 4, opacity: 1, dashArray: null, lineJoin: "round" }} 
      />
      <Polyline positions={[lastRoutePoint, destinationPoint]} pathOptions={connectorStyle} />
    </>
  );
}
