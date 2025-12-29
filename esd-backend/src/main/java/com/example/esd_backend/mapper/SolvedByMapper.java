package com.example.esd_backend.mapper;

import java.util.ArrayList;
import java.util.List;

import com.example.esd_backend.dto.AnalyticsDTOs.*;
import com.example.esd_backend.model.enums.*;
import org.springframework.stereotype.Component;

@Component
public class SolvedByMapper {
    public List<ResponseTimeStatsDTO> convertToDTOBasic(List<Object[]> rawResults) {
        List<ResponseTimeStatsDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            ResponseTimeStatsDTO dto = ResponseTimeStatsDTO.builder()
                .type((String) row[0])
                .maxResponseTime(formatDuration(((Number) row[1]).longValue()))
                .minResponseTime(formatDuration(((Number) row[2]).longValue()))
                .avgResponseTime(formatDuration(((Number) row[3]).longValue()))
                .totalIncidents(((Number) row[4]).longValue())
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public List<ResponseTimeStatsDTO> convertToDTOWithMonthYear(List<Object[]> rawResults) {
        List<ResponseTimeStatsDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            // Check if this is an aggregated result (5 elements instead of 7)
            if (row.length == 5) {
                // Aggregated: [type, max, min, avg, count]
                ResponseTimeStatsDTO dto = ResponseTimeStatsDTO.builder()
                    .type((String) row[0])
                    .maxResponseTime(formatDuration(((Number) row[1]).longValue()))
                    .minResponseTime(formatDuration(((Number) row[2]).longValue()))
                    .avgResponseTime(formatDuration(((Number) row[3]).longValue()))
                    .totalIncidents(((Number) row[4]).longValue())
                    .build();
                dtos.add(dto);
            } else {
                // Normal: [type, month, year, max, min, avg, count]
                ResponseTimeStatsDTO dto = ResponseTimeStatsDTO.builder()
                    .type((String) row[0])
                    .month(((Number) row[1]).intValue())
                    .year(((Number) row[2]).intValue())
                    .maxResponseTime(formatDuration(((Number) row[3]).longValue()))
                    .minResponseTime(formatDuration(((Number) row[4]).longValue()))
                    .avgResponseTime(formatDuration(((Number) row[5]).longValue()))
                    .totalIncidents(((Number) row[6]).longValue())
                    .build();
                dtos.add(dto);
            }
        }
        
        return dtos;
    }

    public List<ResponseTimeStatsDTO> convertToDTOWithFullDate(List<Object[]> rawResults) {
        List<ResponseTimeStatsDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            // Check if this is an aggregated result (5 elements instead of 8)
            if (row.length == 5) {
                // Aggregated: [type, max, min, avg, count]
                ResponseTimeStatsDTO dto = ResponseTimeStatsDTO.builder()
                    .type((String) row[0])
                    .maxResponseTime(formatDuration(((Number) row[1]).longValue()))
                    .minResponseTime(formatDuration(((Number) row[2]).longValue()))
                    .avgResponseTime(formatDuration(((Number) row[3]).longValue()))
                    .totalIncidents(((Number) row[4]).longValue())
                    .build();
                dtos.add(dto);
            } else {
                // Normal: [type, day, month, year, max, min, avg, count]
                ResponseTimeStatsDTO dto = ResponseTimeStatsDTO.builder()
                    .type((String) row[0])
                    .day(((Number) row[1]).intValue())
                    .month(((Number) row[2]).intValue())
                    .year(((Number) row[3]).intValue())
                    .maxResponseTime(formatDuration(((Number) row[4]).longValue()))
                    .minResponseTime(formatDuration(((Number) row[5]).longValue()))
                    .avgResponseTime(formatDuration(((Number) row[6]).longValue()))
                    .totalIncidents(((Number) row[7]).longValue())
                    .build();
                dtos.add(dto);
            }
        }
        
        return dtos;
    }

    public String formatDuration(long milliseconds) {
        if (milliseconds == 0) return "0s";
        
        double seconds = milliseconds / 1000.0;
        double minutes = seconds / 60.0;
        double hours = minutes / 60.0;
        double days = hours / 24.0;
        
        if (days >= 1) {
            long d = (long) days;
            long h = (long) (hours % 24);
            long m = (long) (minutes % 60);
            double s = seconds % 60;
            return String.format("%dd %dh %dm %.5fs", d, h, m, s);
        }
        if (hours >= 1) {
            long h = (long) hours;
            long m = (long) (minutes % 60);
            double s = seconds % 60;
            return String.format("%dh %dm %.5fs", h, m, s);
        }
        if (minutes >= 1) {
            long m = (long) minutes;
            double s = seconds % 60;
            return String.format("%dm %.5fs", m, s);
        }
        return String.format("%.5fs", seconds);
    }

    public List<StationAnalyticsResponseDTO> convertToStationAnalyticsDTO(List<Object[]> rawResults) {
        List<StationAnalyticsResponseDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            StationAnalyticsResponseDTO dto = StationAnalyticsResponseDTO.builder()
                .stationId(((Number) row[0]).intValue())
                .stationName((String) row[1])
                .stationType(StationType.valueOf((String) row[2]))
                .longitude(((Number) row[3]).doubleValue())
                .latitude(((Number) row[4]).doubleValue())
                .avgResponseTime(formatDuration(((Number) row[5]).longValue()))
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public List<VehicleAnalyticsResponseDTO> convertToVehicleAnalyticsDTO(List<Object[]> rawResults) {
        List<VehicleAnalyticsResponseDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            VehicleAnalyticsResponseDTO dto = VehicleAnalyticsResponseDTO.builder()
                .id(((Number) row[0]).intValue())
                .type(StationType.valueOf((String) row[1]))
                .capacity(((Number) row[2]).intValue())
                .driver_name((String) row[3])
                .avgResponseTime(formatDuration(((Number) row[4]).longValue()))
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public List<Object[]> aggregateRawResults(List<Object[]> rawResults, int maxIdx, int minIdx, int avgIdx, int countIdx) {
        if (rawResults == null || rawResults.isEmpty()) {
            return rawResults; // Return empty if no data
        }
        
        if (rawResults.size() == 1) {
            return rawResults; // Already single row, no need to aggregate
        }

        double maxVal = Double.NEGATIVE_INFINITY;
        double minVal = Double.POSITIVE_INFINITY;
        double sumAvg = 0;
        long totalCount = 0;

        for (Object[] row : rawResults) {
            if (row[maxIdx] == null || row[minIdx] == null || row[avgIdx] == null || row[countIdx] == null) {
                continue; // Skip null rows
            }
            
            double max = ((Number) row[maxIdx]).doubleValue();
            double min = ((Number) row[minIdx]).doubleValue();
            double avg = ((Number) row[avgIdx]).doubleValue();
            long count = ((Number) row[countIdx]).longValue();

            maxVal = Math.max(maxVal, max);
            minVal = Math.min(minVal, min);
            sumAvg += avg * count; // weighted average
            totalCount += count;
        }

        if (totalCount == 0) {
            return rawResults; // No data to aggregate, return original
        }

        double aggregatedAvg = sumAvg / totalCount;

        Object[] aggregated = new Object[5];
        aggregated[0] = "ALL"; // type
        aggregated[1] = (long) maxVal;
        aggregated[2] = (long) minVal;
        aggregated[3] = (long) aggregatedAvg;
        aggregated[4] = totalCount;

        List<Object[]> result = new ArrayList<>();
        result.add(aggregated);
        return result;
    }

}
