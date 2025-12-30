package com.example.esd_backend.repository;

import com.example.esd_backend.model.Incident;
import com.example.esd_backend.model.enums.IncidentStatus;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO incident (capacity, latitude, longitude, report_time, severity, status, type, reporter_id) VALUES (:#{#incident.capacity}, :#{#incident.latitude}, :#{#incident.longitude}, :#{#incident.reportTime}, :#{#incident.severity}, :#{#incident.status.toString()}, :#{#incident.type.toString()}, :#{#incident.reporter.id})", 
       nativeQuery = true)
    void insertIncident(@Param("incident") Incident incident);

    @Transactional
    @Query(value = "SELECT * FROM incident WHERE id = :id", 
       nativeQuery = true)
    Incident SearchId(long id);

    @Transactional
    @Query(value = "SELECT * FROM incident ORDER BY report_time DESC", 
       nativeQuery = true)    
    List<Incident> findAllByOrderByReportTimeDesc();
    
    @Transactional
    @Query(value = "SELECT user.name FROM incident JOIN user ON incident.reporter_id = user.id WHERE incident.id = :incidentId", 
       nativeQuery = true)
    String findReporterByIncidentId(@Param("incidentId") Long incidentId);
    
    @Transactional
    @Query("SELECT COUNT(a.vehicle.id) FROM AssignTo a WHERE a.incident.id = :incidentId")
    Long countAssignedVehiclesByIncidentId(@Param("incidentId") Long incidentId);

    @Transactional

    List<Incident> findByStatus(IncidentStatus reported);
    @Query(value = "DELETE FROM incident WHERE id = :id", 
       nativeQuery = true)
    void deleteById(Long id);

    @Query(value = "SELECT * FROM incident WHERE status <> 'RESOLVED'", nativeQuery = true)
    List<Incident> findAllNonResolvedNative();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Incident i WHERE i.id = :id")
    Incident findByIdForUpdate(@Param("id") Long id);

    @Transactional
    @Query("SELECT i FROM Incident i " +
            "WHERE i.status = :status " +
            "AND i.reportTime <= :thresholdTime")
    List<Incident> findReportedIncidentsExceedingTime(
            @Param("status") IncidentStatus status,
            @Param("thresholdTime") LocalDateTime thresholdTime
    );
}