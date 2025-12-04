export default function VehicleTable({ items, selectedId, onSelect }) {
  return (
    <div className="w-full max-w-6xl bg-black/60 rounded-3xl border border-red-600 p-4 shadow-xl backdrop-blur-lg overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="border-b border-red-600 text-red-400 uppercase tracking-wide">
            <th className="px-3 py-2 text-sm md:text-base">ID</th>
            <th className="px-3 py-2 text-sm md:text-base">Capacity</th>
            <th className="px-3 py-2 text-sm md:text-base">Status</th>
            <th className="px-3 py-2 text-sm md:text-base">Station</th>
            <th className="px-3 py-2 text-sm md:text-base">Type</th>
            <th className="px-3 py-2 text-sm md:text-base">Responder</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-400 py-4 text-sm">
                No vehicles found
              </td>
            </tr>
          ) : (
            items.map((v) => (
              <tr
                key={v.id}
                onClick={() => onSelect(v)}
                className={`cursor-pointer transition-all text-white ${
                  selectedId === v.id
                    ? "bg-blue-600/30 scale-[1.01]"
                    : "hover:bg-red-600/20"
                }`}
              >
                <td className="px-3 py-2 text-sm md:text-base">{v.id}</td>
                <td className="px-3 py-2 text-sm md:text-base">{v.capacity}</td>
                <td className="px-3 py-2 text-sm md:text-base">{v.vehicleStatus}</td>
                <td className="px-3 py-2 text-sm md:text-base">{v.stationName}</td>
                <td className="px-3 py-2 text-sm md:text-base">{v.vehicleType}</td>
                <td className="px-3 py-2 text-sm md:text-base">{v.responder || "None"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
