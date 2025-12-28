import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

export default function RoutingLayer({ vehicle, incident }) {
  const map = useMap();

  useEffect(() => {
    if (!vehicle || !incident) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(vehicle.lat, vehicle.lng),
        L.latLng(incident.lat, incident.lng),
      ],
      lineOptions: { styles: [{ color: "red", weight: 4 }] },
      createMarker: () => null,
      addWaypoints: false,
      routeWhileDragging: false,
    }).addTo(map);

    return () => control.remove(); // cleanup on unmount or change
  }, [map, vehicle, incident]);

  return null;
}
