package com.example.esd_backend.service;

import com.example.esd_backend.dto.AnalyticsDTOs.*;
import com.example.esd_backend.repository.SolvedByRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import com.example.esd_backend.mapper.SolvedByMapper;

import java.util.List;

@Service
public class SolvedByService {
    
    @Autowired
    private SolvedByRepository solvedByRepository;

    @Autowired
    private SolvedByMapper solvedByMapper;

    @Cacheable(value = "SolvedByCache", 
               key = "#type + '-' + #day + '-' + #month + '-' + #year",
               unless = "#result == null || #result.isEmpty()")
    public List<ResponseTimeStatsDTO> getResponseTimeStatsByTypeDayMonth(
            String type, Integer day, Integer month, Integer year) {
        
        List<Object[]> rawResults;
        
        if (day != null && month != null && year != null) {
            rawResults = solvedByRepository.getResponseTimeStatsByTypeAndFullDate(type, day, month, year);
            return solvedByMapper.convertToDTOWithFullDate(rawResults);
        }
        
        if (month != null && year != null) {
            rawResults = solvedByRepository.getResponseTimeStatsByTypeAndMonth(type, month, year);
            return solvedByMapper.convertToDTOWithMonthYear(rawResults);
        }
        
        if (type != null) {
            rawResults = solvedByRepository.getResponseTimeStatsByType(type);
            return solvedByMapper.convertToDTOBasic(rawResults);
        }
        
        rawResults = solvedByRepository.getResponseTimeStatsByType(null);
        return solvedByMapper.convertToDTOBasic(rawResults);
    }
    public List<Integer> getAvailableYears() {
        return solvedByRepository.getAvailableYears();
    }

    public List<VehicleAnalyticsResponseDTO> getTop10VehiclesByAvgResponseTime(String stationType) {
        List<Object[]> rawResults = solvedByRepository.getTop10VehiclesByAvgResponseTime(stationType);
        return solvedByMapper.convertToVehicleAnalyticsDTO(rawResults);
    }

    public List<StationAnalyticsResponseDTO> getTop10StationsByAvgResponseTime(String stationType) {
        List<Object[]> rawResults = solvedByRepository.getTop10StationsByAvgResponseTime(stationType);
        return solvedByMapper.convertToStationAnalyticsDTO(rawResults);
    }

}