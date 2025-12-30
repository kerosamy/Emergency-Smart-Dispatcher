package com.example.esd_backend.service;

import com.example.esd_backend.model.*;
import com.example.esd_backend.model.enums.IncidentStatus;
import com.example.esd_backend.model.enums.IncidentType;
import com.example.esd_backend.model.enums.StationType;
import com.example.esd_backend.model.enums.VehicleStatus;
import com.example.esd_backend.dto.incidentDTOs.*;
import com.example.esd_backend.mapper.IncidentMapper;
import com.example.esd_backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Console;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final AssignToRepository assignToRepository;
    private final VehicleRepository vehicleRepository;
    private final SolvedByRepository solvedByRepository;
    private final AutoAssign autoAssign;
    private final NotificationService notificationService;

    public IncidentService(IncidentRepository incidentRepository,
                           AssignToRepository assignToRepository,
                           VehicleRepository vehicleRepository,
                           SolvedByRepository solvedByRepository,
                           AutoAssign autoAssign,
                           NotificationService notificationService) {
        this.incidentRepository = incidentRepository;
        this.assignToRepository = assignToRepository;
        this.vehicleRepository = vehicleRepository;
        this.solvedByRepository = solvedByRepository;
        this.autoAssign = autoAssign;
        this.notificationService = notificationService;
    }

    @Transactional
    public void reportIncident(IncidentRequestDto request) {
        Incident incident = new Incident();
        incident.setType(IncidentType.valueOf(request.getType()));
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setStatus(IncidentStatus.REPORTED);
        incident.setReportTime(LocalDateTime.now());
        incident.setSeverity(request.getSeverity() != null ? request.getSeverity() : 1);
        incident.setCapacity(request.getCapacity() != null ? request.getCapacity() : 0);

        // Get current user from SecurityContext
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        String currentUserEmail = auth.getName(); // typically username/email
//        User reporter = userRepository.findByEmail(currentUserEmail)
//                .orElseThrow(() -> new RuntimeException("Reporter not found"));
//
//        incident.setReporter(reporter);

        Incident savedIncident = incidentRepository.save(incident);
        System.out.println("auto assign");
        autoAssign.handleNewIncident(savedIncident);
        System.out.println("vehicle assign");
        notificationService.notifyIncidentCreated(savedIncident);
    }

    public IncidentResponseDto getIncidentById(Long incidentId) {
        Incident incident = incidentRepository.SearchId(incidentId);
        
        IncidentResponseDto dto = convertToResponseDto(incident);
        dto.setReporterName(incidentRepository.findReporterByIncidentId(incidentId));
        try{Long count = incidentRepository.countAssignedVehiclesByIncidentId(incidentId);
        dto.setAssignedVehicleCount(count != null ? count.intValue() : 0);}
        catch (Exception e){
            dto.setAssignedVehicleCount(0);
        }

        return dto;
    }
    
    public List<IncidentResponseDto> getAllIncidents() {
        List<Incident> incidents = incidentRepository.findAllByOrderByReportTimeDesc();
        return getIncidentResponseDtos(incidents);
    }

    public List<IncidentResponseDto> getAllINonSolvedIncidents() {
        List<Incident> incidents = incidentRepository.findAllNonResolvedNative();
        return getIncidentResponseDtos(incidents);
    }

    private List<IncidentResponseDto> getIncidentResponseDtos(List<Incident> incidents) {
        return incidents.stream()
                .map(i -> {
                    IncidentResponseDto dto = convertToResponseDto(i);
                    dto.setReporterName(i.getReporter() != null ? i.getReporter().getName() : null);
                    try{
                        Long count = incidentRepository.countAssignedVehiclesByIncidentId(i.getId());
                        dto.setAssignedVehicleCount(count != null ? count.intValue() : 0);
                    } catch (Exception e){
                        dto.setAssignedVehicleCount(0);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<IncidentResponseDto> getReportedIncidents(){
        List<Incident> incidents = incidentRepository.findByStatus(IncidentStatus.REPORTED);
        return getIncidentResponseDtos(incidents);
    }

    @Transactional
    public void updateIncident(Long incidentId, UpdateIncidentDto request) {
        Incident incident = incidentRepository.SearchId(incidentId);

        if (request.getSeverity() != null) {
            incident.setSeverity(request.getSeverity());
        }
        if (request.getCapacity() != null) {
            incident.setCapacity(request.getCapacity());
        }
        if(request.getType() != null) {
            incident.setType(IncidentType.valueOf(request.getType().toString()));
        }
        incidentRepository.save(incident);
    }

    @Transactional
    public void confirmArrival(Long incidentId , Long vehicleId) {
        Incident incident = incidentRepository.findById(incidentId).get();

        Vehicle vehicle = vehicleRepository.SearchId(vehicleId);

        SolvedBy solvedBy = solvedByRepository.findByIncidentAndVehicle(incident, vehicle)
                .orElseThrow(() -> new RuntimeException("Vehicle not assigned to this incident"));
        
        solvedBy.setArrivalTime(LocalDateTime.now());
        solvedByRepository.UpdateArrivalTime(solvedBy);
        
    }

    @Transactional
    public void resolveIncident(Long incidentId, Long vehicleId) {

        System.out.println("🟡 resolveIncident START");
        System.out.println("➡ incidentId = " + incidentId + ", vehicleId = " + vehicleId);

        // ------------------------------------------------
        // 1️⃣ Load & LOCK incident (prevents race condition)
        // ------------------------------------------------
        Incident incident = incidentRepository.findByIdForUpdate(incidentId);

        System.out.println("✅ Incident locked | id=" + incident.getId()
                + " | status=" + incident.getStatus()
                + " | capacity=" + incident.getCapacity());

        // Guard: already resolved
        if (incident.getStatus() == IncidentStatus.RESOLVED) {
            System.out.println("⚠ Incident already RESOLVED → skipping");
            return;
        }

        // ------------------------------------------------
        // 2️⃣ Load vehicle
        // ------------------------------------------------
        Vehicle vehicle = vehicleRepository.SearchId(vehicleId);
        if (vehicle == null) {
            System.out.println("❌ Vehicle NOT FOUND");
            throw new RuntimeException("Vehicle not found");
        }

        System.out.println("✅ Vehicle found | id=" + vehicle.getId()
                + " | capacity=" + vehicle.getCapacity());

        // ------------------------------------------------
        // 3️⃣ Load assignment
        // ------------------------------------------------
        SolvedBy solvedBy = solvedByRepository
                .findByIncidentAndVehicle(incident, vehicle)
                .orElseThrow(() -> {
                    System.out.println("❌ Vehicle NOT assigned to this incident");
                    return new RuntimeException("Vehicle not assigned to this incident");
                });

        // ------------------------------------------------
        // 4️⃣ Mark vehicle as solved (idempotent)
        // ------------------------------------------------
        if (solvedBy.getSolutionTime() == null) {
            solvedBy.setSolutionTime(LocalDateTime.now());
            solvedByRepository.save(solvedBy);
            System.out.println("🟢 Solution time set for vehicle " + vehicleId);
        } else {
            System.out.println("⚠ Vehicle already marked as solved");
        }

        // ------------------------------------------------
        // 5️⃣ Calculate solved capacity
        // ------------------------------------------------
        int solvedCapacity = solvedByRepository.findAllByIncident(incident)
                .stream()
                .filter(s -> s.getSolutionTime() != null)
                .peek(s -> System.out.println(
                        "🔍 Vehicle " + s.getVehicle().getId()
                                + " | capacity=" + s.getVehicle().getCapacity()
                ))
                .mapToInt(s -> s.getVehicle().getCapacity())
                .sum();

        System.out.println("📊 Solved capacity = " + solvedCapacity
                + " / Required = " + incident.getCapacity());

        // ------------------------------------------------
        // 6️⃣ Resolve incident if capacity satisfied
        // ------------------------------------------------
        if (solvedCapacity >= incident.getCapacity()) {
            System.out.println("🎉 Capacity satisfied → RESOLVING incident");

            incident.setStatus(IncidentStatus.RESOLVED);
            incidentRepository.save(incident);

            notificationService.notifyIncidentDeleted(incidentId);
            System.out.println("📡 Incident delete notification sent");
        } else {
            System.out.println("⏳ Incident still needs capacity");
        }

        // ------------------------------------------------
        // 7️⃣ Notify assignment removal (always)
        // ------------------------------------------------
        notificationService.notifyAssignmentDeleted(incidentId, vehicleId);
        System.out.println("📡 Assignment delete notification sent");

        System.out.println("🟢 resolveIncident END");
    }



    @Transactional
    public void deleteIncident(Long incidentId) {
            incidentRepository.deleteById(incidentId);
    }

    @Transactional
    public List<AssignmentResponseDTO> getAllAssignments() {
        return assignToRepository.findAllAssignments();
    }

    @Transactional
    public List<AssignmentResponseDTO> getAllNonResolvedAssignments() {
        return assignToRepository.findAllNonResolvedAssignmentsWithStation();
    }

    private IncidentResponseDto convertToResponseDto(Incident incident) {
        return IncidentMapper.convertToResponseDto(incident);
    }
}