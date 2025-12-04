package com.example.esd_backend.mapper;

import com.example.esd_backend.dto.VehicleDto;
import com.example.esd_backend.dto.VehicleListDto;
import com.example.esd_backend.model.Station;
import com.example.esd_backend.model.Vehicle;

public class VehicleMapper {
    public static Vehicle toEntity(VehicleDto dto, Station station) {
        return Vehicle.builder()
                .capacity(dto.getCapacity())
                .vehicleStatus(dto.getVehicleStatus())
                .station(station)
                .stationType(station.getType())
                .build();
    }

    public static VehicleListDto toListDto(Vehicle entity) {
        return VehicleListDto.builder()
                .id(entity.getId())
                .capacity(entity.getCapacity())
                .vehicleStatus(entity.getVehicleStatus())
                .stationName(entity.getStation().getName())
                .stationLatitude(entity.getStation().getLatitude())
                .stationLongitude(entity.getStation().getLongitude())
                .vehicleType(entity.getStationType().toString())
                .responder(entity.getDriver() != null ? entity.getDriver().getEmail() : null)
                .build();
    }
}
