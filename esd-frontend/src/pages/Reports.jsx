import { useEffect, useState } from "react";
import ReportService from "../services/ReportService";

export default function Reports() {
  // Filter states
  const [selectedType, setSelectedType] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);

  // Data states
  const [statsData, setStatsData] = useState(null);
  const [reportTimeStats, setReportTimeStats] = useState(null);
  const [top10Vehicles, setTop10Vehicles] = useState([]);
  const [top10Stations, setTop10Stations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  const incidentTypes = ["FIRE", "MEDICAL", "CRIME"];

  // Initialize available years
  useEffect(() => {
    fetchAvailableYears();
  }, []);

  const fetchAvailableYears = async () => {
    try {
      const years = await ReportService.getAvailableYears();
      setAvailableYears(years.sort((a, b) => b - a));
    } catch (err) {
      console.error("Error fetching available years:", err);
    }
  };

  // Get number of days in selected month
  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 0;
    return new Date(year, month, 0).getDate();
  };

  const maxDays = getDaysInMonth(parseInt(selectedMonth), parseInt(selectedYear));

  // Map incident type to station/vehicle type
  const mapIncidentTypeToStationType = (incidentType) => {
    if (!incidentType) return null;
    if (incidentType === "CRIME") return "POLICE";
    return incidentType; // FIRE -> FIRE, MEDICAL -> MEDICAL
  };

  // Fetch stats and lists
  useEffect(() => {
    fetchData();
  }, [selectedType, selectedDay, selectedMonth, selectedYear]);

  const fetchData = async () => {
    // Don't fetch if day is selected without month/year
    if (selectedDay && (!selectedMonth || !selectedYear)) return;
    // Don't fetch if month is selected without year
    if (selectedMonth && !selectedYear) return;

    setLoading(true);
    setError("");
    try {
      // Fetch both response time and report time stats
      const responseStats = await ReportService.getResponseTimeStats(
        selectedType || undefined,
        selectedDay ? parseInt(selectedDay) : undefined,
        selectedMonth ? parseInt(selectedMonth) : undefined,
        selectedYear ? parseInt(selectedYear) : undefined
      );
      setStatsData(responseStats);

      try {
        const reportStats = await ReportService.getReportTimeStats(
          selectedType || undefined,
          selectedDay ? parseInt(selectedDay) : undefined,
          selectedMonth ? parseInt(selectedMonth) : undefined,
          selectedYear ? parseInt(selectedYear) : undefined
        );
        setReportTimeStats(reportStats);
      } catch (reportErr) {
        console.error("Error fetching report time stats:", reportErr);
        setReportTimeStats(null);
      }

      // Fetch top 10 lists
      if (selectedType) {
        // If specific type selected, fetch for that type (map CRIME to POLICE)
        const stationType = mapIncidentTypeToStationType(selectedType);
        const vehicles = await ReportService.getTop10Vehicles(stationType);
        const stations = await ReportService.getTop10Stations(stationType);
        setTop10Vehicles(vehicles);
        setTop10Stations(stations);
      } else {
        // If "All Types" selected, fetch with null to get all types
        try {
          const vehicles = await ReportService.getTop10Vehicles(null);
          const stations = await ReportService.getTop10Stations(null);
          setTop10Vehicles(vehicles);
          setTop10Stations(stations);
        } catch (err) {
          console.error("Error fetching top 10 data for all types:", err);
          setTop10Vehicles([]);
          setTop10Stations([]);
        }
      }
    } catch (err) {
      setError("Error fetching reports data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Extract stats from response
  const getStats = () => {
    if (!statsData) return null;
    if (Array.isArray(statsData) && statsData.length > 0) {
      return statsData[0]; // Return first (only) element
    }
    if (statsData.maxResponseTime !== undefined) {
      return statsData;
    }
    return null;
  };

  const getReportStats = () => {
    if (!reportTimeStats) return null;
    if (Array.isArray(reportTimeStats) && reportTimeStats.length > 0) {
      return reportTimeStats[0]; // Return first (only) element
    }
    if (reportTimeStats.maxResponseTime !== undefined) {
      return reportTimeStats;
    }
    return null;
  };

  const stats = getStats();
  const reportStats = getReportStats();

  const handleExportPDF = async () => {
    if (!statsData || !top10Vehicles || !top10Stations) {
      alert("No data available to export");
      return;
    }
    
    try {
      setExportLoading(true);
      await ReportService.exportPDFReport(statsData, reportTimeStats, top10Vehicles, top10Stations);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert("Failed to export PDF");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-black overflow-hidden flex flex-col justify-start items-center p-6">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-blue-900"></div>
      <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-700 rounded-full filter blur-[200px] opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-700 rounded-full filter blur-[200px] opacity-50 animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-red-400 mb-8 animate-pulse">
          Reports & Analytics
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-300 text-center font-semibold">
            {error}
          </div>
        )}

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-black/60 backdrop-blur-lg p-6 rounded-2xl border border-red-500/30">
          {/* Type Filter */}
          <div className="flex flex-col">
            <label htmlFor="type-filter" className="text-red-300 font-semibold mb-2 text-sm">
              Incident Type
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setTop10Vehicles([]);
                setTop10Stations([]);
              }}
              className="p-3 rounded-xl bg-black/50 border border-red-500/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            >
              <option value="">All Types</option>
              {incidentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col">
            <label htmlFor="year-filter" className="text-red-300 font-semibold mb-2 text-sm">
              Year
            </label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedDay("");
              }}
              className="p-3 rounded-xl bg-black/50 border border-red-500/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            >
              <option value="">Select Year</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex flex-col">
            <label htmlFor="month-filter" className="text-red-300 font-semibold mb-2 text-sm">
              Month
            </label>
            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDay("");
              }}
              disabled={!selectedYear}
              className="p-3 rounded-xl bg-black/50 border border-red-500/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(0, month - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* Day Filter */}
          <div className="flex flex-col">
            <label htmlFor="day-filter" className="text-red-300 font-semibold mb-2 text-sm">
              Day
            </label>
            <select
              id="day-filter"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              disabled={!selectedMonth || !selectedYear}
              className="p-3 rounded-xl bg-black/50 border border-red-500/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Day</option>
              {Array.from({ length: maxDays }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Button */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={handleExportPDF}
            disabled={exportLoading || !statsData || !top10Vehicles.length || !top10Stations.length}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition transform hover:scale-105 active:scale-95"
          >
            {exportLoading ? "Generating PDF..." : "Export PDF Report"}
          </button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center text-white/60 py-12 text-lg">Loading data...</div>
        ) : stats || reportStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Fastest Response Time */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-red-500/50 rounded-2xl p-8 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition transform hover:-translate-y-1">
              <h3 className="text-red-300 font-semibold text-lg mb-3">
                Fastest Response Time
              </h3>
              <p className="text-3xl font-extrabold text-green-400">
                {stats?.minResponseTime || "N/A"}
              </p>
            </div>

            {/* Average Response Time */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-red-500/50 rounded-2xl p-8 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition transform hover:-translate-y-1">
              <h3 className="text-red-300 font-semibold text-lg mb-3">
                Average Response Time
              </h3>
              <p className="text-3xl font-extrabold text-blue-400">
                {stats?.avgResponseTime || "N/A"}
              </p>
            </div>

            {/* Slowest Response Time */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-red-500/50 rounded-2xl p-8 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition transform hover:-translate-y-1">
              <h3 className="text-red-300 font-semibold text-lg mb-3">
                Slowest Response Time
              </h3>
              <p className="text-3xl font-extrabold text-red-200">
                {stats?.maxResponseTime || "N/A"}
              </p>
            </div>


            {/* Fastest Report Time */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-blue-500/50 rounded-2xl p-8 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition transform hover:-translate-y-1">
              <h3 className="text-blue-300 font-semibold text-lg mb-3">
                Fastest Assignment Time
              </h3>
              <p className="text-3xl font-extrabold text-green-400">
                {reportStats?.minResponseTime || "N/A"}
              </p>
            </div>


            {/* Average Report Time */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-blue-500/50 rounded-2xl p-8 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition transform hover:-translate-y-1">
              <h3 className="text-blue-300 font-semibold text-lg mb-3">
                Average Assignment Time
              </h3>
              <p className="text-3xl font-extrabold text-blue-400">
                {reportStats?.avgResponseTime || "N/A"}
              </p>
            </div>


            <div className="bg-black/60 backdrop-blur-lg border-2 border-purple-500/50 rounded-2xl p-8 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition transform hover:-translate-y-1">
              <h3 className="text-purple-300 font-semibold text-lg mb-3">
                Slowest Assignment Time
              </h3>
              <p className="text-3xl font-extrabold text-purple-400">
                {reportStats?.maxResponseTime || "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/60 py-12 bg-black/40 rounded-xl mb-12">
            No data available for the selected filters
          </div>
        )}

        {/* Top 10 Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top 10 Vehicles */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-red-500/30 rounded-2xl p-6 overflow-hidden">
              <h2 className="text-2xl font-bold text-red-400 mb-6 border-b border-red-500/30 pb-4">
                Top 10 Vehicles
              </h2>
              {loading ? (
                <div className="text-center text-white/60 py-8">Loading vehicles...</div>
              ) : top10Vehicles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-red-500/30">
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Rank
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          ID
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Capacity
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Driver
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Avg Response
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {top10Vehicles.map((vehicle, index) => (
                        <tr
                          key={vehicle.id}
                          className="border-b border-red-500/20 hover:bg-red-500/10 transition"
                        >
                          <td className="py-3 px-2 text-white/80">{index + 1}</td>
                          <td className="py-3 px-2 text-white/80">{vehicle.id}</td>
                          <td className="py-3 px-2 text-white/80">{vehicle.capacity}</td>
                          <td className="py-3 px-2 text-white/80">
                            {vehicle.driver_name || "Unassigned"}
                          </td>
                          <td className="py-3 px-2 text-blue-400 font-semibold">
                            {vehicle.avgResponseTime || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-white/60 py-8">No vehicle data available</p>
              )}
            </div>

            {/* Top 10 Stations */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-red-500/30 rounded-2xl p-6 overflow-hidden">
              <h2 className="text-2xl font-bold text-red-400 mb-6 border-b border-red-500/30 pb-4">
                Top 10 Stations
              </h2>
              {loading ? (
                <div className="text-center text-white/60 py-8">Loading stations...</div>
              ) : top10Stations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-red-500/30">
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Rank
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Name
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Type
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Lat
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Lon
                        </th>
                        <th className="text-left py-3 px-2 text-red-300 font-semibold">
                          Avg Response
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {top10Stations.map((station, index) => (
                        <tr
                          key={station.stationId}
                          className="border-b border-red-500/20 hover:bg-red-500/10 transition"
                        >
                          <td className="py-3 px-2 text-white/80">{index + 1}</td>
                          <td className="py-3 px-2 text-white/80">{station.stationName}</td>
                          <td className="py-3 px-2 text-white/80">{station.stationType}</td>
                          <td className="py-3 px-2 text-white/80">
                            {station.latitude?.toFixed(4)}
                          </td>
                          <td className="py-3 px-2 text-white/80">
                            {station.longitude?.toFixed(4)}
                          </td>
                          <td className="py-3 px-2 text-blue-400 font-semibold">
                            {station.avgResponseTime || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-white/60 py-8">No station data available</p>
              )}
            </div>
          </div>

      </div>
    </div>
  );
}
