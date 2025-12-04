package com.example.esd_backend.repository;

import com.example.esd_backend.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface StationRepository extends JpaRepository<Station, Long> {

    @Transactional
    @Query(value = "SELECT * FROM station", 
       nativeQuery = true)
    List<Station> GetAll();

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO station (name, type, latitude, longitude) VALUES (:#{#station.name}, :#{#station.type.toString()}, :#{#station.latitude}, :#{#station.longitude})", 
       nativeQuery = true)
    void InsertStation(Station station);

    @Transactional
    @Query(value = "SELECT * FROM station WHERE name = :name", 
       nativeQuery = true)
    Optional<Station> findByName(String name);
}
