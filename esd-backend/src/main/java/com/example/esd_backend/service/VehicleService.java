package com.example.esd_backend.service;

import com.example.esd_backend.dto.*;
import com.example.esd_backend.mapper.VehicleMapper;
import com.example.esd_backend.model.Station;
import com.example.esd_backend.model.User;
import com.example.esd_backend.model.Vehicle;
import com.example.esd_backend.model.enums.VehicleStatus;
import com.example.esd_backend.repository.StationRepository;
import com.example.esd_backend.repository.UserRepository;
import com.example.esd_backend.repository.VehicleRepository;

import jakarta.transaction.Transactional;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final AutoAssign autoAssign;
    private final StringRedisTemplate redisTemplate; // Add this

    public VehicleService(VehicleRepository vehicleRepository,
                          StationRepository stationRepository,
                          UserRepository userRepository,
                          AutoAssign autoAssign,
                          StringRedisTemplate redisTemplate) {
        this.vehicleRepository = vehicleRepository;
        this.stationRepository = stationRepository;
        this.userRepository = userRepository;
        this.autoAssign = autoAssign;
        this.redisTemplate = redisTemplate;
    }

    public Vehicle addVehicle(VehicleDto vehicleDto) {
        Station station = stationRepository.findByName(vehicleDto.getStationName())
                .orElseThrow(() -> new RuntimeException("station does not exist"));
        Vehicle vehicle = VehicleMapper.toEntity(vehicleDto, station);
        vehicle.setStationType(station.getType());
        if (vehicleDto.getResponderEmail() != null) {
            User responder = userRepository.findByEmail(vehicleDto.getResponderEmail())
                    .orElseThrow(() -> new RuntimeException("Responder not found"));
            if (responder.getVehicle() != null) {
                throw new RuntimeException("This responder is already assigned to a vehicle");
            }
            vehicle.setDriver(responder);
        }
        station.getVehicles().add(vehicle);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // STEP 1: Save to Redis
        String redisKey = "id:" + savedVehicle.getId();
        String posValue = station.getLatitude() + "," + station.getLongitude();
        redisTemplate.opsForValue().set(redisKey, posValue);
        System.out.println("DEBUG: Vehicle " + savedVehicle.getId() + " initialized in Redis at " + posValue);

        autoAssign.handleNewVehicle(vehicle);
        return savedVehicle;
    }

    public List<UnassignedVehicleDto> getUnassignedVehicles() {
        return vehicleRepository.findByDriverIsNull().stream()
                .map(v -> new UnassignedVehicleDto(v.getId(), v.getStation().getName()))
                .toList();
    }

    public VehicleAssignmentDto assignResponder(Long vehicleId, String name) {
        Vehicle vehicle = vehicleRepository.SearchId(vehicleId);
        if (vehicle.getDriver() != null) {
            throw new RuntimeException("Vehicle already has a driver assigned");
        }

        User user = userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getVehicle() != null) {
            throw new RuntimeException("Responder already assigned to a vehicle");
        }

        vehicle.setDriver(user);
        vehicleRepository.save(vehicle);

        return new VehicleAssignmentDto(vehicle.getId(), vehicle.getStation().getName(), user.getEmail());
    }

    public List<VehicleListDto> getAllVehicles() {
        List<VehicleListDto> result = new ArrayList<>();
        for (Vehicle vehicle : vehicleRepository.findAll()){
            result.add(VehicleMapper.toListDto(vehicle));
        }
        return result;
    }

    public List<VehicleListDto> getAvailableVehicles(){
        List<VehicleListDto> result = new ArrayList<>();
        for (Vehicle vehicle : vehicleRepository.findByVehicleStatus(VehicleStatus.AVAILABLE)){
            result.add(VehicleMapper.toListDto(vehicle));
        }
        return result;
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        Station station = vehicle.getStation();
        if (station != null) {
            station.getVehicles().removeIf(v -> v.getId().equals(id));
        }
        User driver = vehicle.getDriver();
        if (driver != null) {
            driver.setVehicle(null);
            vehicle.setDriver(null); 
        }
        vehicleRepository.delete(vehicle);
    }


    public List<VehicleLocationDto> getAllVehicleLocations() {
        // 1. Get all keys starting with "id:"
        Set<String> keys = redisTemplate.keys("id:*");
        List<VehicleLocationDto> locations = new ArrayList<>();

        if (keys != null) {
            for (String key : keys) {
                String vehicleId = key.split(":")[1];
                String posValue = (String) redisTemplate.opsForValue().get(key);

                if (posValue != null) {
                    String[] coords = posValue.split(",");
                    locations.add(new VehicleLocationDto(
                            Long.parseLong(vehicleId),
                            Double.parseDouble(coords[0]), // latitude
                            Double.parseDouble(coords[1])  // longitude
                    ));
                }
            }
        }
        return locations;
    }

}
