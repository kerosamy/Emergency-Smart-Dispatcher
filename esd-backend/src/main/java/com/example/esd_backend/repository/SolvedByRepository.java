package com.example.esd_backend.repository;

import com.example.esd_backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolvedByRepository extends JpaRepository<SolvedBy, Long> {;
        
    Optional<SolvedBy> findByIncidentAndUser(Incident incident, User user);
}