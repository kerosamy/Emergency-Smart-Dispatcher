// src/pages/Assign.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import IncidentService from "../services/IncidentService";
import VehicleService from "../services/VehicleService";
import IncidentTable from "../Components/IncidentTable";
import VehicleTable from "../Components/VehicleTable"; // create a similar table component for vehicles
import UserService from "../services/UserService";

export default function Assign() {
  const [incidents, setIncidents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [message, setMessage] = useState("");

  const token = UserService.getToken();
  const headers = { Authorization: `Bearer ${token}` };

  // Load incidents and vehicles
 useEffect(() => {
    loadIncidents();
    loadVehicles();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await IncidentService.getReportedIncidents();
      setIncidents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await VehicleService.getAvailableVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async () => {
    if (!selectedIncident || !selectedVehicle) {
      setMessage("Please select both an incident and a vehicle.");
      return;
    }

    try {
      // Use backend path variables
      await IncidentService.assignVehicle(selectedIncident.id, selectedVehicle.id);
      setMessage("Vehicle assigned successfully!");
      loadIncidents();
      loadVehicles();
      setSelectedIncident(null);
      setSelectedVehicle(null);
    } catch (err) {
      console.error(err);
      setMessage("Error assigning vehicle");
    }
  };

  return (
   <div className="w-full h-screen relative bg-black overflow-hidden flex flex-col justify-start items-center p-6">
  <h1 className="text-3xl font-bold text-red-400 mb-6">Assign Vehicle to Incident</h1>

  {message && <p className="mb-4 text-green-400">{message}</p>}

  <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl items-start">
    {/* Incidents Table */}
    <div className="flex-1 min-w-0">
      <h2 className="text-xl font-bold text-red-400 mb-2">Incidents</h2>
      <IncidentTable
        items={incidents}
        selectedId={selectedIncident?.id}
        onSelect={setSelectedIncident}
      />
    </div>

    {/* Vehicles Table */}
    <div className="flex-1 min-w-0">
      <h2 className="text-xl font-bold text-red-400 mb-2">Available Vehicles</h2>
      <VehicleTable
        items={vehicles}
        selectedId={selectedVehicle?.id}
        onSelect={setSelectedVehicle}
      />
    </div>
  </div>

  {/* Assign Button */}
  <button
    onClick={handleAssign}
    className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold"
  >
    Assign Vehicle
  </button>
</div>

  );
}
