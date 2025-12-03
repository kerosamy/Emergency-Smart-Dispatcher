// src/pages/AddIncident.jsx
import { useState } from "react";
import axios from "axios";

export default function AddIncident() {
  const [reporterId, setReporterId] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState(1);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [status, setStatus] = useState("REPORTED");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/incidents/add", {
        reporterId,
        type,
        severity,
        latitude,
        longitude,
        status,
      });
      setMessage("Incident reported successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error reporting incident");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Report Incident</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Reporter ID"
          type="number"
          value={reporterId}
          onChange={(e) => setReporterId(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Severity"
          type="number"
          min="1"
          max="5"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Latitude"
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Longitude"
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="REPORTED">REPORTED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        <button className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800">
          Report Incident
        </button>
      </form>
    </div>
  );
}
