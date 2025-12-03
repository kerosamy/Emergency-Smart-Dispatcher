package com.example.esd_backend.controller;

import com.example.esd_backend.dto.incidentDTOs.*;
import com.example.esd_backend.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {
    
    
    @Autowired
    private IncidentService incidentService;
        
    @PostMapping
    public ResponseEntity<Void> reportIncident(@RequestBody IncidentRequestDto request) {
        try {
            incidentService.reportIncident(request);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
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
    public ResponseEntity<Void> assignVehicleToIncident(
        @PathVariable Long incidentId,
        @PathVariable Long vehicleId) {
        try{
            incidentService.assignVehicleToIncident(incidentId, vehicleId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
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