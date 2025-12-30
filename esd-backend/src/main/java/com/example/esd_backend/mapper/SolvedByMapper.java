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
            // Query returns: [max, min, avg]
            ResponseTimeStatsDTO dto = ResponseTimeStatsDTO.builder()
                .maxResponseTime(formatDuration(((Number) row[0]).doubleValue()))
                .minResponseTime(formatDuration(((Number) row[1]).doubleValue()))
                .avgResponseTime(formatDuration(((Number) row[2]).doubleValue()))
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public String formatDuration(double seconds) {
        if (seconds == 0) return "0s";
        
        double mins = seconds / 60.0;
        double hrs = mins / 60.0;
        double dys = hrs / 24.0;
        
        if (dys >= 1) {
            long d = (long) dys;
            long h = (long) (hrs % 24);
            long m = (long) (mins % 60);
            double s = seconds % 60;
            return String.format("%dd %dh %dm %.5fs", d, h, m, s);
        }
        if (hrs >= 1) {
            long h = (long) hrs;
            long m = (long) (mins % 60);
            double s = seconds % 60;
            return String.format("%dh %dm %.5fs", h, m, s);
        }
        if (mins >= 1) {
            long m = (long) mins;
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
                .avgResponseTime(formatDuration(((Number) row[5]).doubleValue()))
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
                .avgResponseTime(formatDuration(((Number) row[4]).doubleValue()))
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public List<TimeSeriesDataPointDTO> convertToTimeSeriesDTO(List<Object[]> rawResults) {
        List<TimeSeriesDataPointDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            TimeSeriesDataPointDTO dto = TimeSeriesDataPointDTO.builder()
                .date(row[0] != null ? row[0].toString() : null)
                .avgResponseTime(row[1] != null ? ((Number) row[1]).doubleValue() : null)
                .incidentCount(row[2] != null ? ((Number) row[2]).longValue() : null)
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    public List<TimeSeriesDataPointDTO> convertToTimeSeriesByTypeDTO(List<Object[]> rawResults) {
        List<TimeSeriesDataPointDTO> dtos = new ArrayList<>();
        
        for (Object[] row : rawResults) {
            TimeSeriesDataPointDTO dto = TimeSeriesDataPointDTO.builder()
                .date(row[0] != null ? row[0].toString() : null)
                .type(row[1] != null ? row[1].toString() : null)
                .avgResponseTime(row[2] != null ? ((Number) row[2]).doubleValue() : null)
                .build();
            
            dtos.add(dto);
        }
        
        return dtos;
    }

}
