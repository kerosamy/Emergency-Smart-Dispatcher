package com.example.esd_backend.repository;

import com.example.esd_backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignToRepository extends JpaRepository<AssignTo, Long> {
    
    List<AssignTo> findByIncident(Incident incident);
    
    List<AssignTo> findByVehicle(Vehicle vehicle);
    
    Optional<AssignTo> findByIncidentAndVehicle(Incident incident, Vehicle vehicle);
    
    boolean existsByIncidentAndVehicle(Incident incident, Vehicle vehicle);
    
    @Query("SELECT a.vehicle FROM AssignTo a WHERE a.incident = :incident")
    List<Vehicle> findVehiclesByIncident(@Param("incident") Incident incident);
    
    @Query("SELECT a.incident FROM AssignTo a WHERE a.vehicle = :vehicle")
    List<Incident> findIncidentsByVehicle(@Param("vehicle") Vehicle vehicle);
    
    Long countByIncident(Incident incident);
}
