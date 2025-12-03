package com.example.esd_backend.controller;


import com.example.esd_backend.dto.UnassignedVehicleDto;
import com.example.esd_backend.dto.VehicleAssignmentDto;
import com.example.esd_backend.dto.VehicleDto;
import com.example.esd_backend.model.Vehicle;
import com.example.esd_backend.service.VehicleService;
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
    public Vehicle addVehicle(@RequestBody VehicleDto vehicleDto) {
        return vehicleService.addVehicle(vehicleDto);
    }

    @GetMapping("/unassigned")
    @PreAuthorize("hasRole('DISPATCHER')")
    public List<UnassignedVehicleDto> getUnassignedVehicles() {
        return vehicleService.getUnassignedVehicles();
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('DISPATCHER')")
    public VehicleAssignmentDto assignResponder (
            @RequestParam Long vehicleId,
            @RequestParam String name ){
        return vehicleService.assignResponder(vehicleId, name);
    }

}
