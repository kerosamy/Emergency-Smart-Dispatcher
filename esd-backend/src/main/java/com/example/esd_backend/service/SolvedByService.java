package com.example.esd_backend.service;

import com.example.esd_backend.dto.AnalyticsDTOs.*;
import com.example.esd_backend.repository.SolvedByRepository;
import com.example.esd_backend.util.PDFRequestConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.esd_backend.mapper.PDFGenerator;
import com.example.esd_backend.mapper.SolvedByMapper;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
        
        List<Object[]> rawResults = solvedByRepository.getResponseTimeStatsByTypeAndFullDate(type, day, month, year);
        return solvedByMapper.convertToDTOBasic(rawResults);
    }

    public List<ResponseTimeStatsDTO> getReportTimeStatsByTypeDayMonth(
            String type, Integer day, Integer month, Integer year) {
        
        List<Object[]> rawResults = solvedByRepository.getReportTimeStats(type, day, month, year);
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

    public ByteArrayInputStream generatePDFFromRequest(Map<String, Object> requestBody) {
        PDFRequestConverter.PDFRawData data = PDFRequestConverter.extractAndConvert(requestBody);
        return PDFGenerator.generateStatisticsPDF("Analytics Report",
            data.stats, data.reportStats, data.vehicles, data.stations,
            PDFRequestConverter.createVehicleHeaders(),
            PDFRequestConverter.createStationHeaders());
    }

}