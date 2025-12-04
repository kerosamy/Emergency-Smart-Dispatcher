// src/Components/IncidentTable.jsx
export default function IncidentTable({ items, selectedId, onSelect }) {
  return (
    <div className="w-full max-w-6xl bg-black/60 rounded-3xl border border-red-600 p-4 shadow-xl backdrop-blur-lg overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="border-b border-red-600 text-red-400 uppercase tracking-wide">
            <th className="px-3 py-2 text-sm md:text-base">ID</th>
            <th className="px-3 py-2 text-sm md:text-base">Reporter</th>
            <th className="px-3 py-2 text-sm md:text-base">Type</th>
            <th className="px-3 py-2 text-sm md:text-base">Severity</th>
            <th className="px-3 py-2 text-sm md:text-base">Location</th>
            <th className="px-3 py-2 text-sm md:text-base">Status</th>
            <th className="px-3 py-2 text-sm md:text-base">Capacity</th>
            <th className="px-3 py-2 text-sm md:text-base">Reported At</th>
            <th className="px-3 py-2 text-sm md:text-base">Assigned Vehicles</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center text-gray-400 py-4 text-sm">
                No incidents found
              </td>
            </tr>
          ) : (
            items.map((inc) => (
              <tr
                key={inc.id}
                onClick={() => onSelect(inc)}
                className={`cursor-pointer transition-all text-white ${
                  selectedId === inc.id
                    ? "bg-blue-600/30 scale-[1.01]"
                    : "hover:bg-red-600/20"
                }`}
              >
                <td className="px-3 py-2 text-sm md:text-base">{inc.id}</td>
                <td className="px-3 py-2 text-sm md:text-base">{inc.reporterName} ({inc.reporterId})</td>
                <td className="px-3 py-2 text-sm md:text-base">{inc.type}</td>
                <td className="px-3 py-2 text-sm md:text-base">{inc.severity}</td>
                <td className="px-3 py-2 text-sm md:text-base">
                  {inc.latitude.toFixed(5)}, {inc.longitude.toFixed(5)}
                </td>
                <td className="px-3 py-2 text-sm md:text-base">{inc.status}</td>
                <td className="px-3 py-2 text-sm md:text-base">{inc.capacity}</td>
                <td className="px-3 py-2 text-sm md:text-base">{new Date(inc.reportTime).toLocaleString()}</td>
                <td className="px-3 py-2 text-sm md:text-base">{inc.assignedVehicleCount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
