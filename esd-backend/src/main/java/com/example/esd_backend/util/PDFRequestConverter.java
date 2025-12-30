package com.example.esd_backend.util;


import com.example.esd_backend.mapper.SolvedByMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PDFRequestConverter {

    private static final SolvedByMapper mapper = new SolvedByMapper();

    public static class PDFRawData {
        public List<Object[]> stats;
        public List<Object[]> reportStats;
        public List<Object[]> vehicles;
        public List<Object[]> stations;

        public PDFRawData(List<Object[]> stats, List<Object[]> reportStats, List<Object[]> vehicles, List<Object[]> stations) {
            this.stats = stats;
            this.reportStats = reportStats;
            this.vehicles = vehicles;
            this.stations = stations;
        }
    }

    public static PDFRawData extractAndConvert(Map<String, Object> requestBody) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> statsData = (List<Map<String, Object>>) requestBody.get("stats");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> reportStatsData = (List<Map<String, Object>>) requestBody.get("reportStats");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> vehiclesData = (List<Map<String, Object>>) requestBody.get("vehicles");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> stationsData = (List<Map<String, Object>>) requestBody.get("stations");

        return new PDFRawData(
            statsToRaw(statsData),
            statsToRaw(reportStatsData),
            vehiclesToRaw(vehiclesData),
            stationsToRaw(stationsData)
        );
    }

    private static List<Object[]> statsToRaw(List<Map<String, Object>> statsData) {
        List<Object[]> data = new ArrayList<>();
        if (statsData == null) return data;
        for (Map<String, Object> stat : statsData) {
            // Response times are already formatted strings from frontend
            String minFormatted = stat.get("minResponseTime") != null ? stat.get("minResponseTime").toString() : "N/A";
            String maxFormatted = stat.get("maxResponseTime") != null ? stat.get("maxResponseTime").toString() : "N/A";
            String avgFormatted = stat.get("avgResponseTime") != null ? stat.get("avgResponseTime").toString() : "N/A";
            
            data.add(new Object[]{
                minFormatted,
                maxFormatted,
                avgFormatted
            });
        }
        return data;
    }

    private static List<Object[]> vehiclesToRaw(List<Map<String, Object>> vehiclesData) {
        List<Object[]> data = new ArrayList<>();
        if (vehiclesData == null) return data;
        for (Map<String, Object> vehicle : vehiclesData) {
            // avgResponseTime is already formatted string from frontend
            String avgFormatted = vehicle.get("avgResponseTime") != null ? vehicle.get("avgResponseTime").toString() : "N/A";
            data.add(new Object[]{
                vehicle.get("id") != null ? ((Number) vehicle.get("id")).intValue() : 0,
                vehicle.get("type") != null ? vehicle.get("type") : "N/A",
                vehicle.get("capacity") != null ? ((Number) vehicle.get("capacity")).intValue() : 0,
                vehicle.get("driver_name") != null ? vehicle.get("driver_name") : "N/A",
                avgFormatted
            });
        }
        return data;
    }

    private static List<Object[]> stationsToRaw(List<Map<String, Object>> stationsData) {
        List<Object[]> data = new ArrayList<>();
        if (stationsData == null) return data;
        for (Map<String, Object> station : stationsData) {
            // avgResponseTime is already formatted string from frontend
            String avgFormatted = station.get("avgResponseTime") != null ? station.get("avgResponseTime").toString() : "N/A";
            data.add(new Object[]{
                station.get("stationId") != null ? ((Number) station.get("stationId")).intValue() : 0,
                station.get("stationName") != null ? station.get("stationName") : "N/A",
                station.get("stationType") != null ? station.get("stationType") : "N/A",
                station.get("latitude") != null ? String.format("%.4f", ((Number) station.get("latitude")).doubleValue()) : "0.0",
                station.get("longitude") != null ? String.format("%.4f", ((Number) station.get("longitude")).doubleValue()) : "0.0",
                avgFormatted
            });
        }
        return data;
    }

    public static ArrayList<String> createVehicleHeaders() {
        ArrayList<String> headers = new ArrayList<>();
        headers.add("Vehicle ID");
        headers.add("Type");
        headers.add("Capacity");
        headers.add("Driver Name");
        headers.add("Avg Response Time (sec)");
        return headers;
    }

    public static ArrayList<String> createStationHeaders() {
        ArrayList<String> headers = new ArrayList<>();
        headers.add("Station ID");
        headers.add("Station Name");
        headers.add("Type");
        headers.add("Latitude");
        headers.add("Longitude");
        headers.add("Avg Response Time (sec)");
        return headers;
    }
}
