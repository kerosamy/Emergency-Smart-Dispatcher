package com.example.esd_backend.repository;

import com.example.esd_backend.model.Incident;
import com.example.esd_backend.model.enums.IncidentStatus;
import com.example.esd_backend.model.enums.IncidentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.example.esd_backend.dto.incidentDTOs.ReporterDto;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    
    List<Incident> findByStatusOrderByReportTimeDesc(IncidentStatus status);
    
    List<Incident> findByTypeOrderByReportTimeDesc(IncidentType type);
    
    @Query("SELECT i FROM Incident i WHERE " +
           "i.latitude BETWEEN :minLat AND :maxLat AND " +
           "i.longitude BETWEEN :minLon AND :maxLon " +
           "ORDER BY i.reportTime DESC")
    List<Incident> findByLocationRange(@Param("minLat") Double minLat,
                                       @Param("maxLat") Double maxLat,
                                       @Param("minLon") Double minLon,
                                       @Param("maxLon") Double maxLon);
    
    List<Incident> findByLatitudeAndLongitudeOrderByReportTimeDesc(Double latitude, Double longitude);
        
    List<Incident> findAllByOrderByReportTimeDesc();
    
    @Query("SELECT i FROM Incident i WHERE i.status = 'REPORTED' ORDER BY i.reportTime ASC")
    List<Incident> findUnassignedIncidents();
    
    @Query("SELECT i FROM Incident i WHERE i.status != 'RESOLVED' ORDER BY i.reportTime ASC")
    List<Incident> findActiveIncidents();
    
    List<Incident> findByReporterIdOrderByReportTimeDesc(Long reporterId);
    
    List<Incident> findByTypeAndStatusOrderByReportTimeDesc(IncidentType type, IncidentStatus status);
    
    Long countByStatus(IncidentStatus status);
    
    Long countByType(IncidentType type);

    // projection query to return reporter name for a single incident
    @Query("SELECT new com.example.esd_backend.dto.incidentDTOs.ReporterDto(" +
           "CASE WHEN i.reporter IS NULL THEN null ELSE i.reporter.id END, " +
           "CASE WHEN i.reporter IS NULL THEN null ELSE i.reporter.name END) " +
           "FROM Incident i WHERE i.id = :incidentId")
    ReporterDto findReporterDtoByIncidentId(@Param("incidentId") Long incidentId);

    // Query to count assigned vehicles using the assign_to table
    @Query("SELECT COUNT(a.vehicle.id) FROM AssignTo a WHERE a.incident.id = :incidentId")
    Long countAssignedVehiclesByIncidentId(@Param("incidentId") Long incidentId);
}