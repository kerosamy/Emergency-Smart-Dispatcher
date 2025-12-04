package com.example.esd_backend.repository;
import com.example.esd_backend.model.Vehicle;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Transactional
    @Query(value = "SELECT * FROM vehicle WHERE id = :id", nativeQuery = true)
    Optional<Vehicle> SearchId(@Param("id") Long id);
    
    @Transactional
    @Query(value = "SELECT * FROM vehicle WHERE user_id IS NULL", 
       nativeQuery = true)
    List<Vehicle> findByDriverIsNull();
}
