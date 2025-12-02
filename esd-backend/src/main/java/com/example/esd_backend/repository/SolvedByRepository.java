package com.example.esd_backend.repository;

import com.example.esd_backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolvedByRepository extends JpaRepository<SolvedBy, Long> {
    
    List<SolvedBy> findByIncident(Incident incident);
    
    List<SolvedBy> findByUser(User user);
    
    Optional<SolvedBy> findByIncidentAndUser(Incident incident, User user);
    
    @Query("SELECT s FROM SolvedBy s WHERE s.arrivalTime IS NOT NULL AND s.solutionTime IS NULL")
    List<SolvedBy> findPendingSolutions();
    
    @Query("SELECT s FROM SolvedBy s WHERE s.arrivalTime IS NULL")
    List<SolvedBy> findPendingArrivals();
    
    Long countByUserAndSolutionTimeIsNotNull(User user);
    
    @Query("SELECT s.user FROM SolvedBy s WHERE s.incident = :incident")
    List<User> findUsersByIncident(@Param("incident") Incident incident);
}