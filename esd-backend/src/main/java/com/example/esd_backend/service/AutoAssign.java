package com.example.esd_backend.service;

import com.example.esd_backend.model.AssignTo;
import com.example.esd_backend.model.Incident;
import com.example.esd_backend.model.SolvedBy;
import com.example.esd_backend.model.Vehicle;
import com.example.esd_backend.model.enums.IncidentStatus;
import com.example.esd_backend.model.enums.StationType;
import com.example.esd_backend.model.enums.VehicleStatus;
import com.example.esd_backend.repository.AssignToRepository;
import com.example.esd_backend.repository.IncidentRepository;
import com.example.esd_backend.repository.SolvedByRepository;
import com.example.esd_backend.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AutoAssign {

    private static final Logger logger = LoggerFactory.getLogger(AutoAssign.class);
    private static final int factor = 10;
    private final VehicleRepository vehicleRepository;
    private final IncidentRepository incidentRepository;
    private final AssignToRepository assignToRepository;
    private final SolvedByRepository solvedByRepository;
    private final NotificationService notificationService;
    private final RoutingService routingService;

    public AutoAssign(VehicleRepository vehicleRepository,
                      IncidentRepository incidentRepository,
                      AssignToRepository assignToRepository,
                      SolvedByRepository solvedByRepository,
                      NotificationService notificationService,
                      RoutingService routingService
    ) {
        this.vehicleRepository = vehicleRepository;
        this.incidentRepository = incidentRepository;
        this.assignToRepository = assignToRepository;
        this.solvedByRepository = solvedByRepository;
        this.notificationService = notificationService;
        this.routingService = routingService;
    }

    @Transactional
    public void handleNewIncident (Incident incident) {
        List<Vehicle> availableVehicles = vehicleRepository.findByVehicleStatus(VehicleStatus.AVAILABLE)
                .stream()
                .filter(v -> matchesIncidentType(v, incident))
                .sorted(Comparator.comparingDouble(v -> calculateDistance(
                        v.getStation().getLatitude(),
                        v.getStation().getLongitude(),
                        incident.getLatitude(),
                        incident.getLongitude()
                        )))
                .toList();
        System.out.println( "size = " +availableVehicles.size());
        if (!availableVehicles.isEmpty()) {
            dispatchVehiclesForIncident (incident, availableVehicles);
        }
    }

    @Transactional
    public void handleNewVehicle(Vehicle vehicle) {
        List<Incident> waitingIncidents = incidentRepository.findByStatus(IncidentStatus.REPORTED)
                .stream()
                .filter(i -> matchesIncidentType(vehicle, i))
                .sorted(Comparator.comparingDouble(this::effectivePriority).reversed())
                .toList();

        if (!waitingIncidents.isEmpty()) {
            Incident incident = waitingIncidents.get(0);
            assignVehicleToIncident(incident.getId(), vehicle.getId());
        }
    }

    @Transactional
    public void dispatchVehiclesForIncident(Incident incident, List<Vehicle> availableVehicles) {
        int assignedCapacity = getAssignedCapacity(incident.getId());
        int requiredCapacity = incident.getCapacity() != null ? incident.getCapacity() : 0;
        System.out.println(assignedCapacity);
        System.out.println(requiredCapacity);

        for (Vehicle vehicle : availableVehicles) {
            if (assignedCapacity >= requiredCapacity) break;

            assignVehicleToIncident(incident.getId(), vehicle.getId());
            assignedCapacity += vehicle.getCapacity();
        }
    }

    @Transactional
    public void assignVehicleToIncident(Long incidentId, Long vehicleId) {
        Incident incident = incidentRepository.findByIdForUpdate(incidentId);
        System.out.println("dissipation now "+ incidentId+" " + vehicleId);
        Vehicle vehicle = vehicleRepository.findByIdForUpdate(vehicleId);

        if (vehicle.getVehicleStatus() != VehicleStatus.AVAILABLE) {
            logger.warn("Vehicle {} is not available", vehicleId);
            return;
        }

        AssignTo assignTo = new AssignTo();
        assignTo.setIncident(incident);
        assignTo.setVehicle(vehicle);
        assignTo.setAssignTime(LocalDateTime.now());
        assignToRepository.save(assignTo);

        if (vehicle.getDriver() != null) {
            SolvedBy solvedBy = new SolvedBy();
            solvedBy.setIncident(incident);
            solvedBy.setVehicle(vehicle);
            solvedByRepository.save(solvedBy);
        }

        vehicle.setVehicleStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicle);

        int currentTotal = getAssignedCapacity(incidentId);
        int required = incident.getCapacity() != null ? incident.getCapacity() : 0;
        System.out.println("finsh");


        // Create a payload for the driver
       notificationService.notifyDriver(incident,vehicle);

        if (currentTotal >= required) {
            incident.setStatus(IncidentStatus.DISPATCHED);
            System.out.println("ok");
            incidentRepository.save(incident);
        }
    }

    private double effectivePriority(Incident incident) {
        long waitingMinutes = Duration.between(incident.getReportTime(), LocalDateTime.now()).toMinutes();
        int severity = incident.getSeverity() != null ? incident.getSeverity() : 1;
        return severity + (double) waitingMinutes / factor;
    }

    private boolean matchesIncidentType(Vehicle vehicle, Incident incident) {
        switch (incident.getType()) {
            case FIRE: return vehicle.getStationType() == StationType.FIRE;
            case MEDICAL: return vehicle.getStationType() == StationType.MEDICAL;
            case CRIME: return vehicle.getStationType() == StationType.POLICE;
            default: return false;
        }
    }

    private double calculateDistance(double latitude1, double longitude1, double latitude2, double longitude2) {
        return Math.sqrt(
                Math.pow(latitude1 - latitude2, 2) +
                Math.pow(longitude1 - longitude2, 2)
        );
    }

    public int getAssignedCapacity(Long incidentId) {
        return assignToRepository.findByIncidentId(incidentId)
                .stream()
                .mapToInt(a -> a.getVehicle() != null ? a.getVehicle().getCapacity() : 0)
                .sum();
    }
}
