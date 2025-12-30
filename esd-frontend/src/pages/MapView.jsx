import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { wsService } from "../services/websocketService";

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
// ICON CACHE (VERY IMPORTANT - OUTSIDE COMPONENT)
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
  const cacheKey = `${url}-${glow}`;
  if (!iconCache[cacheKey]) {
    iconCache[cacheKey] = L.divIcon({
      html: `<div style="
        width: 25px;
        height: 25px;
        background-image: url(${url});
        background-size: cover;
        border-radius: 50%;
        ${glow ? 'box-shadow: 0 0 15px 5px rgba(255,0,0,0.7);' : ''}
        ">
      </div>`,
      className: "",
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  }
  return iconCache[cacheKey];
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
  createIcon(ICONS[category]?.[type?.toUpperCase()] || ICONS[category].default);

// ---------------------------------------------------
// MEMOIZED MARKER COMPONENTS
// ---------------------------------------------------
const VehicleMarker = memo(({ vehicle }) => (
  <Marker
    position={[vehicle.lat, vehicle.lng]}
    icon={getIcon("vehicles", vehicle.type)}
  >
    <Popup>{vehicle.name}</Popup>
  </Marker>
));
VehicleMarker.displayName = "VehicleMarker";

const StationMarker = memo(({ station }) => (
  <Marker
    position={[station.lat, station.lng]}
    icon={getIcon("stations", station.type)}
  >
    <Popup>{station.name}</Popup>
  </Marker>
));
StationMarker.displayName = "StationMarker";

const IncidentMarker = memo(({ incident, isTimeExceeded }) => {
  const icon = useMemo(
    () =>
      createGlowingIcon(
        ICONS.incidents[incident.type] || ICONS.incidents.default,
        isTimeExceeded
      ),
    [incident.type, isTimeExceeded]
  );

  return (
    <Marker position={[incident.lat, incident.lng]} icon={icon}>
      <Popup>
        Incident #{incident.id} {isTimeExceeded && "(⏰ Time Exceeded)"}
      </Popup>
    </Marker>
  );
});
IncidentMarker.displayName = "IncidentMarker";

const RouteLayer = memo(({ assignment, stationMap, incidentMap }) => {
  const st = stationMap[assignment.stationName];
  const inc = incidentMap[assignment.incidentId];
  
  if (!st || !inc) return null;
  
  return <RoutingLayer start={st} end={inc} />;
});
RouteLayer.displayName = "RouteLayer";

// ---------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------
export default function MapView() {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showRoutes, setShowRoutes] = useState(true);
  const [timeExceededIncidents, setTimeExceededIncidents] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------
  // INITIAL LOAD (ONCE)
  // ---------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // ---------------------------------------------------
  // WEBSOCKET SUBSCRIPTIONS (MEMOIZED CALLBACKS)
  // ---------------------------------------------------
  const handleVehicleUpdate = useCallback((u) => {
    if (u.type === "VEHICLE_REMOVED") {
      setVehicles(prev => prev.filter(v => v.id !== u.vehicleId));
      return;
    }

    if (!u.id) {
      console.warn("Ignoring vehicle update with no id", u);
      return;
    }

    setVehicles(prev => {
      const index = prev.findIndex(v => v.id === u.id);

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
        const vehicleName = u.vehicleType || `Vehicle ${u.id}`;
        if (!u.vehicleType) {
             console.log(`Fallback name used for vehicle ${u.id}: ${vehicleName}`);
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
  }, []);

  const handleStationUpdate = useCallback((e) => {
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
  }, []);

  const handleAssignmentUpdate = useCallback((event) => {
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
  }, []);

  const handleIncidentUpdate = useCallback((e) => {
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
      setAssignments((prev) => prev.filter((a) => a.incidentId !== e.incidentId));
    } else if (e.type === "TIME") {
      setTimeExceededIncidents((prev) => new Set(prev).add(e.incidentId));
    }
  }, []);

  useEffect(() => {
    console.log("📡 Setting up WebSocket subscriptions...");

    const unsubVehicles = wsService.subscribe("/topic/vehicles", handleVehicleUpdate);
    const unsubStations = wsService.subscribe("/topic/stations", handleStationUpdate);
    const unsubAssignments = wsService.subscribe("/topic/assignments", handleAssignmentUpdate);
    const unsubIncidents = wsService.subscribe("/topic/incidents", handleIncidentUpdate);

    return () => {
      console.log("🔕 Cleaning up WebSocket subscriptions...");
      unsubVehicles && unsubVehicles();
      unsubStations && unsubStations();
      unsubAssignments && unsubAssignments();
      unsubIncidents && unsubIncidents();
    };
  }, [handleVehicleUpdate, handleStationUpdate, handleAssignmentUpdate, handleIncidentUpdate]);

  // ---------------------------------------------------
  // MEMOIZED MAPS
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
  // MEMOIZED TOGGLE HANDLER
  // ---------------------------------------------------
  const toggleRoutes = useCallback(() => {
    setShowRoutes(prev => !prev);
  }, []);

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-900">
        <div className="text-white text-xl">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Toggle Button */}
      <button
        onClick={toggleRoutes}
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
        <TileLayer 
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          updateWhenIdle={true}
          updateWhenZooming={false}
        />

        {/* Vehicles */}
        {vehicles.map((v) => (
          <VehicleMarker key={`veh-${v.id}`} vehicle={v} />
        ))}

        {/* Stations */}
        {stations.map((s) => (
          <StationMarker key={`sta-${s.id}`} station={s} />
        ))}

        {/* Incidents */}
        {incidents.map((i) => (
          <IncidentMarker
            key={`inc-${i.id}`}
            incident={i}
            isTimeExceeded={timeExceededIncidents.has(i.id)}
          />
        ))}

        {/* Routes */}
        {showRoutes &&
          assignments.map((a, idx) => (
            <RouteLayer
              key={`r-${a.incidentId}-${a.vehicleId}`}
              assignment={a}
              stationMap={stationMap}
              incidentMap={incidentMap}
            />
          ))}
      </MapContainer>
    </div>
  );
}