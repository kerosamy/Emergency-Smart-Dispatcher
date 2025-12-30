package com.example.esd_backend.service;

import com.example.esd_backend.model.Incident;
import com.example.esd_backend.model.enums.IncidentStatus;
import com.example.esd_backend.repository.IncidentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class IncidentChecker {
    private final IncidentRepository incidentRepository;
    private final NotificationService notificationService;
    private final AutoAssign autoAssign;

    public IncidentChecker(IncidentRepository incidentRepository, NotificationService notificationService, AutoAssign autoAssign) {
        this.incidentRepository = incidentRepository;
        this.notificationService = notificationService;
        this.autoAssign = autoAssign;
    }

    @Scheduled(fixedRate = 10000)
    public void checkUnassignedIncidents() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(2);
        List<Incident> unassigned = incidentRepository.findReportedIncidentsExceedingTime(IncidentStatus.REPORTED, threshold);
        System.out.println("running");
        for (Incident incident : unassigned) {
            notificationService.notifyTimeExceeded(incident);
            autoAssign.handleNewIncident(incident);
        }

    }
}
