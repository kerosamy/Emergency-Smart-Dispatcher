// src/pages/Assign.jsx
import { useState } from "react";
import axios from "axios";

export default function Assign() {
  const [incidentId, setIncidentId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/assign", {
        incidentId,
        vehicleId,
      });
      setMessage("Vehicle assigned successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error assigning vehicle");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assign Vehicle to Incident</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Incident ID"
          type="number"
          value={incidentId}
          onChange={(e) => setIncidentId(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Vehicle ID"
          type="number"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          required
        />
        <button className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800">
          Assign Vehicle
        </button>
      </form>
    </div>
  );
}
