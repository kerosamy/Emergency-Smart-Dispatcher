package com.example.esd_backend.controller;

import com.example.esd_backend.service.RoutingService;
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
    private final RoutingService routingService;
    public RoutingController(RoutingService routingService) {
        this.routingService = routingService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRoute(
            @RequestParam double startLat,
            @RequestParam double startLng,
            @RequestParam double endLat,
            @RequestParam double endLng) {


        return ResponseEntity.ok(routingService.route(startLat, startLng, endLat, endLng));
    }
}
