// src/pages/Vehicles.jsx
import { useEffect, useState } from "react";
import VehicleService from "../services/VehicleService";
import VehicleTable from "../Components/VehicleTable";
import StationService from "../services/StationService";
import UserService from "../services/UserService";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [capacity, setCapacity] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("AVAILABLE");
  const [stationName, setStationName] = useState("");
  const [stations, setStations] = useState([]);
  const [responderId, setResponderId] = useState("");
  const [responders, setResponders] = useState([]);


  useEffect(() => {
    loadVehicles();
    fetchStations();
    fetchUnassignedResponders();
  }, []);

  const fetchUnassignedResponders = async () => {
    try {
      const data = await UserService.getUnassignedResponders();
      setResponders(data);
    } catch (err) {
      console.error("Error fetching responders", err);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await StationService.getStations(); // API should return [{name, ...}]
      setStations(data);
    } catch (err) {
      console.error("Error fetching stations", err);
    }
  };

  const loadVehicles = () => {
    VehicleService.getAllVehicles()
      .then((data) => setVehicles(data))
      .catch((err) => console.error(err));
  };


  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const dto = { 
      capacity: parseInt(capacity),
      vehicleStatus,
      stationName,
      responderId: responderId ? parseInt(responderId) : null
    };

    try {
      await VehicleService.addVehicle(dto);
      setShowModal(false);
      loadVehicles();
      fetchUnassignedResponders();
      setCapacity("");
      setStationName("");
      setVehicleStatus("AVAILABLE");
      setResponderId("");
      const data = await VehicleService.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await VehicleService.deleteVehicle(vehicleId);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId)); 
      if (selectedVehicle?.id === vehicleId) setSelectedVehicle(null); 
    } catch (err) {
      console.error("Error deleting vehicle:", err);
    }
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden flex justify-center items-center">
      {/* Full-page background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-blue-900"></div>

      {/* Animated blobs */}
      <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-700 rounded-full filter blur-[200px] opacity-50 animate-ping-slow"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-700 rounded-full filter blur-[200px] opacity-50 animate-ping-slow delay-500"></div>

      {/* Card container */}
      <div className="relative z-10 w-full max-w-6xl p-8 bg-black/80 backdrop-blur-lg rounded-3xl border-2 border-red-600 shadow-2xl flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-red-500 mb-6 text-center animate-pulse">
          Vehicles
        </h1>

        {/* Vehicle table */}
        <VehicleTable
          items={vehicles}
          selectedId={selectedVehicle?.id}
          onSelect={(v) => setSelectedVehicle(v)}
          onDelete={handleDeleteVehicle}
          showDelete={true} 
        />

        {/* Selected vehicle details */}
        {selectedVehicle && (
          <div className="p-6 bg-black/40 border border-blue-500 rounded-2xl max-w-sm mt-4 self-center">
            <h2 className="text-xl text-blue-400 font-bold mb-3">Vehicle Details</h2>
            <p>ID: {selectedVehicle.id}</p>
            <p>Capacity: {selectedVehicle.capacity}</p>
            <p>Status: {selectedVehicle.vehicleStatus}</p>
            <p>Station: {selectedVehicle.stationName}</p>
            <p>Type: {selectedVehicle.vehicleType}</p>
            <p>Responder: {selectedVehicle.responder || "None"}</p>
          </div>
        )}

        {/* ADD VEHICLE BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="self-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-xl font-bold text-lg"
        >
          + Add Vehicle
        </button>

        {/* MODAL FORM */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-black/80 border border-red-600 rounded-2xl p-8 w-full max-w-md shadow-xl">
              <h2 className="text-2xl font-bold text-center text-red-400 mb-6">Add Vehicle</h2>

              <form className="space-y-4" onSubmit={handleAddVehicle}>
                <input
                  type="number"
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  placeholder="Capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
               
               <select
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  required
                >
                  <option value="">Select a Station</option>
                  {stations.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>

              <select
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  value={responderId}
                  onChange={(e) => setResponderId(e.target.value)}
                  required
                >
                  <option value="">Select a Responder</option>
                  {responders.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.email}
                    </option>
                  ))}
                </select>

                <button className="w-full py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white">
                  Add Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 rounded-xl mt-2 border border-gray-500 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} Emergency Dispatch Control
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-ping-slow { animation: pulse-slow 2s infinite; }
      `}</style>
    </div>
  );
}