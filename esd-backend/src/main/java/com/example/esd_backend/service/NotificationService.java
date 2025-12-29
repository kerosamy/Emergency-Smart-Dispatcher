package com.example.esd_backend.service;

import com.example.esd_backend.model.Incident;
import com.example.esd_backend.model.Vehicle;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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
       payload.put("route",routingService.route(vehicle.getStation().getLatitude(),vehicle.getStation().getLongitude(),incident.getLatitude(),incident.getLongitude()));

       messagingTemplate.convertAndSendToUser(
               vehicle.getDriver().getEmail(),
               "/queue/assignments", // STOMP destination for this driver
               payload
       );
       System.out.println("✅ Message sent to WebSocket broker");
   }
}
