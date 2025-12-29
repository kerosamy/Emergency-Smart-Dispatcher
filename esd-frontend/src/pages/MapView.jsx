import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import VehicleService from "../services/VehicleService";
import StationService from "../services/StationService";
import IncidentService from "../services/IncidentService";
import RoutingLayer from "../Components/RoutingLayer.jsx";

// ---------------------------------------------------
// ICON IMPORTS
// ---------------------------------------------------
import policeCar from "../assets/police-car.png";
import fireTruck from "../assets/fire-truck.png";
import ambulance from "../assets/ambulance.png";

import policeStation from "../assets/police-station.png";
import fireStation from "../assets/fire-station.png";
import hospital from "../assets/hospital.png";

import incidentFire from "../assets/incident-fire.png";
import incidentMedical from "../assets/incident-medical.png";
import incidentCrime from "../assets/incident-crime.png";

// ---------------------------------------------------
// ICON PICKING LOGIC
// ---------------------------------------------------
const createLocalIcon = (url) =>
  L.icon({
    iconUrl: url,
    iconSize: [25, 25],
    iconAnchor: [17, 17],
    popupAnchor: [0, -15],
  });

const ASSET_PATHS = {
  vehicles: {
    "Police": policeCar,
    "Fire": fireTruck,
    "Ambulance": ambulance,
    "default": policeCar
  },
  stations: {
    "POLICE": policeStation,
    "FIRE": fireStation,
    "MEDICAL": hospital,
    "default": fireStation
  },
  incidents: {
    "fire": incidentFire,
    "medical": incidentMedical,
    "crime": incidentCrime,
    "default": incidentFire
  }
};

const getIcon = (category, type) => {
  const iconUrl = ASSET_PATHS[category]?.[type] || ASSET_PATHS[category]?.["default"];
  return createLocalIcon(iconUrl);
};

export default function MapView() {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // 1. Initial Data Load (Stations, Incidents, Assignments, and Initial Vehicle Metadata)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load Vehicles
        const vehData = await VehicleService.getAllVehicles();
        const initialVehicles = vehData
          .map((v) => ({
            id: v.id,
            name: v.vehicleType || `Vehicle ${v.id}`,
            type: v.vehicleType,
            status: v.vehicleStatus,
            responder: v.responder,
            lat: parseFloat(v.stationLatitude),
            lng: parseFloat(v.stationLongitude),
          }))
          .filter((v) => !isNaN(v.lat) && !isNaN(v.lng));
        setVehicles(initialVehicles);

        // Load Stations
        const stationData = await StationService.getAllStations();
        const validStations = stationData
          .map((s) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            lat: parseFloat(s.latitude),
            lng: parseFloat(s.longitude),
          }))
          .filter((s) => !isNaN(s.lat) && !isNaN(s.lng));
        setStations(validStations);

        // Load Incidents
        const incidentData = await IncidentService.getAllIncidents();
        const validIncidents = incidentData
          .map((i) => ({
            id: i.id,
            name: `${i.type} at ${i.reporterName}'s location`,
            type: i.type,
            severity: i.severity,
            status: i.status,
            lat: parseFloat(i.latitude),
            lng: parseFloat(i.longitude),
          }))
          .filter((i) => !isNaN(i.lat) && !isNaN(i.lng));
        setIncidents(validIncidents);

        // Load Assignments
        const assignmentData = await IncidentService.getAssignments();
        setAssignments(assignmentData);

      } catch (err) {
        console.error("Error loading initial map data:", err);
      }
    };

    loadInitialData();
  }, []);

  // 2. Real-time Polling: Update vehicle positions from Redis every 3 seconds
  useEffect(() => {
    const pollVehicleLocations = async () => {
      try {
        const liveLocations = await VehicleService.getVehicleLocations();
        console.log(liveLocations);
        
        setVehicles((prevVehicles) => 
          prevVehicles.map((v) => {
            const match = liveLocations.find((loc) => loc.id === v.id);
            if (match) {
              return { 
                ...v, 
                lat: match.latitude, 
                lng: match.longitude 
              };
            }
            return v;
          })
        );
      } catch (err) {
        console.error("Error polling vehicle locations:", err);
      }
    };

    const interval = setInterval(pollVehicleLocations, 500);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="flex w-full h-screen">
      <div className="w-80 flex-shrink-0 flex flex-col border-r-2 border-red-600 bg-[#191919] p-3 overflow-y-auto">
        <ListGroup title="Vehicles" items={vehicles} />
        <ListGroup title="Incidents" items={incidents} />
        <ListGroup title="Stations" items={stations} />
      </div>

      <MapContainer
        center={[26, 31]}
        zoom={6}
        className="h-full w-full bg-gray-950 outline-none"
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; Stadia Maps"
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />

        {vehicles.map((v) => (
         <Marker
          key={`veh-${v.id}-${v.lat}-${v.lng}`}
          position={[v.lat, v.lng]}
          icon={getIcon("vehicles", v.type)}
        >
            <Popup>
              <strong>{v.name}</strong><br />
              Status: {v.status}<br />
              Responder: {v.responder}
            </Popup>
          </Marker>
        ))}

        {/* Station Markers */}
        {stations.map((s) => (
          <Marker key={`sta-${s.id}`} position={[s.lat, s.lng]} icon={getIcon("stations", s.type)}>
            <Popup>
              <strong>{s.name}</strong><br />
              Type: {s.type}
            </Popup>
          </Marker>
        ))}

        {/* Incident Markers */}
        {incidents.map((i) => (
          <Marker key={`inc-${i.id}`} position={[i.lat, i.lng]} icon={getIcon("incidents", i.type)}>
            <Popup>
              <strong>Incident #{i.id}</strong><br />
              Type: {i.type}<br />
              Severity: {i.severity}<br />
              Status: {i.status}
            </Popup>
          </Marker>
        ))}

        {/* Live Routes - Automatically updates when vehicle positions change */}
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

function ListGroup({ title, items }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold text-red-400 uppercase mb-2 sticky top-0 bg-[#191919] py-1">
        {title}
      </h2>
      {items.map((item) => (
        <div
          key={`${item.id}`}
          className="mb-2 p-2 bg-black/50 text-red-300 rounded border border-transparent hover:border-red-900 transition-colors"
        >
          <div className="font-bold text-sm">{item.name}</div>
          <div className="flex justify-between items-center mt-1">
             <span className="text-[10px] text-gray-500">{item.type}</span>
             {item.severity && <span className="text-[10px] px-1 bg-red-900/30 rounded">Lv. {item.severity}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}