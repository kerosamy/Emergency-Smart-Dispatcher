package com.example.esd_backend.controller;

import com.example.esd_backend.dto.AnalyticsDTOs.*;
import com.example.esd_backend.service.SolvedByService;
import com.example.esd_backend.util.PDFRequestConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/analytics")
public class SolvedByController {
    
    @Autowired
    private SolvedByService analyticsService;

    @GetMapping("/response-time-stats")
    public ResponseEntity<?> getResponseTimeStats(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer day,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        
        if (day != null && (month == null || year == null)) {
            return ResponseEntity.badRequest()
                .body("Day filter requires both month and year to be specified");
        }
        
        if (month != null && year == null) {
            return ResponseEntity.badRequest()
                .body("Month filter requires year to be specified");
        }

        try {
            List<ResponseTimeStatsDTO> results = analyticsService
                .getResponseTimeStatsByTypeDayMonth(type, day, month, year);
            
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching analytics: " + e.getMessage());
        }
    }

    @GetMapping("/available-years")
    public ResponseEntity<?> getAvailableYears() {
        try {
            List<Integer> years = analyticsService.getAvailableYears();
            return ResponseEntity.ok(years);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching available years: " + e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAnalytics() {
        return ResponseEntity.ok()
            .body("Analytics will be refreshed on next request");
    }

    @GetMapping("/Top10Vehicles")
    public ResponseEntity<?> getTop10Vehicles() {
        try {
            List<VehicleAnalyticsResponseDTO> results = analyticsService.getTop10VehiclesByAvgResponseTime(null);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching top 10 vehicles: " + e.getMessage());
        }
    }

    @GetMapping("/Top10Vehicles/{stationType}")
    public ResponseEntity<?> getTop10VehiclesByAvgResponseTime(@PathVariable("stationType") String stationType) {
        try {
            List<VehicleAnalyticsResponseDTO> results = analyticsService.getTop10VehiclesByAvgResponseTime(stationType);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching top 10 vehicles: " + e.getMessage());
        }
    }

    @GetMapping("/Top10Stations")
    public ResponseEntity<?> getTop10Stations() {
        try {
            List<StationAnalyticsResponseDTO> results = analyticsService.getTop10StationsByAvgResponseTime(null);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching top 10 stations: " + e.getMessage());
        }
    }

    @GetMapping("/Top10Stations/{stationType}")
    public ResponseEntity<?> getTop10StationsByAvgResponseTime(@PathVariable("stationType") String stationType) {
        try {
            List<StationAnalyticsResponseDTO> results = analyticsService.getTop10StationsByAvgResponseTime(stationType);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching top 10 stations: " + e.getMessage());
        }
    }

    @PostMapping("/export-pdf")
    public ResponseEntity<?> exportReportPDF(@RequestBody Map<String, Object> requestBody) {
        try {
            ByteArrayInputStream pdf = analyticsService.generatePDFFromRequest(requestBody);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=analytics-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error generating PDF: " + e.getMessage());
        }
    }
}