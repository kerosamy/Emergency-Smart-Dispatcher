package com.example.esd_backend.controller;


import com.example.esd_backend.dto.*;
import com.example.esd_backend.model.Vehicle;
import com.example.esd_backend.service.VehicleService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Void>  addVehicle(@RequestBody VehicleDto vehicleDto) {
        vehicleService.addVehicle(vehicleDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unassigned")
    public ResponseEntity<List<UnassignedVehicleDto>> getUnassignedVehicles() {
        return ResponseEntity.ok(vehicleService.getUnassignedVehicles());
    }

    @PostMapping("/assign")
    public ResponseEntity<VehicleAssignmentDto>  assignResponder (
            @RequestParam Long vehicleId,
            @RequestParam String name ){
        return ResponseEntity.ok(vehicleService.assignResponder(vehicleId, name));
    }

    @GetMapping("/all")
    public ResponseEntity<List<VehicleListDto>>  getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles()) ;
    }

    @GetMapping("/available")
    public ResponseEntity<List<VehicleListDto>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/locations")
    public ResponseEntity<List<VehicleLocationDto>> getAllVehicleLocations() {
        return ResponseEntity.ok(vehicleService.getAllVehicleLocations());
    }

    @PostMapping("/move")
    public ResponseEntity<Void>moveVehicle (@RequestBody VehicleLocationDto dto){
        vehicleService.moveVehicle(dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/available")
    public ResponseEntity<Void>  setAvailableVehicle (@PathVariable Long id){
        vehicleService.setAvailableVehicle(id);
        return ResponseEntity.ok().build();
    }
}
