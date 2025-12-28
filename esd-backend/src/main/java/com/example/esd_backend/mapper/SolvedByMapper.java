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
                .maxResponseTime(((Number) row[1]).longValue())
                .minResponseTime(((Number) row[2]).longValue())
                .avgResponseTime(((Number) row[3]).doubleValue())
                .totalIncidents(((Number) row[4]).longValue())
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public List<ResponseTimeStatsDTO> convertToDTOWithMonthYear(List<Object[]> rawResults) {
        List<ResponseTimeStatsDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            ResponseTimeStatsDTO dto = ResponseTimeStatsDTO.builder()
                .type((String) row[0])
                .month(((Number) row[1]).intValue())
                .year(((Number) row[2]).intValue())
                .maxResponseTime(((Number) row[3]).longValue())
                .minResponseTime(((Number) row[4]).longValue())
                .avgResponseTime(((Number) row[5]).doubleValue())
                .totalIncidents(((Number) row[6]).longValue())
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public List<ResponseTimeStatsDTO> convertToDTOWithFullDate(List<Object[]> rawResults) {
        List<ResponseTimeStatsDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            ResponseTimeStatsDTO dto = ResponseTimeStatsDTO.builder()
                .type((String) row[0])
                .day(((Number) row[1]).intValue())
                .month(((Number) row[2]).intValue())
                .year(((Number) row[3]).intValue())
                .maxResponseTime(((Number) row[4]).longValue())
                .minResponseTime(((Number) row[5]).longValue())
                .avgResponseTime(((Number) row[6]).doubleValue())
                .totalIncidents(((Number) row[7]).longValue())
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public String formatDuration(long seconds) {
        if (seconds < 0) {
            return "Invalid duration";
        }
        
        long days = seconds / 86400;
        long hours = (seconds % 86400) / 3600;
        long minutes = (seconds % 3600) / 60;
        long secs = seconds % 60;
        
        StringBuilder result = new StringBuilder();
        
        if (days > 0) {
            result.append(days).append(" day").append(days > 1 ? "s" : "");
            if (hours > 0) {
                result.append(", ").append(hours).append(" hour").append(hours > 1 ? "s" : "");
            }
        } else if (hours > 0) {
            result.append(hours).append(" hour").append(hours > 1 ? "s" : "");
            if (minutes > 0) {
                result.append(", ").append(minutes).append(" minute").append(minutes > 1 ? "s" : "");
            }
        } else if (minutes > 0) {
            result.append(minutes).append(" minute").append(minutes > 1 ? "s" : "");
            if (secs > 0) {
                result.append(", ").append(secs).append(" second").append(secs > 1 ? "s" : "");
            }
        } else {
            result.append(secs).append(" second").append(secs > 1 ? "s" : "");
        }
        
        return result.toString();
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
                .avgResponseTime(((Number) row[5]).doubleValue())
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
                .avgResponseTime(((Number) row[4]).doubleValue())
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

}
