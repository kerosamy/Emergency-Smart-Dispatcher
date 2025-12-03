// src/pages/AddVehicle.jsx
import { useState } from "react";
import axios from "axios";

export default function AddVehicle() {
  const [capacity, setCapacity] = useState(0);
  const [vehicleStatus, setVehicleStatus] = useState("AVAILABLE");
  const [stationName, setStationName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/vehicles/add", {
        capacity,
        vehicleStatus,
        stationName,
      });
      setMessage("Vehicle added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error adding vehicle");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white gr">
      <h1 className="text-2xl font-bold mb-4">Add Vehicle</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Capacity"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={vehicleStatus}
          onChange={(e) => setVehicleStatus(e.target.value)}
        >
          <option value="AVAILABLE">Available</option>
          <option value="IN_SERVICE">In Service</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
        <input
          className="w-full p-2 border rounded"
          placeholder="Station Name"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          required
        />
        <button className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}
