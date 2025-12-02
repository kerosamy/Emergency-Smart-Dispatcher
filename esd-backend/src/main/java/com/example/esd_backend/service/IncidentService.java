package com.example.esd_backend.service;

import com.example.esd_backend.model.*;
import com.example.esd_backend.model.enums.IncidentStatus;
import com.example.esd_backend.model.enums.IncidentType;
import com.example.esd_backend.model.enums.VehicleStatus;
import com.example.esd_backend.dto.incidentDTOs.*;
import com.example.esd_backend.mapper.IncidentMapper;
import com.example.esd_backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentService {
    
    private static final Logger logger = LoggerFactory.getLogger(IncidentService.class);
    
    @Autowired
    private IncidentRepository incidentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AssignToRepository assignToRepository;

    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private SolvedByRepository solvedByRepository;


    
    
    @Transactional
    public IncidentResponseDto reportIncident(IncidentRequestDto request) {
        Incident incident = new Incident();
        incident.setType(IncidentType.valueOf(request.getType().toLowerCase()));
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setLocation(request.getLocation());
        incident.setStatus(IncidentStatus.reported);
        incident.setReportTime(LocalDateTime.now());
        incident.setSeverity(request.getSeverity() != null ? request.getSeverity() : 1);
        incident.setCapacity(request.getCapacity() != null ? request.getCapacity() : 0);
        
        if (request.getReporterId() != null) {
            User reporter = userRepository.findById(Long.valueOf(request.getReporterId()))
                .orElseThrow(() -> new RuntimeException("Reporter not found"));
            incident.setReporter(reporter);
        }
        
        Incident saved = incidentRepository.save(incident);
        logger.info("Incident reported successfully with ID: {}", saved.getId());
        
        return convertToResponseDto(saved);
    }
    
    
    public IncidentResponseDto getIncidentById(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
            .orElseThrow(() -> new RuntimeException("Incident not found with ID: " + incidentId));
        logger.debug("Retrieved incident with ID: {}", incidentId);
        
        IncidentResponseDto dto = convertToResponseDto(incident);
        
        // Set reporter name
        try {
            if (incident.getReporter() != null) {
                dto.setReporterName(incident.getReporter().getName());
            }
        } catch (Exception e) {
            logger.debug("No reporter for incident {}", incidentId);
        }

        // Count assigned vehicles using the repository query
        try {
            Long count = incidentRepository.countAssignedVehiclesByIncidentId(incidentId);
            dto.setAssignedVehicleCount(count != null ? count.intValue() : 0);
            logger.info("Incident {} has {} assigned vehicles", incidentId, count);
        } catch (Exception e) {
            logger.error("Error counting assigned vehicles for incident {}: {}", incidentId, e.getMessage());
            dto.setAssignedVehicleCount(0);
        }

        return dto;
    }
    
    public List<IncidentResponseDto> getAllIncidents() {
        List<Incident> incidents = incidentRepository.findAllByOrderByReportTimeDesc();
        logger.info("Retrieved {} incidents successfully.", incidents.size());
        return incidents.stream()
            .map(i -> {
                IncidentResponseDto dto = convertToResponseDto(i);
                try {
                    dto.setReporterName(i.getReporter() != null ? i.getReporter().getName() : null);
                } catch (Exception e) {
                    // ignore
                }
                try {
                    Long count = incidentRepository.countAssignedVehiclesByIncidentId(i.getId());
                    dto.setAssignedVehicleCount(count != null ? count.intValue() : 0);
                } catch (Exception e) {
                    dto.setAssignedVehicleCount(0);
                }
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    public List<IncidentResponseDto> getIncidentsByStatus(String status) {
        IncidentStatus incidentStatus = IncidentStatus.valueOf(status.toLowerCase());
        List<Incident> incidents = incidentRepository.findByStatusOrderByReportTimeDesc(incidentStatus);
        logger.info("Retrieved {} incidents with status: {}", incidents.size(), status);
        return incidents.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public List<IncidentResponseDto> getIncidentsByType(String type) {
        IncidentType incidentType = IncidentType.valueOf(type.toLowerCase());
        List<Incident> incidents = incidentRepository.findByTypeOrderByReportTimeDesc(incidentType);
        logger.info("Retrieved {} incidents with type: {}", incidents.size(), type);
        return incidents.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public List<IncidentResponseDto> getIncidentsByLocation(Double latitude, Double longitude) {
        List<Incident> incidents = incidentRepository.findByLatitudeAndLongitudeOrderByReportTimeDesc(latitude, longitude);
        logger.info("Retrieved {} incidents at location ({}, {})", incidents.size(), latitude, longitude);
        return incidents.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public List<IncidentResponseDto> getIncidentsByLocationName(String location) {
        List<Incident> incidents = incidentRepository.findByLocationOrderByReportTimeDesc(location);
        logger.info("Retrieved {} incidents at location: {}", incidents.size(), location);
        return incidents.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public List<IncidentResponseDto> getUnassignedIncidents() {
        List<Incident> incidents = incidentRepository.findUnassignedIncidents();
        logger.info("Retrieved {} unassigned incidents", incidents.size());
        return incidents.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public List<IncidentResponseDto> getActiveIncidents() {
        List<Incident> incidents = incidentRepository.findActiveIncidents();
        logger.info("Retrieved {} active incidents", incidents.size());
        return incidents.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public List<IncidentResponseDto> getIncidentsByReporter(Long reporterId) {
        List<Incident> incidents = incidentRepository.findByReporterIdOrderByReportTimeDesc(reporterId);
        logger.info("Retrieved {} incidents for reporter {}", incidents.size(), reporterId);
        return incidents.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public void updateIncident(Long incidentId, UpdateIncidentDto request) {
        Incident incident = incidentRepository.findById(incidentId)
            .orElseThrow(() -> new RuntimeException("Incident not found with ID: " + incidentId));

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
        logger.info("Incident {} updated with new details.", incidentId);
    }
    
    
    @Transactional
    public AssignVehicleResponseDto assignVehicleToIncident(Long incidentId, Long vehicleId) {
        try {
            Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
            
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            
            if (vehicle.getVehicleStatus() != VehicleStatus.AVAILABLE) {
                logger.warn("Vehicle {} is not available. Status: {}", vehicle.getId(), vehicle.getVehicleStatus());
                return AssignVehicleResponseDto.failure(
                    "Vehicle is not available (Status: " + vehicle.getVehicleStatus() + ")"
                );
            }
            
            AssignTo assignTo = new AssignTo();
            assignTo.setIncident(incident);
            assignTo.setVehicle(vehicle);
            assignTo.setAssignTime(LocalDateTime.now());
            assignToRepository.save(assignTo);
            
            if (vehicle.getDriver() != null) {
                SolvedBy solvedBy = new SolvedBy();
                solvedBy.setIncident(incident);
                solvedBy.setUser(vehicle.getDriver());
                solvedByRepository.save(solvedBy);
            }
            
            incident.setStatus(IncidentStatus.dispatched);
            incidentRepository.save(incident);
            
            logger.info("Vehicle {} assigned to incident {}", vehicleId, incidentId);
            
            return AssignVehicleResponseDto.success(
                "Vehicle assigned successfully",
                vehicle.getId().intValue(),
                vehicle.getDriver() != null ? vehicle.getDriver().getId().intValue() : null
            );
            
        } catch (Exception e) {
            logger.error("Error assigning vehicle to incident", e);
            return AssignVehicleResponseDto.failure("Error occurred during vehicle assignment: " + e.getMessage());
        }
    }
    
    
    @Transactional
    public void confirmArrival(Long incidentId, ConfirmArrivalRequestDTO request) {
        Incident incident = incidentRepository.findById(incidentId)
            .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        User user = userRepository.findById(Long.valueOf(request.getUserId()))
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        SolvedBy solvedBy = solvedByRepository.findByIncidentAndUser(incident, user)
            .orElseGet(() -> {
                SolvedBy newSolvedBy = new SolvedBy();
                newSolvedBy.setIncident(incident);
                newSolvedBy.setUser(user);
                return newSolvedBy;
            });
        
        solvedBy.setArrivalTime(LocalDateTime.now());
        solvedByRepository.save(solvedBy);
        
        logger.info("Arrival confirmed for user {} at incident {}", request.getUserId(), incidentId);
    }
    
    @Transactional
    public void resolveIncident(Long incidentId, ConfirmSolutionRequestDTO request) {
        Incident incident = incidentRepository.findById(incidentId)
            .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        User user = userRepository.findById(Long.valueOf(request.getUserId()))
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        SolvedBy solvedBy = solvedByRepository.findByIncidentAndUser(incident, user)
            .orElseThrow(() -> new RuntimeException("No assignment found for this user and incident"));
        
        solvedBy.setSolutionTime(LocalDateTime.now());
        solvedByRepository.save(solvedBy);
        
        incident.setStatus(IncidentStatus.resolved);
        incidentRepository.save(incident);
        
        logger.info("Incident {} resolved successfully by user {}", incidentId, request.getUserId());
    }
    
    
    @Transactional
    public void deleteIncident(Long incidentId) {
        if (incidentRepository.existsById(incidentId)) {
            incidentRepository.deleteById(incidentId);
            logger.info("Incident {} deleted successfully.", incidentId);
        } else {
            logger.warn("No incident found with ID {} to delete.", incidentId);
            throw new RuntimeException("Incident not found");
        }
    }
    
    
    public Long countIncidentsByStatus(String status) {
        IncidentStatus incidentStatus = IncidentStatus.valueOf(status.toLowerCase());
        return incidentRepository.countByStatus(incidentStatus);
    }
    
    public Long countIncidentsByType(String type) {
        IncidentType incidentType = IncidentType.valueOf(type.toLowerCase());
        return incidentRepository.countByType(incidentType);
    }

    private IncidentResponseDto convertToResponseDto(Incident incident) {
        return IncidentMapper.convertToResponseDto(incident);
    }
}