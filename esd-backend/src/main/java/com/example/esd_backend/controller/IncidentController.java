package com.example.esd_backend.controller;

import com.example.esd_backend.dto.incidentDTOs.*;
import com.example.esd_backend.service.IncidentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {
    
    private static final Logger logger = LoggerFactory.getLogger(IncidentController.class);
    
    @Autowired
    private IncidentService incidentService;
        
    @PostMapping
    public ResponseEntity<IncidentResponseDto> reportIncident(@RequestBody IncidentRequestDto request) {
        try {
            logger.info("Received incident report request: {}", request);
            IncidentResponseDto response = incidentService.reportIncident(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error creating incident: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
        
    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponseDto> getIncidentById(@PathVariable Long id) {
        try {
            IncidentResponseDto response = incidentService.getIncidentById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<IncidentResponseDto>> getAllIncidents() {
        List<IncidentResponseDto> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<IncidentResponseDto>> getIncidentsByStatus(@PathVariable String status) {
        try {
            List<IncidentResponseDto> incidents = incidentService.getIncidentsByStatus(status);
            return ResponseEntity.ok(incidents);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<IncidentResponseDto>> getIncidentsByType(@PathVariable String type) {
        try {
            List<IncidentResponseDto> incidents = incidentService.getIncidentsByType(type);
            return ResponseEntity.ok(incidents);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/location")
    public ResponseEntity<List<IncidentResponseDto>> getIncidentsByLocation(
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        List<IncidentResponseDto> incidents = incidentService.getIncidentsByLocation(latitude, longitude);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/location-name/{locationName}")
    public ResponseEntity<List<IncidentResponseDto>> getIncidentsByLocationName(
            @PathVariable String locationName) {
        List<IncidentResponseDto> incidents = incidentService.getIncidentsByLocationName(locationName);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/unassigned")
    public ResponseEntity<List<IncidentResponseDto>> getUnassignedIncidents() {
        List<IncidentResponseDto> incidents = incidentService.getUnassignedIncidents();
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<IncidentResponseDto>> getActiveIncidents() {
        List<IncidentResponseDto> incidents = incidentService.getActiveIncidents();
        return ResponseEntity.ok(incidents);
    }
        
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateIncident(
            @PathVariable Long id,
            @RequestBody UpdateIncidentDto request) {
        try {
            incidentService.updateIncident(id, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PostMapping("/{incidentId}/assign/{vehicleId}")
    public ResponseEntity<AssignVehicleResponseDto> assignVehicleToIncident(
            @PathVariable Long incidentId,
            @PathVariable Long vehicleId) {
        AssignVehicleResponseDto response = incidentService.assignVehicleToIncident(incidentId, vehicleId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @GetMapping("/reporter/{reporterId}")
    public ResponseEntity<List<IncidentResponseDto>> getIncidentsByReporter(@PathVariable Long reporterId) {
        List<IncidentResponseDto> incidents = incidentService.getIncidentsByReporter(reporterId);
        return ResponseEntity.ok(incidents);
    }
        
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countIncidentsByStatus(@PathVariable String status) {
        try {
            Long count = incidentService.countIncidentsByStatus(status);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/count/type/{type}")
    public ResponseEntity<Long> countIncidentsByType(@PathVariable String type) {
        try {
            Long count = incidentService.countIncidentsByType(type);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
        
    @PatchMapping("/{id}/arrival")
    public ResponseEntity<Void> confirmArrival(
            @PathVariable Long id,
            @RequestBody ConfirmArrivalRequestDTO request) {
        try {
            incidentService.confirmArrival(id, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Void> resolveIncident(
            @PathVariable Long id,
            @RequestBody ConfirmSolutionRequestDTO request) {
        try {
            incidentService.resolveIncident(id, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
        
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        try {
            incidentService.deleteIncident(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}