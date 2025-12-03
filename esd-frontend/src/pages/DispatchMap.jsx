import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Ambulance, MapPin, AlertTriangle } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// --- 1. Custom Icon Generator ---
// This allows us to use Lucide React Icons + Tailwind classes as map markers
const createCustomIcon = (iconComponent, className) => {
  const iconMarkup = renderToStaticMarkup(iconComponent);
  
  return L.divIcon({
    html: `<div class="${className} flex items-center justify-center w-full h-full shadow-lg rounded-full">${iconMarkup}</div>`,
    className: 'bg-transparent', // Remove default leaflet square background
    iconSize: [40, 40], // Size of the marker
    iconAnchor: [20, 20], // Center the icon
    popupAnchor: [0, -20],
  });
};

const DispatchMap = () => {
  // --- 2. Mock Data (This would eventually come from your backend) ---
  const stations = [
    { id: 's1', name: 'Central Station', lat: 40.7128, lng: -74.0060, type: 'station' },
    { id: 's2', name: 'North Outpost', lat: 40.7580, lng: -73.9855, type: 'station' },
  ];

  const vehicles = [
    { id: 'v1', name: 'Unit A-12', lat: 40.7300, lng: -73.9950, status: 'idle' },
    { id: 'v2', name: 'Unit B-04', lat: 40.7420, lng: -74.0000, status: 'moving' },
  ];

  const incidents = [
    { id: 'i1', type: 'Fire', lat: 40.7350, lng: -73.9900, severity: 'high' },
    { id: 'i2', type: 'Medical', lat: 40.7200, lng: -74.0100, severity: 'medium' },
  ];

  // --- 3. Icon Definitions (Memoized for performance) ---
  const stationIcon = useMemo(() => createCustomIcon(
    <MapPin size={24} color="white" />, 
    "bg-blue-600 border-2 border-white"
  ), []);

  const vehicleIcon = useMemo(() => createCustomIcon(
    <Ambulance size={20} color="black" />, 
    "bg-yellow-400 border-2 border-black"
  ), []);

  // Note: We add 'animate-pulse' to incidents for visual urgency
  const incidentIcon = useMemo(() => createCustomIcon(
    <AlertTriangle size={20} color="white" />, 
    "bg-red-600 border-2 border-white animate-pulse" 
  ), []);


  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Header / HUD Overlay */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center z-10">
        <h2 className="text-xl font-bold text-white tracking-wider uppercase">
          Dispatch Command • Live View
        </h2>
        <div className="flex gap-4 text-sm font-mono text-gray-300">
          <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-full"></div> Active Incidents: {incidents.length}</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-full"></div> Units: {vehicles.length}</span>
        </div>
      </div>

      {/* --- The Map Container --- */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={[40.7300, -74.0000]} 
          zoom={13} 
          scrollWheelZoom={true} 
          className="w-full h-full"
        >
          {/* Abstract Dark Theme Layer 
            We use CartoDB Dark Matter for that 'Special Ops/Sci-Fi' look. 
            No API key required for this specific layer.
          */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Render Stations */}
          {stations.map(station => (
            <Marker key={station.id} position={[station.lat, station.lng]} icon={stationIcon}>
              <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                <span className="font-bold text-xs">{station.name}</span>
              </Tooltip>
            </Marker>
          ))}

          {/* Render Vehicles */}
          {vehicles.map(vehicle => (
            <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]} icon={vehicleIcon}>
              <Popup>
                <div className="text-sm font-mono">
                  <strong>{vehicle.name}</strong><br/>
                  Status: {vehicle.status}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Incidents */}
          {incidents.map(incident => (
            <Marker key={incident.id} position={[incident.lat, incident.lng]} icon={incidentIcon}>
               <Popup>
                <div className="text-sm font-sans">
                  <strong className="text-red-600 uppercase">{incident.type}</strong><br/>
                  Severity: {incident.severity}
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>
    </div>
  );
};

export default DispatchMap;