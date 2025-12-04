// src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// -------------------------------------------------------
// 1. LOCAL ASSETS
// -------------------------------------------------------
// Ensure these exist in your src/assets folder
import carIconUrl from "../assets/police-car.png";
import fireIconUrl from "../assets/incident.png";
import stationIconUrl from "../assets/fire-station.png";
// Helper to create standard Leaflet icons
const createLocalIcon = (url) => {
  return L.icon({
    iconUrl: url,
    iconSize: [40, 40],     
    iconAnchor: [20, 20],   
    popupAnchor: [0, -20],  
    className: 'leaflet-icon-shadow' // CSS class for drop shadow
  });
};

const ICONS = {
    vehicle: createLocalIcon(carIconUrl),
    incident: createLocalIcon(fireIconUrl),
    station: createLocalIcon(stationIconUrl)
};

// -------------------------------------------------------
// 2. DUMMY DATA
// -------------------------------------------------------
const STATIONS = [
  { id: 1, name: "Central Station", lat: 30.045, lng: 31.23, type: "station" },
  { id: 2, name: "North Base", lat: 30.05, lng: 31.24, type: "station" },
];

const VEHICLES_DATA = [
  { id: 10, name: "Ambulance A1", lat: 30.048, lng: 31.233, type: "vehicle" },
  { id: 11, name: "Patrol Car P2", lat: 30.052, lng: 31.225, type: "vehicle" },
];

const INCIDENTS = [
  { id: 99, name: "Fire Alarm", lat: 30.042, lng: 31.238, type: "incident", severity: "High" },
  { id: 98, name: "Traffic Accident", lat: 30.055, lng: 31.232, type: "incident", severity: "Medium" },
];

// -------------------------------------------------------
// 3. MATH HELPERS
// -------------------------------------------------------
const interpolatePosition = (start, end, fraction) => {
    return {
      lat: start.lat + (end.lat - start.lat) * fraction,
      lng: start.lng + (end.lng - start.lng) * fraction,
    };
};

// -------------------------------------------------------
// 4. MAP CONTROLLER (Handles Routing & FlyTo)
// -------------------------------------------------------
function MapController({ routePoints, onRouteFound }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  // 1. Smooth Camera Movement
  useEffect(() => {
    if (routePoints.length > 0) {
      const lastPoint = routePoints[routePoints.length - 1];
      if (map.distance(map.getCenter(), [lastPoint.lat, lastPoint.lng]) > 50) {
         map.flyTo([lastPoint.lat, lastPoint.lng], 15, { duration: 1.2 });
      }
    }
  }, [routePoints, map]);

  // 2. Routing Logic
  useEffect(() => {
    if (routePoints.length === 2) {
      if (routingControlRef.current) map.removeControl(routingControlRef.current);

      const control = L.Routing.control({
        waypoints: [
            L.latLng(routePoints[0].lat, routePoints[0].lng),
            L.latLng(routePoints[1].lat, routePoints[1].lng),
        ],
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        fitSelectedRoutes: false, 
        lineOptions: {
          styles: [{ color: "#10b981", weight: 6, opacity: 0.7 }], 
        },
        createMarker: () => null, 
      }).addTo(map);

      // Extract coordinates when route is found
      control.on("routesfound", function (e) {
        const routeCoordinates = e.routes[0].coordinates;
        onRouteFound(routeCoordinates);
      });

      routingControlRef.current = control;
    } else {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    }
  }, [routePoints, map, onRouteFound]);

  return null;
}

