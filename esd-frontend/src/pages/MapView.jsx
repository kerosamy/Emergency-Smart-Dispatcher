// src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import VehicleService from "../services/VehicleService";
import StationService from "../services/StationService";

// -------------------------------------------------------
// LOCAL ASSETS
import carIconUrl from "../assets/police-car.png";
import fireIconUrl from "../assets/incident.png";
import stationIconUrl from "../assets/fire-station.png";

const createLocalIcon = (url) => {
  return L.icon({
    iconUrl: url,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const ICONS = {
  vehicle: createLocalIcon(carIconUrl),
  incident: createLocalIcon(fireIconUrl),
  station: createLocalIcon(stationIconUrl),
};

// -------------------------------------------------------
// DUMMY INCIDENTS
const INCIDENTS = [
  { id: 99, name: "Fire Alarm", lat: 30.042, lng: 31.238, type: "incident", severity: "High" },
  { id: 98, name: "Traffic Accident", lat: 30.055, lng: 31.232, type: "incident", severity: "Medium" },
];

export default function MapView() {
  const mapRef = useRef(null);

  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);

  // -------------------------------------------------------
  // FETCH VEHICLES AND STATIONS FROM BACKEND
 useEffect(() => {
    const loadData = async () => {
      try {
        // --- 1. Load Vehicles ---
        const vehData = await VehicleService.getAllVehicles();
        
        const validVehicles = vehData
          .map((v) => ({
            id: v.id,
            name: v.vehicleType || `Vehicle ${v.id}`,
            // Ensure numbers with parseFloat, fallback to default if NaN
            lat: parseFloat(v.stationLatitude) , 
            lng: parseFloat(v.stationLongitude) + 0.2,
            type: "vehicle",
          }))
          // Double safety: Filter out if something went wrong and we don't want defaults
          .filter(v => !isNaN(v.lat) && !isNaN(v.lng));

        setVehicles(validVehicles);

        // --- 2. Load Stations ---
        const stationData = await StationService.getAllStations();
        
        const validStations = stationData
          .map((s) => ({
            id: s.id,
            name: s.name,
            // FIX: Add parseFloat and Fallback logic here
            lat: parseFloat(s.latitude) || 30.048, 
            lng: parseFloat(s.longitude) || 30.048,
            type: "station",
          }))
          // CRITICAL: Filter out stations with missing/null coordinates
          .filter((s) => !isNaN(s.lat) && !isNaN(s.lng));

        setStations(validStations);
        console.log("validStations:" + validStations);

      } catch (err) {
        console.error("Error loading map data:", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex w-full h-screen bg-gray-800 text-gray-100 font-sans overflow-hidden">
      <div className="w-80 flex-shrink-0 flex flex-col border-r-2 border-red-600 bg-[#191919] backdrop-blur-md shadow-lg">
        <div className="p-5 border-b-2 border-red-600 bg-[#191919]">
          <h1 className="text-xl font-extrabold text-red-500">CAD System</h1>
          <p className="text-xs text-red-300 mt-1">Map Overview</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          <ListGroup title="Vehicles" items={vehicles} />
          <ListGroup title="Incidents" items={INCIDENTS} />
          <ListGroup title="Stations" items={stations} />
        </div>

        <div className="p-4 border-t-2 border-red-600 bg-black/90">
          <button
            onClick={() => mapRef.current?.flyTo([30.048, 31.235], 14)}
            className="w-full py-2 text-xs font-semibold uppercase text-red-300 hover:text-red-100 bg-black/70 border border-red-600/40 rounded"
          >
            Reset Map View
          </button>
        </div>
      </div>

      {/* MAP */}
      <div className="flex-1 relative">
        <MapContainer
          center={[30.048, 31.235]}
          zoom={14}
          className="h-full w-full bg-gray-950 outline-none"
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; Stadia Maps'
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
          {INCIDENTS.map((i) => (
            <Marker key={i.id} position={[i.lat, i.lng]} icon={ICONS.incident}>
              <Popup>{i.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style>{`
        .leaflet-icon-shadow { filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.6)); }
        .leaflet-div-icon { background: transparent; border: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111827; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
      `}</style>
    </div>
  );
}

// -------------------------------------------------------
// LIST GROUP (No click functionality anymore)
function ListGroup({ title, items }) {
  return (
    <div>
      <h2 className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2 px-1">
        {title}
      </h2>
      {items.map((item) => (
        <div
          key={item.id}
          className="mb-2 p-3 rounded-r-lg bg-black/50 text-red-300 text-sm"
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
