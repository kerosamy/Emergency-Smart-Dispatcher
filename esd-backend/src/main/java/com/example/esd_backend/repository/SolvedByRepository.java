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
               " i.type, " +
               " MAX(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as max_response, " +
               " MIN(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as min_response, " +
               " AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response, " +
               " COUNT(*) as total_incidents " +
               "FROM incident i " +
               "JOIN assign_to a ON i.id = a.incident_id " +
               "JOIN confirm c ON i.id = c.incident_id AND a.vehicle_id = c.vehicle_id " +
               "WHERE c.solution_time IS NOT NULL " +
               "  AND (:type IS NULL OR i.type = :type) " +
               "GROUP BY i.type", nativeQuery = true)
    List<Object[]> getResponseTimeStatsByType(@Param("type") String type);

    @Query(value = "SELECT " +
               " i.type, " +
               " EXTRACT(MONTH FROM c.solution_time) as month, " +
               " EXTRACT(YEAR FROM c.solution_time) as year, " +
               " MAX(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as max_response, " +
               " MIN(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as min_response, " +
               " AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response, " +
               " COUNT(*) as total_incidents " +
               "FROM incident i " +
               "JOIN assign_to a ON i.id = a.incident_id " +
               "JOIN confirm c ON i.id = c.incident_id AND a.vehicle_id = c.vehicle_id " +
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

    @Query(value = "SELECT " +
               " i.type, " +
               " EXTRACT(DAY FROM c.solution_time) as day, " +
               " EXTRACT(MONTH FROM c.solution_time) as month, " +
               " EXTRACT(YEAR FROM c.solution_time) as year, " +
               " MAX(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as max_response, " +
               " MIN(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as min_response, " +
               " AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response, " +
               " COUNT(*) as total_incidents " +
               "FROM incident i " +
               "JOIN assign_to a ON i.id = a.incident_id " +
               "JOIN confirm c ON i.id = c.incident_id AND a.vehicle_id = c.vehicle_id " +
               "WHERE c.solution_time IS NOT NULL " +
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

    @Query(value = "SELECT v.id as vehicle_id, " +
               " v.station_type, " +
               " v.capacity, " +
               " u.name as driver_name, " +
               " AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response " +
               "FROM vehicle v " +
               "JOIN assign_to a ON v.id = a.vehicle_id " +
               "JOIN confirm c ON v.id = c.vehicle_id AND a.incident_id = c.incident_id " +
               "LEFT JOIN user u ON v.user_id = u.id " +
               "WHERE c.solution_time IS NOT NULL " +
               "  AND (:stationType IS NULL OR v.station_type = :stationType) " +
               "GROUP BY v.id, v.station_type, v.capacity, u.name " +
               "ORDER BY avg_response ASC " +
               "LIMIT 10", nativeQuery = true)
    List<Object[]> getTop10VehiclesByAvgResponseTime(@Param("stationType") String stationType);

    @Query(value = "SELECT s.id as station_id, " +
               " s.name as station_name, " +
               " s.type as station_type, " +
               " s.latitude, " +
               " s.longitude, " +
               " AVG(TIMESTAMPDIFF(SECOND, a.assign_time, c.solution_time)) as avg_response " +
               "FROM station s " +
               "JOIN vehicle v ON s.name = v.station_name " +
               "JOIN assign_to a ON v.id = a.vehicle_id " +
               "JOIN confirm c ON v.id = c.vehicle_id AND a.incident_id = c.incident_id " +
               "WHERE c.solution_time IS NOT NULL " +
               " AND (:stationType IS NULL OR s.type = :stationType) " +
               "GROUP BY s.id, s.name, s.type, s.latitude, s.longitude " +
               "ORDER BY avg_response ASC " +
               "LIMIT 10", nativeQuery = true)
    List<Object[]> getTop10StationsByAvgResponseTime(@Param("stationType") String stationType);
    
}