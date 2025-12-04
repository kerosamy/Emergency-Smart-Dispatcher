package com.example.esd_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleAssignmentDto {
    private Long vehicleId;
    private String stationName;
    private String driverEmail;
}
