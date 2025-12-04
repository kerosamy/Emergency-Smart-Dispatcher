package com.example.esd_backend.controller;

import com.example.esd_backend.dto.StationDto;
import com.example.esd_backend.dto.StationNameTypeDto;
import com.example.esd_backend.model.Station;
import com.example.esd_backend.service.StationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stations")
public class StationController {
    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('DISPATCHER')")
    public void addStation(@RequestBody StationDto stationDto) {
        stationService.addStation(stationDto);
    }

    @GetMapping("/getAllStations")
    @PreAuthorize("hasRole('DISPATCHER')")
    public List<StationNameTypeDto> getAllStations() {
        return stationService.getAllStations();
    }
}
