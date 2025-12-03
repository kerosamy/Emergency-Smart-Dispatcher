package com.example.esd_backend.dto.incidentDTOs;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponseDto {
    private Integer id;
    private Integer reporterId;
    private String reporterName;
    private String type;
    private Integer severity;
    private double latitude;
    private double longitude;
    private String status;
    private Integer capacity;
    private Timestamp reportTime;
    private Integer assignedVehicleCount;
}