package com.example.esd_backend.dto;

import com.example.esd_backend.model.enums.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {
    private Integer capacity;
    private VehicleStatus vehicleStatus;
    private String stationName;
}
