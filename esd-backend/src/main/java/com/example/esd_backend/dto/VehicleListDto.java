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
public class VehicleListDto {
    private Long id;
    private Integer capacity;
    private VehicleStatus vehicleStatus;
    private String stationName;
    private String vehicleType;
    private String responder;
}
