import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import VehicleService from "../services/VehicleService";
import StationService from "../services/StationService";
import IncidentService from "../services/IncidentService";
import RoutingLayer from "../Components/RoutingLayer.jsx";

// LOCAL ICONS
import carIconUrl from "../assets/police-car.png";
import fireIconUrl from "../assets/incident.png";
import stationIconUrl from "../assets/fire-station.png";

// Create icons
const createLocalIcon = (url) =>
  L.icon({
    iconUrl: url,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

const ICONS = {
  vehicle: createLocalIcon(carIconUrl),
  incident: createLocalIcon(fireIconUrl),
  station: createLocalIcon(stationIconUrl),
};

export default function MapView() {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [assignments, setAssignments] = useState([]); // vehicleId → incidentId

  // ---------------------------------------------------
  // Load all required data
  // ---------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        // Vehicles
        const vehData = await VehicleService.getAllVehicles();
        const validVehicles = vehData
          .map((v) => ({
            id: v.id,
            name: v.vehicleType || `Vehicle ${v.id}`,
            lat: parseFloat(v.stationLatitude),
            lng: parseFloat(v.stationLongitude)+0.002,
          }))
          .filter((v) => !isNaN(v.lat) && !isNaN(v.lng));
        setVehicles(validVehicles);

        // Stations
        const stationData = await StationService.getAllStations();
        const validStations = stationData
          .map((s) => ({
            id: s.id,
            name: s.name,
            lat: parseFloat(s.latitude),
            lng: parseFloat(s.longitude),
          }))
          .filter((s) => !isNaN(s.lat) && !isNaN(s.lng));
        setStations(validStations);

        // Incidents
        const incidentData = await IncidentService.getAllIncidents();
        const validIncidents = incidentData
          .map((i) => ({
            id: i.id,
            name: i.name || `Incident ${i.id}`,
            lat: parseFloat(i.latitude),
            lng: parseFloat(i.longitude),
            severity: i.severity || "Unknown",
          }))
          .filter((i) => !isNaN(i.lat) && !isNaN(i.lng));
        setIncidents(validIncidents);

        // Assignments (from API)
        const assignmentData = await IncidentService.getAssignments();
        setAssignments(assignmentData); // contains vehicleId + incidentId

      } catch (err) {
        console.error("Error loading map data:", err);
      }
    };

    loadData();
  }, []);

  // ---------------------------------------------------
  // Render
  // ---------------------------------------------------
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r-2 border-red-600 bg-[#191919] p-3">
        <ListGroup title="Vehicles" items={vehicles} />
        <ListGroup title="Incidents" items={incidents} />
        <ListGroup title="Stations" items={stations} />
      </div>

        <MapContainer
          center={[31, 31]}
          zoom={14}
          className="h-full w-full bg-gray-950 outline-none"
          zoomControl={false}
          key="main-map" // fixed key
        >
        <TileLayer
          attribution="&copy; Stadia Maps"
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />

        {/* Vehicles */}
        {vehicles.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={ICONS.vehicle}>
            <Popup>{v.name}</Popup>
          </Marker>
        ))}

        {/* Stations */}
        {stations.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={ICONS.station}>
            <Popup>{s.name}</Popup>
          </Marker>
        ))}

        {/* Incidents */}
        {incidents.map((i) => (
          <Marker key={i.id} position={[i.lat, i.lng]} icon={ICONS.incident}>
            <Popup>{i.name}</Popup>
          </Marker>
        ))}

        {/* ---------------------------------------------------
            ROUTES BASED ON API ASSIGNMENTS
           --------------------------------------------------- */}
        {assignments.map((a, index) => {
          const vehicle = vehicles.find((v) => v.id === a.vehicleId);
          const incident = incidents.find((i) => i.id === a.incidentId);

          if (!vehicle || !incident) return null;

          return (
            <RoutingLayer
              key={`route-${a.vehicleId}-${a.incidentId}-${index}`}
              vehicle={vehicle}
              incident={incident}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

// ---------------------------------------------------
// Sidebar list
// ---------------------------------------------------
function ListGroup({ title, items }) {
  return (
    <div>
      <h2 className="text-xs font-bold text-red-400 uppercase mb-2">
        {title}
      </h2>
      {items.map((item) => (
        <div
          key={`${item.id}`}
          className="mb-2 p-2 bg-black/50 text-red-300 rounded"
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

