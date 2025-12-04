package com.example.esd_backend.controller;


import com.example.esd_backend.dto.UnassignedVehicleDto;
import com.example.esd_backend.dto.VehicleAssignmentDto;
import com.example.esd_backend.dto.VehicleDto;
import com.example.esd_backend.dto.VehicleListDto;
import com.example.esd_backend.model.Vehicle;
import com.example.esd_backend.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<Vehicle>  addVehicle(@RequestBody VehicleDto vehicleDto) {
        return ResponseEntity.ok(vehicleService.addVehicle(vehicleDto));
    }

    @GetMapping("/unassigned")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<List<UnassignedVehicleDto>> getUnassignedVehicles() {
        return ResponseEntity.ok(vehicleService.getUnassignedVehicles());
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<VehicleAssignmentDto>  assignResponder (
            @RequestParam Long vehicleId,
            @RequestParam String name ){
        return ResponseEntity.ok(vehicleService.assignResponder(vehicleId, name));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<List<VehicleListDto>>  getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles()) ;
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<List<VehicleListDto>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles());
    }

}
