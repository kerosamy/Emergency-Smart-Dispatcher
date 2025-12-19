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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName(); // typically username/email
        User reporter = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Reporter not found"));

        incident.setReporter(reporter);
        
        incidentRepository.insertIncident(incident);        
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
    public void assignVehicleToIncident(Long incidentId, Long vehicleId) {
            Incident incident = incidentRepository.SearchId(incidentId);
            
            Vehicle vehicle = vehicleRepository.findById(vehicleId).get();
            
            if (vehicle.getVehicleStatus() != VehicleStatus.AVAILABLE) {
                logger.warn("Vehicle {} is not available. Status: {}", vehicle.getId(), vehicle.getVehicleStatus());
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
            
            incident.setStatus(IncidentStatus.DISPATCHED);
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
    public void resolveIncident(Long incidentId , Long VehicleId) {
        Incident incident = incidentRepository.findById(incidentId).get();

        Vehicle vehicle = vehicleRepository.SearchId(VehicleId);

        SolvedBy solvedBy = solvedByRepository.findByIncidentAndVehicle(incident, vehicle)
                .orElseThrow(() -> new RuntimeException("Vehicle not assigned to this incident"));
        
        solvedBy.setSolutionTime(LocalDateTime.now());
        solvedByRepository.save(solvedBy);
        
        incident.setStatus(IncidentStatus.RESOLVED);
        incidentRepository.save(incident);
    }
    
    
    @Transactional
    public void deleteIncident(Long incidentId) {
            incidentRepository.deleteById(incidentId);
    }

    @Transactional
    public List<AssignmentResponseDTO> getAllAssignments() {
        return assignToRepository.findAllAssignments();
    }

    private IncidentResponseDto convertToResponseDto(Incident incident) {
        return IncidentMapper.convertToResponseDto(incident);
    }
}