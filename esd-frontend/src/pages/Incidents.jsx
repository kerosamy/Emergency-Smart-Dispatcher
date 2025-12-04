import { useEffect, useState } from "react";
import IncidentService from "../services/IncidentService";
import IncidentTable from "../Components/IncidentTable";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState(1);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState(0);

  // Track if we are editing
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = () => {
    IncidentService.getAllIncidents()
      .then((data) => setIncidents(data))
      .catch((err) => console.error(err));
  };

  // Row click opens modal in edit mode
  const handleRowClick = (incident) => {
    setSelectedIncident(incident);
    setIsEditing(true);
    setShowModal(true);
  };

  // Add new incident
  const handleAddIncident = async (e) => {
    e.preventDefault();
    try {
      await IncidentService.addIncident({
        type,
        severity: parseInt(severity),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: "REPORTED",
        capacity: parseInt(capacity),
      });
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  // Update incident status
  const handleUpdateIncident = async () => {
    if (!selectedIncident) return;

    const dto = { status: selectedIncident.status };
    try {
      if (dto.status === "DISPATCHED") {
        await IncidentService.confirmArrival(selectedIncident.id);
      } else if (dto.status === "RESOLVED") {
        await IncidentService.resolveIncident(selectedIncident.id);
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedIncident(null);
    setType("");
    setSeverity(1);
    setLatitude("");
    setLongitude("");
    setCapacity(0);
    loadIncidents();
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden flex flex-col justify-start items-center p-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-blue-900"></div>
      <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-700 rounded-full filter blur-[200px] opacity-50 animate-ping-slow"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-700 rounded-full filter blur-[200px] opacity-50 animate-ping-slow delay-500"></div>

      {/* Table */}
      <div className="relative z-10 w-full max-w-6xl">
        <IncidentTable
          items={incidents}
          selectedId={selectedIncident?.id}
          onSelect={handleRowClick} // <-- use handleRowClick here
        />
      </div>

      {/* Add Incident Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-xl font-bold text-lg"
      >
        + Add Incident
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-black/80 border border-red-600 rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold text-center text-red-400 mb-6">
              {isEditing ? "Edit Incident Status" : "Add Incident"}
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <select
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  value={selectedIncident.status}
                  onChange={(e) =>
                    setSelectedIncident({
                      ...selectedIncident,
                      status: e.target.value,
                    })
                  }
                  required
                >
                  <option value="REPORTED">Reported</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <button
                  onClick={handleUpdateIncident}
                  className="w-full py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
                >
                  Update Status
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl mt-2 border border-gray-500 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleAddIncident}>
                {/* Type */}
                <select
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Incident Type
                  </option>
                  <option value="FIRE">Fire</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="CRIME">Crime</option>
                </select>
                {/* Severity */}
                <input
                  type="number"
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  placeholder="Severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  min={1}
                  max={5}
                  required
                />
                {/* Latitude */}
                <input
                  type="number"
                  step="0.00001"
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />
                {/* Longitude */}
                <input
                  type="number"
                  step="0.00001"
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
                {/* Capacity */}
                <input
                  type="number"
                  className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white"
                  placeholder="Capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
                <button className="w-full py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white">
                  Add Incident
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl mt-2 border border-gray-500 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}

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
