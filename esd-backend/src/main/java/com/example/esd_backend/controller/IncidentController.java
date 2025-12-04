package com.example.esd_backend.controller;

import com.example.esd_backend.dto.incidentDTOs.*;
import com.example.esd_backend.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
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
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<IncidentResponseDto> getIncidentById(@PathVariable Long id) {
        try {
            IncidentResponseDto response = incidentService.getIncidentById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<List<IncidentResponseDto>> getAllIncidents() {
        List<IncidentResponseDto> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/reported")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<List<IncidentResponseDto>> getReportedIncidents() {
        List<IncidentResponseDto> incidents = incidentService.getReportedIncidents();
        return ResponseEntity.ok(incidents);
    }
        
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('DISPATCHER')")
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
    @PreAuthorize("hasRole('DISPATCHER')")
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
    @PreAuthorize("hasAnyRole('DISPATCHER' , 'RESPONDER')")
    public ResponseEntity<Void> confirmArrival(
            @PathVariable Long id) {
        try {
            incidentService.confirmArrival(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('DISPATCHER' , 'RESPONDER')")
    public ResponseEntity<Void> resolveIncident(
            @PathVariable Long id) {
        try {
            incidentService.resolveIncident(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
        
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        try {
            incidentService.deleteIncident(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}