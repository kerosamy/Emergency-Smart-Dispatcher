package com.example.esd_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/route")
public class RoutingController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRoute(
            @RequestParam double startLat,
            @RequestParam double startLng,
            @RequestParam double endLat,
            @RequestParam double endLng) {

        String osrmUrl = String.format(
                "http://localhost:5000/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                startLng, startLat, endLng, endLat
        );

        Map<String, Object> response = restTemplate.getForObject(osrmUrl, Map.class);
        return ResponseEntity.ok(response);
    }
}
