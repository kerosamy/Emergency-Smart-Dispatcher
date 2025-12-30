package com.example.esd_backend.dto.AnalyticsDTOs;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.example.esd_backend.model.enums.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleAnalyticsResponseDTO {
    Integer id;
    Integer capacity;
    StationType type;
    String driver_name;
    String avgResponseTime;
}
