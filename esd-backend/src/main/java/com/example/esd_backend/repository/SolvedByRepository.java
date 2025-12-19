package com.example.esd_backend.repository;

import com.example.esd_backend.model.*;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolvedByRepository extends JpaRepository<SolvedBy, Long> {;
    @Transactional
    @Query(value = "SELECT * FROM confirm WHERE incident_id = :#{#incident.id} AND vehicle_id = :#{#vehicle.id}", 
       nativeQuery = true)    
    Optional<SolvedBy> findByIncidentAndVehicle(Incident incident, Vehicle vehicle);

    @Transactional
    @Modifying
    @Query(value = "UPDATE confirm SET arrival_time = :#{#solvedBy.arrivalTime} WHERE incident_id = :#{#solvedBy.incident.id} AND vehicle_id = :#{#solvedBy.vehicle.id}", 
       nativeQuery = true)
    void UpdateArrivalTime(SolvedBy solvedBy);

    @Query(value = "SELECT " +
               " MAX(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as max_response, " +
               " MIN(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as min_response, " +
               " AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response " +
               "FROM incident i " +
               "JOIN assign_to a ON i.id = a.incident_id " +
               "JOIN confirm c ON i.id = c.incident_id " +
               "WHERE c.solution_time IS NOT NULL; "
               , nativeQuery = true )
    List<Object[]> getAllStats();

    @Query(value = "SELECT i.type as type, " +
               " MAX(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as max_response, " +
               " MIN(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as min_response, " +
               " AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response, " +
               " COUNT(*) as total_incidents " +
               "FROM incident i " +
               "JOIN assign_to a ON i.id = a.incident_id " +
               "JOIN confirm c ON i.id = c.incident_id " +
               "WHERE c.solution_time IS NOT NULL " +
               "  AND i.type = :type " +
               "GROUP BY i.type", nativeQuery = true)
    
    List<Object[]> getResponseTimeStatsBySpecificType(@Param("type") String type);

    @Query(value = "SELECT i.type as type, " +
               " EXTRACT(MONTH FROM c.solution_time) as month, " +
               " EXTRACT(YEAR FROM c.solution_time) as year, " +
               " MAX(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as max_response, " +
               " MIN(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as min_response, " +
               " AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response, " +
               " COUNT(*) as total_incidents " +
               "FROM incident i " +
               "JOIN assign_to a ON i.id = a.incident_id " +
               "JOIN confirm c ON i.id = c.incident_id " +
               "WHERE c.solution_time IS NOT NULL AND a.assign_time IS NOT NULL " +
               "  AND EXTRACT(MONTH FROM c.solution_time) = :month " +
               "  AND EXTRACT(YEAR FROM c.solution_time) = :year " +
               "  AND (:type IS NULL OR i.type = :type) " +
               "GROUP BY i.type, month, year " +
               "ORDER BY year, month", nativeQuery = true)
   
    List<Object[]> getResponseTimeStatsByTypeAndMonth(
        @Param("type") String type,
        @Param("month") Integer month,
        @Param("year") Integer year
        );

    @Query(value = "SELECT i.type as type, " +
               "       EXTRACT(DAY FROM c.solution_time) as day, " +
               "       EXTRACT(MONTH FROM c.solution_time) as month, " +
               "       EXTRACT(YEAR FROM c.solution_time) as year, " +
               "       MAX(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as max_response, " +
               "       MIN(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as min_response, " +
               "       AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response, " +
               "       COUNT(*) as total_incidents " +
               "FROM incident i " +
               "JOIN assign_to a ON i.id = a.incident_id " +
               "JOIN confirm c ON i.id = c.incident_id " +
               "WHERE c.solution_time IS NOT NULL AND a.assign_time IS NOT NULL " +
               "  AND EXTRACT(DAY FROM c.solution_time) = :day " +
               "  AND EXTRACT(MONTH FROM c.solution_time) = :month " +
               "  AND EXTRACT(YEAR FROM c.solution_time) = :year " +
               "  AND (:type IS NULL OR i.type = :type) " +
               "GROUP BY i.type, day, month, year", nativeQuery = true)
   
    List<Object[]> getResponseTimeStatsByTypeAndFullDate(
        @Param("type") String type,
        @Param("day") Integer day,
        @Param("month") Integer month,
        @Param("year") Integer year
    );

    @Query(value = "SELECT DISTINCT EXTRACT(YEAR FROM c.solution_time) as year " +
               "FROM confirm c " +
               "WHERE c.solution_time IS NOT NULL " +
               "ORDER BY year", nativeQuery = true)
    List<Integer> getAvailableYears();
    
}