package com.example.esd_backend.service;

import com.example.esd_backend.dto.VehicleLocationDto;
import com.example.esd_backend.dto.VehicleTypeDto;
import com.example.esd_backend.model.Incident;
import com.example.esd_backend.model.Station;
import com.example.esd_backend.model.Vehicle;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final RoutingService routingService;
    public NotificationService(SimpMessagingTemplate messagingTemplate, RoutingService routingService) {
        this.messagingTemplate = messagingTemplate;
        this.routingService = routingService;
    }

   public void notifyDriver(Incident incident, Vehicle vehicle) {
       System.out.println("Driver Notified");
       Map<String, Object> payload = new HashMap<>();
       payload.put("incidentId", incident.getId());
       payload.put("vehicleId", vehicle.getId());
       payload.put("vehicleType",vehicle.getStationType());
       payload.put("route",routingService.route(vehicle.getStation().getLatitude(),vehicle.getStation().getLongitude(),incident.getLatitude(),incident.getLongitude()));

       messagingTemplate.convertAndSendToUser(
               vehicle.getDriver().getEmail(),
               "/queue/assignments", // STOMP destination for this driver
               payload
       );
   }

    public void notifyIncidentCreated(Incident incident) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "REPORTED");
        payload.put("incidentId", incident.getId());
        payload.put("severity", incident.getSeverity());
        payload.put("status", incident.getStatus().name());
        payload.put("latitude", incident.getLatitude());
        payload.put("longitude", incident.getLongitude());
        payload.put("timestamp", LocalDateTime.now());
        payload.put("incidentType", incident.getType().toString().toLowerCase());

        messagingTemplate.convertAndSend("/topic/incidents", payload);
    }

    public void notifyIncidentDeleted(Long incidentId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "DELETED");
        payload.put("incidentId", incidentId);

        messagingTemplate.convertAndSend("/topic/incidents", payload);
    }

    public void notifyAssignmentCreated(Incident incident, Vehicle vehicle) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "ASSIGNED");
        payload.put("incidentId", incident.getId());
        payload.put("vehicleId", vehicle.getId());
        payload.put("stationName", vehicle.getStation().getName());
        payload.put("timestamp", LocalDateTime.now());

        messagingTemplate.convertAndSend("/topic/assignments", payload);
    }

    public void notifyAssignmentDeleted(Long incidentId, Long vehicleId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "UNASSIGNED");
        payload.put("incidentId", incidentId);
        payload.put("vehicleId", vehicleId);
        payload.put("timestamp", LocalDateTime.now());

        messagingTemplate.convertAndSend("/topic/assignments", payload);
    }

    public void notifyMovingVehicle(VehicleTypeDto vehicle) {

        Map<String, Object> payload = new HashMap<>();
        payload.put("id", vehicle.getId());
        payload.put("latitude", vehicle.getLatitude());
        payload.put("longitude", vehicle.getLongitude());
        payload.put("vehicleType", vehicle.getType());

        messagingTemplate.convertAndSend("/topic/vehicles", payload);
    }

    public void notifyMovingVehicle(Vehicle vehicle) {

        Map<String, Object> payload = new HashMap<>();
        payload.put("id", vehicle.getId());
        payload.put("vehicleType",vehicle.getStationType());
        payload.put("responder", vehicle.getDriver().getEmail());
        payload.put("status", vehicle.getVehicleStatus());
        payload.put("latitude", vehicle.getStation().getLatitude());
        payload.put("longitude", vehicle.getStation().getLongitude());

        messagingTemplate.convertAndSend("/topic/vehicles", payload);
    }

    public void notifyAddStation(Station station) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "STATION_ADDED");
        payload.put("stationId", station.getId());
        payload.put("name", station.getName());
        payload.put("latitude", station.getLatitude());
        payload.put("longitude", station.getLongitude());
        payload.put("timestamp", LocalDateTime.now());
        payload.put("stationType", station.getType());

        messagingTemplate.convertAndSend("/topic/stations", payload);
    }

    public void notifyRemovingVehicle(Long vehicleId) {

        Map<String, Object> payload = new HashMap<>();

        payload.put("type", "VEHICLE_REMOVED");
        payload.put("vehicleId", vehicleId);
        messagingTemplate.convertAndSend("/topic/vehicles", payload);
    }
    public void notifyTimeExceeded(Incident incident) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type","TIME");
        payload.put("incidentId", incident.getId());
        messagingTemplate.convertAndSend("/topic/incidents", payload);
    }
}