// -------------------------------------------------------
// 5. MAIN COMPONENT
// -------------------------------------------------------
export default function MapView() {
  const mapRef = useRef(null);
  const animationRef = useRef();

  const [vehicles, setVehicles] = useState(VEHICLES_DATA);
  const [routePoints, setRoutePoints] = useState([]);
  const [calculatedPath, setCalculatedPath] = useState([]); 
  const [isSimulating, setIsSimulating] = useState(false);

  // -------------------------------------------------------
  // UNIFORM SPEED SIMULATION LOGIC
  // -------------------------------------------------------
  const startSimulation = () => {
    // Validation
    if (!calculatedPath.length || !routePoints[0] || isSimulating) return;
    const map = mapRef.current;
    if (!map) return;

    setIsSimulating(true);
    const vehicleId = routePoints[0].id; 
    
    let pathIndex = 0;
    let stepProgress = 0; 

    // TUNING: How many meters to move per frame (60fps)
    // 5 = ~300 meters/sec (Simulated fast drone speed)
    // 0.5 = ~30 meters/sec (Real highway car speed)
    const SPEED_METERS_PER_FRAME = 5; 

    const animate = () => {
      // 1. End Condition
      if (pathIndex >= calculatedPath.length - 1) {
        setIsSimulating(false);
        // Snap to exact end
        const final = calculatedPath[calculatedPath.length - 1];
        setVehicles(prev => prev.map(v => v.id === vehicleId ? {...v, lat: final.lat, lng: final.lng} : v));
        return;
      }

      const startCoord = calculatedPath[pathIndex];
      const endCoord = calculatedPath[pathIndex + 1];

      // 2. Calculate Real Distance (in meters)
      const distMeters = map.distance(
          [startCoord.lat, startCoord.lng], 
          [endCoord.lat, endCoord.lng]
      );

      // 3. Handle data noise (points on top of each other)
      if (distMeters < 0.1) {
          pathIndex++;
          stepProgress = 0;
          animationRef.current = requestAnimationFrame(animate);
          return;
      }

      // 4. Calculate Step Increment (Uniform Speed)
      const stepIncrement = SPEED_METERS_PER_FRAME / distMeters;

      // 5. Interpolate & Update
      const currentPos = interpolatePosition(startCoord, endCoord, stepProgress);

      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId
            ? { ...v, lat: currentPos.lat, lng: currentPos.lng }
            : v
        )
      );

      // 6. Advance Loop
      stepProgress += stepIncrement;

      if (stepProgress >= 1.0) {
          stepProgress = 0; 
          pathIndex++;      
      }
      
      animationRef.current = requestAnimationFrame(animate); 
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopSimulation = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsSimulating(false);
  };

  const handleEntityClick = (entity) => {
    if (isSimulating) return; 

    setRoutePoints((prev) => {
      if (prev.length === 0 && entity.type !== 'vehicle') {
        alert("Please select a Vehicle first.");
        return prev;
      }
      if (prev.length >= 2) return [entity]; 
      if (!prev.find((p) => p.id === entity.id)) return [...prev, entity]; 
      return prev;
    });
  };

  const resetMap = () => {
    stopSimulation();
    setRoutePoints([]);
    setCalculatedPath([]);
    setVehicles(VEHICLES_DATA); 
  };

  return (
    <div className="flex w-full h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900/95 z-10 shadow-2xl backdrop-blur-sm">
        <div className="p-5 border-b border-gray-800 bg-gray-900">
          <h1 className="text-xl font-extrabold text-white">CAD System</h1>
          <p className="text-xs text-gray-500 mt-1">Select 1 Vehicle + 1 Destination</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* Status Panel */}
          {routePoints.length === 2 && (
            <div className="bg-gray-800/50 border border-emerald-500/30 rounded p-3">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Route Ready</div>
              
              <div className="text-xs mb-4 text-gray-400">
                Moving <span className="text-white font-bold">{routePoints[0].name}</span> to <span className="text-white font-bold">{routePoints[1].name}</span>
              </div>

              {!isSimulating ? (
                <button
                  onClick={startSimulation}
                  disabled={calculatedPath.length === 0}
                  className={`w-full py-3 font-bold rounded shadow-lg uppercase tracking-widest text-xs transition-all transform active:scale-95
                    ${calculatedPath.length > 0 ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                  {calculatedPath.length > 0 ? 'Dispatch Unit' : 'Calculating...'}
                </button>
              ) : (
                <button
                  onClick={stopSimulation}
                  className="w-full py-3 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded shadow-lg text-xs uppercase tracking-widest"
                >
                  Stop
                </button>
              )}
            </div>
          )}

          {/* Lists */}
          <div className="space-y-2">
            <ListGroup title="Vehicles" items={vehicles} onClick={handleEntityClick} routePoints={routePoints} type="vehicle" />
            <ListGroup title="Incidents" items={INCIDENTS} onClick={handleEntityClick} routePoints={routePoints} type="incident" />
            <ListGroup title="Stations" items={STATIONS} onClick={handleEntityClick} routePoints={routePoints} type="station" />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <button onClick={resetMap} className="w-full py-2 text-xs font-semibold uppercase text-gray-500 hover:text-white bg-gray-800 rounded">
            Reset Map
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
          ref={mapRef} // Critical for distance calculation
        >
          <TileLayer
            attribution='&copy; Stadia Maps'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />

          <MapController 
            routePoints={routePoints} 
            onRouteFound={setCalculatedPath}
          />

          {/* Vehicles */}
          {vehicles.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={ICONS.vehicle}
              eventHandlers={{ click: () => handleEntityClick(v) }}
            >
              <Popup className="custom-popup">{v.name}</Popup>
            </Marker>
          ))}

          {/* Static Entities */}
          {[...STATIONS, ...INCIDENTS].map((entity) => (
            <Marker
              key={`${entity.type}-${entity.id}`}
              position={[entity.lat, entity.lng]}
              icon={ICONS[entity.type]}
              eventHandlers={{ click: () => handleEntityClick(entity) }}
            >
              <Popup className="custom-popup">{entity.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style>{`
        .leaflet-icon-shadow { filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.6)); }
        .leaflet-div-icon { background: transparent; border: none; }
        .leaflet-routing-container { display: none !important; } 
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111827; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function ListGroup({ title, items, onClick, routePoints, type }) {
    const color = type === 'vehicle' ? 'text-blue-400' : type === 'incident' ? 'text-red-400' : 'text-gray-400';
    return (
        <div>
             <h2 className={`text-[10px] font-bold ${color} uppercase tracking-wider mb-2 px-1`}>{title}</h2>
             {items.map(item => (
                 <ListItem 
                    key={item.id} 
                    item={item} 
                    onClick={() => onClick(item)} 
                    isActive={routePoints.some((rp) => rp.id === item.id)}
                 />
             ))}
        </div>
    )
}

function ListItem({ item, onClick, isActive }) {
  const colorClass = item.type === 'vehicle' ? 'border-blue-500' : item.type === 'incident' ? 'border-red-500' : 'border-gray-500';
  return (
    <div
      onClick={onClick}
      className={`mb-2 p-3 rounded-r-lg border-l-[3px] ${colorClass} cursor-pointer transition-all duration-200 
        ${isActive ? 'bg-gray-800 translate-x-1 shadow-md ring-1 ring-inset ring-white/10' : 'bg-gray-900/50 hover:bg-gray-800'}`}
    >
      <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{item.name}</div>
    </div>
  );
}