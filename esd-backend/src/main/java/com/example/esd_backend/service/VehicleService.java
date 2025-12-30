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
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final AutoAssign autoAssign;
    private final RedisService redisService;
    private final NotificationService notificationService;

    public VehicleService(VehicleRepository vehicleRepository,
                          StationRepository stationRepository,
                          UserRepository userRepository,
                          AutoAssign autoAssign,
                          RedisService redisService,
                          NotificationService notificationService) {
        this.vehicleRepository = vehicleRepository;
        this.stationRepository = stationRepository;
        this.userRepository = userRepository;
        this.autoAssign = autoAssign;
        this.redisService = redisService;
        this.notificationService = notificationService;
    }

    public void addVehicle(VehicleDto vehicleDto) {
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
        autoAssign.handleNewVehicle(savedVehicle);
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
        return redisService.getAllVehicles();
    }

    public void moveVehicle (VehicleTypeDto dto){
        VehicleLocationDto newDto = new VehicleLocationDto(dto.getId(),dto.getLatitude(),dto.getLongitude());
        redisService.save(newDto);
        notificationService.notifyMovingVehicle(dto);
    }

    public void setAvailableVehicle (Long id){
        Vehicle vehicle = vehicleRepository.SearchId(id);
        vehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
        notificationService.notifyRemovingVehicle(id);
        autoAssign.handleNewVehicle(vehicle);
    }
}
