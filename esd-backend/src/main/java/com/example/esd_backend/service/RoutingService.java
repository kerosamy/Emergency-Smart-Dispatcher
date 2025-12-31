package com.example.esd_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class RoutingService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> route(Double startLat , Double startLng , Double endLat , Double endLng ) {
        String osrmUrl = String.format(
                "http://localhost:5000/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                startLng, startLat, endLng, endLat
        );

        return restTemplate.getForObject(osrmUrl, Map.class);
    }
}
