package com.example.esd_backend.mapper;

import com.example.esd_backend.dto.VehicleDto;
import com.example.esd_backend.model.Station;
import com.example.esd_backend.model.Vehicle;

public class VehicleMapper {
    public static Vehicle toEntity(VehicleDto dto, Station station) {
        return Vehicle.builder()
                .capacity(dto.getCapacity())
                .vehicleStatus(dto.getVehicleStatus())
                .station(station)
                .build();
    }
}
