package com.example.esd_backend.repository;

import com.example.esd_backend.dto.incidentDTOs.AssignmentResponseDTO;
import com.example.esd_backend.model.*;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignToRepository extends JpaRepository<AssignTo, Long> {
    
    @Transactional
    @Query(value = "SELECT * FROM assign_to WHERE incident_id = :#{#incident.id} AND vehicle_id = :#{#vehicle.id}", 
       nativeQuery = true)
    Optional<AssignTo> findByIncidentAndVehicle(Incident incident, Vehicle vehicle);

    @Transactional
    @Query(value = "SELECT a.incident_id AS incidentId, " +
            "a.vehicle_id AS vehicleId, " +
            "v.station_name AS stationName " +
            "FROM assign_to a " +
            "JOIN vehicle v ON a.vehicle_id = v.id",
            nativeQuery = true)
    List<AssignmentResponseDTO> findAllAssignments();

    List<AssignTo> findByIncidentId(Long incidentId);

    @Transactional
    @Query(value = "SELECT a.incident_id AS incidentId, " +
            "a.vehicle_id AS vehicleId, " +
            "v.station_name AS stationName " +
            "FROM assign_to a " +
            "JOIN vehicle v ON a.vehicle_id = v.id " +
            "JOIN incident i ON a.incident_id = i.id " +
            "WHERE i.status <> 'RESOLVED'",
            nativeQuery = true)
    List<AssignmentResponseDTO> findAllNonResolvedAssignmentsWithStation();
}

