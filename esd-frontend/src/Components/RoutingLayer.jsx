import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

export default function RoutingLayer({ vehicle, incident }) {
  const map = useMap();

  useEffect(() => {
    if (!vehicle || !incident) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(vehicle.lat, vehicle.lng),
        L.latLng(incident.lat, incident.lng),
      ],
      lineOptions: { styles: [{ color: "#3b82f6", weight: 4 }] }, // Sleeker blue
      createMarker: () => null,    // Don't show extra markers
      addWaypoints: false,         // Disable adding waypoints via UI
      show: false,                 // THIS REMOVES THE SIDE TABLE DIRECTIONS
      fitSelectedRoutes: false,    // Prevents the map from jumping constantly
    }).addTo(map);

    // Listen for when the route is calculated
    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      const points = routes[0].coordinates; 
      
      console.log(`Path for Vehicle ${vehicle.id}:`, points);
      
      // 'points' is an array of L.LatLng objects. 
      // You can send this back to a parent component via a callback prop 
      // if you need to store the coordinates in your state.
    });

    return () => {
      if (map) {
        routingControl.getPlan().setWaypoints([]); // Clean up waypoints
        map.removeControl(routingControl);
      }
    };
  }, [map, vehicle, incident]);

  return null;
}