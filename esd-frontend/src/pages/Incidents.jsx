import { useEffect, useState } from "react";
import IncidentService from "../services/IncidentService";
  
const IncidentCard = ({ incident }) => {
  const getTypeColor = (type) => {
    switch(type) {
      case "FIRE": return "bg-red-900/30 text-red-400 border-red-600";
      case "MEDICAL": return "bg-blue-900/30 text-blue-400 border-blue-600";
      case "CRIME": return "bg-purple-900/30 text-purple-400 border-purple-600";
      default: return "bg-gray-900/30 text-gray-400 border-gray-600";
    }
  };

  const timeSinceReport = () => {
    if (!incident.reportTime) return "N/A";
    const now = new Date();
    const reported = new Date(incident.reportTime);
    const diff = Math.floor((now - reported) / 1000 / 60);
    
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;
    
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="p-4 border border-red-900/50 rounded-xl hover:border-red-600 transition-all bg-black/40 backdrop-blur-sm mb-3 hover:shadow-lg hover:shadow-red-900/20">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-white">ID: {incident.id}</span>
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTypeColor(incident.type)}`}>
          {incident.type}
        </span>
      </div>
      <div className="text-sm text-gray-400 space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-red-400">Severity:</span>
          <span className="text-white">
            {incident.severity ? "⭐".repeat(incident.severity) : "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-red-400">Lat:</span>
          <span className="text-white">{incident.latitude?.toFixed(4) || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-red-400">Long:</span>
          <span className="text-white">{incident.longitude?.toFixed(4) || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-red-400">Vehicles:</span>
          <span className="text-white">{incident.assignedVehicleCount || 0}/{incident.capacity || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-red-400">Reported:</span>
          <span className="text-xs text-gray-300">{timeSinceReport()}</span>
        </div>
      </div>
    </div>
  );
};

const IncidentSection = ({ title, incidents, gradientFrom, gradientTo, count }) => {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4 rounded-t-xl font-bold flex items-center justify-between shadow-lg border-b-2 border-red-900/50 flex-shrink-0`}>
        <span className="text-white text-lg">{title}</span>
        <span className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white border border-white/20">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-black via-gray-900 to-black rounded-b-xl border border-red-900/30 min-h-0">
        {incidents.length === 0 ? (
          <div className="text-center text-gray-600 py-8 text-sm">
            No incidents
          </div>
        ) : (
          incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))
        )}
      </div>
    </div>
  );
};

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching incidents...");
    
    const fetchIncidents = async () => {
      try {
        const data = await IncidentService.getAllIncidents();
        console.log("Fetched data:", data);
        console.log("Fetched data:", data);
        console.log("First incident:", data[0]); // See the structure
        console.log("Status of first:", data[0]?.status); // See exact status value
        setIncidents(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setError(err.message || "Failed to fetch incidents");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter incidents by category
  const resolvedIncidents = incidents.filter(i => i.status === "resolved");
  const dispatchedIncidents = incidents.filter(i => i.status === "dispatched");
  const waitingIncidents = incidents.filter(i => i.status === "reported");
  
  // Waiting incidents that exceeded 2 minutes
  const exceededIncidents = waitingIncidents.filter(i => {
    if (!i.reportTime) return false;
    const reportTime = new Date(i.reportTime);
    const now = new Date();
    const diffMinutes = (now - reportTime) / 1000 / 60;
    return diffMinutes > 2;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-xl text-red-400 animate-pulse">Loading incidents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="text-xl text-red-400 mb-4">⚠️ Error Loading Incidents</div>
        <div className="text-gray-400">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-blue-900"></div>
      <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-700 rounded-full filter blur-[200px] opacity-50 animate-ping-slow"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-700 rounded-full filter blur-[200px] opacity-50 animate-ping-slow-delayed"></div>

      {/* Content */}
      <div className="relative z-10 h-full p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">
            Incident Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time incident monitoring system • {incidents.length} total incidents
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
          <IncidentSection
            title="✅ Resolved"
            incidents={resolvedIncidents}
            gradientFrom="from-green-900"
            gradientTo="to-green-700"
            count={resolvedIncidents.length}
          />
          
          <IncidentSection
            title="🚨 Dispatched"
            incidents={dispatchedIncidents}
            gradientFrom="from-blue-900"
            gradientTo="to-blue-700"
            count={dispatchedIncidents.length}
          />
          
          <IncidentSection
            title="⏳ Waiting"
            incidents={waitingIncidents}
            gradientFrom="from-yellow-900"
            gradientTo="to-yellow-700"
            count={waitingIncidents.length}
          />
          
          <IncidentSection
            title="🔥 Exceeded 2 Min"
            incidents={exceededIncidents}
            gradientFrom="from-red-900"
            gradientTo="to-red-700"
            count={exceededIncidents.length}
          />
        </div>
      </div>

      <style>{`
        @keyframes ping-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animate-ping-slow { 
          animation: ping-slow 3s infinite; 
        }
        .animate-ping-slow-delayed { 
          animation: ping-slow 3s infinite 1.5s; 
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 68, 68, 0.7);
        }
      `}</style>
    </div>
  );
}