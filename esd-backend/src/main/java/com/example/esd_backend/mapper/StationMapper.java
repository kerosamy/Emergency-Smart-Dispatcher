package com.example.esd_backend.mapper;

import com.example.esd_backend.dto.StationDto;
import com.example.esd_backend.model.Station;

public class StationMapper {
    public static Station toEntity(StationDto dto) {
        return Station.builder()
                .name(dto.getName())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .type(dto.getType())
                .build();
    }
}
