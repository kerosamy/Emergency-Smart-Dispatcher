package com.example.esd_backend.repository;

import com.example.esd_backend.model.Incident;
import com.example.esd_backend.model.enums.IncidentStatus;
import com.example.esd_backend.model.enums.IncidentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
        
    List<Incident> findAllByOrderByReportTimeDesc();

    List<Incident> findByStatus(IncidentStatus status);

    @Query("SELECT i.reporter.name " +
       "FROM Incident i WHERE i.id = :incidentId")
    String findReporterByIncidentId(@Param("incidentId") Long incidentId);

    @Query("SELECT COUNT(a.vehicle.id) FROM AssignTo a WHERE a.incident.id = :incidentId")
    Long countAssignedVehiclesByIncidentId(@Param("incidentId") Long incidentId);
}