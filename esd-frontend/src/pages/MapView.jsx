import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { wsService } from "../services/websocketService";
import MarkerClusterGroup from "react-leaflet-cluster";

import VehicleService from "../services/VehicleService";
import StationService from "../services/StationService";
import IncidentService from "../services/IncidentService";
import RoutingLayer from "../Components/RoutingLayer";

// ---------------------------------------------------
// ICONS
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
// ICON CACHE (VERY IMPORTANT)
// ---------------------------------------------------
const iconCache = {};

const createIcon = (url) => {
  if (!iconCache[url]) {
    iconCache[url] = L.icon({
      iconUrl: url,
      iconSize: [25, 25],
      iconAnchor: [17, 17],
      popupAnchor: [0, -15],
    });
  }
  return iconCache[url];
};
const createGlowingIcon = (url, glow = false) => {
  return L.divIcon({
    html: `<div style="
      width: 25px;
      height: 25px;
      background-image: url(${url});
      background-size: cover;
      border-radius: 50%;
      ${glow ? 'box-shadow: 0 0 15px 5px rgba(255,0,0,0.7);' : ''}
      ">
    </div>`,
    className: "", // remove default Leaflet styles
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};


const ICONS = {
  vehicles: {
    POLICE: policeCar,
    FIRE: fireTruck,
    MEDICAL: ambulance,
    default: policeCar,
  },
  stations: {
    POLICE: policeStation,
    FIRE: fireStation,
    MEDICAL: hospital,
    default: fireStation,
  },
  incidents: {
    fire: incidentFire,
    medical: incidentMedical,
    crime: incidentCrime,
    default: incidentFire,
  },
};

const getIcon = (category, type) =>
  createIcon(ICONS[category]?.[type] || ICONS[category].default);

// ---------------------------------------------------
// COMPONENT
// ---------------------------------------------------
export default function MapView() {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showRoutes, setShowRoutes] = useState(true);
  const [timeExceededIncidents, setTimeExceededIncidents] = useState(new Set());

  const wsConnected = useRef(false);

  // ---------------------------------------------------
  // INITIAL LOAD (ONCE)
  // ---------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const [veh, sta, inc, ass] = await Promise.all([
          VehicleService.getAllVehicles(),
          StationService.getAllStations(),
          IncidentService.getAllNonSolvedIncidents(),
          IncidentService.getAssignmentsForNonSolved(),
        ]);

        setVehicles(
          veh
            .map((v) => ({
              id: v.id,
              name: v.vehicleType,
              type: v.vehicleType,
              status: v.vehicleStatus,
              responder: v.responder,
              lat: +v.stationLatitude,
              lng: +v.stationLongitude,
            }))
            .filter((v) => !isNaN(v.lat))
        );

        setStations(
          sta
            .map((s) => ({
              id: s.id,
              name: s.name,
              type: s.type,
              lat: +s.latitude,
              lng: +s.longitude,
            }))
            .filter((s) => !isNaN(s.lat))
        );

        setIncidents(
          inc
            .map((i) => ({
              id: i.id,
              type: i.type,
              severity: i.severity,
              status: i.status,
              lat: +i.latitude,
              lng: +i.longitude,
            }))
            .filter((i) => !isNaN(i.lat))
        );

        setAssignments(ass);
      } catch (e) {
        console.error("Map load error", e);
      }
    };

    load();
  }, []);

  // ---------------------------------------------------
  // WEBSOCKET (ONE CONNECTION ONLY)
  // ---------------------------------------------------
  useEffect(() => {
    if (wsConnected.current) return;
    wsConnected.current = true;

    wsService.connect(
      (status) => {
        console.log("🟢 WS status:", status);

        if (status !== "connected") return;

        wsService.subscribe("/topic/vehicles", (u) => {
          setVehicles((prev) => {
            if (u.type === "VEHICLE_REMOVED") {
              console.log("🚗 Vehicle removed:", u.vehicleId);
              return prev.filter((v) => v.id !== u.vehicleId);
            }
          
            const index = prev.findIndex((v) => v.id === u.id);

            // 🔹 UPDATE
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                lat: u.latitude,
                lng: u.longitude,
                status: u.status ?? updated[index].status,
              };
              return updated;
            }

            return [
              ...prev,
              {
                id: u.id,
                name: u.vehicleType || `Vehicle ${u.id}`,
                type: u.vehicleType,
                status: u.status,
                responder: u.responder,
                lat: u.latitude,
                lng: u.longitude,
              },
            ];
          });
        });

        // 🔹 Stations
        wsService.subscribe("/topic/stations", (e) => {
          if (e.type !== "STATION_ADDED") return;

          setStations((prev) =>
            prev.some((s) => s.id === e.stationId)
              ? prev
              : [
                  ...prev,
                  {
                    id: e.stationId,
                    name: e.name,
                    type: e.stationType,
                    lat: e.latitude,
                    lng: e.longitude,
                  },
                ]
          );
        });

        // 🔹 Assignments
        wsService.subscribe("/topic/assignments", (event) => {
          console.log("📡 Assignment WS event:", event);

          switch (event.type) {
            case "ASSIGNED":
              setAssignments((prev) => {
                const exists = prev.some(
                  (a) =>
                    a.incidentId === event.incidentId &&
                    a.vehicleId === event.vehicleId
                );

                if (exists) return prev;

                return [
                  ...prev,
                  {
                    incidentId: event.incidentId,
                    vehicleId: event.vehicleId,
                    stationName: event.stationName,
                  },
                ];
              });
              break;

            case "UNASSIGNED":
              setAssignments((prev) =>
                prev.filter(
                  (a) =>
                    !(
                      a.incidentId === event.incidentId &&
                      a.vehicleId === event.vehicleId
                    )
                )
              );
              break;

            default:
              console.warn("Unknown assignment event:", event);
          }
        });

        // 🔹 Incidents
        wsService.subscribe("/topic/incidents", (e) => {
          if (e.type === "REPORTED") {
            setIncidents((prev) => [
              ...prev,
              {
                id: e.incidentId,
                type: e.incidentType,
                severity: e.severity,
                status: e.status,
                lat: e.latitude,
                lng: e.longitude,
              },
            ]);
          } else if (e.type === "DELETED") {
            setIncidents((prev) => prev.filter((i) => i.id !== e.incidentId));
          }else if (e.type === "TIME") {
            setTimeExceededIncidents((prev) => new Set(prev).add(e.incidentId));
          }
        });
      },
      (msg) => console.log("📩 WS message:", msg)
    );

    return () => {
      wsService.disconnect();
      wsConnected.current = false;
    };
  }, []);

  // ---------------------------------------------------
  // FAST LOOKUPS (NO FIND INSIDE RENDER)
  // ---------------------------------------------------
  const stationMap = useMemo(
    () => Object.fromEntries(stations.map((s) => [s.name, s])),
    [stations]
  );

  const incidentMap = useMemo(
    () => Object.fromEntries(incidents.map((i) => [i.id, i])),
    [incidents]
  );

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <div className="relative h-screen w-full">
      {/* Toggle Button */}
      <button
        onClick={() => setShowRoutes(!showRoutes)}
        className={`absolute top-4 right-4 z-[1000] px-4 py-2 rounded-lg shadow-lg font-semibold transition-all duration-200 ${
          showRoutes
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-600 hover:bg-gray-700 text-white"
        }`}
      >
        {showRoutes ? "Hide Routes" : "Show Routes"}
      </button>

      <MapContainer
        center={[26, 31]}
        zoom={6}
        className="h-full w-full"
        preferCanvas
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />

        {vehicles.map((v) => (
          <Marker
            key={`veh-${v.id}`}
            position={[v.lat, v.lng]}
            icon={getIcon("vehicles", v.type)}
          >
            <Popup>{v.name}</Popup>
          </Marker>
        ))}

        {stations.map((s) => (
          <Marker
            key={`sta-${s.id}`}
            position={[s.lat, s.lng]}
            icon={getIcon("stations", s.type)}
          >
            <Popup>{s.name}</Popup>
          </Marker>
        ))}

      {incidents.map((i) => {
        const isTimeExceeded = timeExceededIncidents.has(i.id);
        const icon = createGlowingIcon(
          ICONS.incidents[i.type] || ICONS.incidents.default,
          isTimeExceeded
        );

        return (
          <Marker key={`inc-${i.id}`} position={[i.lat, i.lng]} icon={icon}>
            <Popup>
              Incident #{i.id} {isTimeExceeded && "(⏰ Time Exceeded)"}
            </Popup>
          </Marker>
        );
      })}


        {/* Conditionally render routing paths */}
        {showRoutes &&
          assignments.map((a, idx) => {
            const st = stationMap[a.stationName];
            const inc = incidentMap[a.incidentId];
            if (!st || !inc) return null;

            return <RoutingLayer key={`r-${idx}`} start={st} end={inc} />;
          })}
      </MapContainer>
    </div>
  );
}