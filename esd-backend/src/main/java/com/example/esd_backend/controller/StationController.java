package com.example.esd_backend.controller;

import com.example.esd_backend.dto.StationDto;
import com.example.esd_backend.dto.StationNameTypeDto;
import com.example.esd_backend.model.Station;
import com.example.esd_backend.service.StationService;
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
    public Station addStation(@RequestBody StationDto stationDto) {
        return stationService.addStation(stationDto);
    }

    @GetMapping("/getAllStations")
    public List<StationNameTypeDto> getAllStations() {
        return stationService.getAllStations();
    }
}
