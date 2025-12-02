package com.example.esd_backend.service;

import com.example.esd_backend.dto.UnassignedVehicleDto;
import com.example.esd_backend.dto.VehicleAssignmentDto;
import com.example.esd_backend.dto.VehicleDto;
import com.example.esd_backend.mapper.VehicleMapper;
import com.example.esd_backend.model.Station;
import com.example.esd_backend.model.User;
import com.example.esd_backend.model.Vehicle;
import com.example.esd_backend.repository.StationRepository;
import com.example.esd_backend.repository.UserRepository;
import com.example.esd_backend.repository.VehicleRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;

    public VehicleService(VehicleRepository vehicleRepository, StationRepository stationRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.stationRepository = stationRepository;
        this.userRepository = userRepository;
    }

    public Vehicle addVehicle(VehicleDto vehicleDto) {
        Station station = stationRepository.findByName(vehicleDto.getStationName())
                .orElseThrow(() -> new RuntimeException("station does not exist"));
        Vehicle vehicle = VehicleMapper.toEntity(vehicleDto, station);
        vehicle.setStationType(station.getType());
        station.getVehicles().add(vehicle);
        return vehicleRepository.save(vehicle);
    }

    public List<UnassignedVehicleDto> getUnassignedVehicles() {
        return vehicleRepository.findByDriverIsNull().stream()
                .map(v -> new UnassignedVehicleDto(v.getId(), v.getStation().getName()))
                .toList();
    }

    public VehicleAssignmentDto assignResponder(Long vehicleId, String name) {
        Vehicle vehicle =vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
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

        return new VehicleAssignmentDto(vehicle.getId(), vehicle.getStation().getName(), user.getName());
    }
}
