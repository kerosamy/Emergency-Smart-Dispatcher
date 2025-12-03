package com.example.esd_backend.dto.incidentDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequestDto {
    
    private Integer reporterId;
    private String type;
    
    @Builder.Default
    private Integer severity = 1;
    
    private double latitude;
    private double longitude;
    
    @Builder.Default
    private String status = "REPORTED";
    
    @Builder.Default
    private Integer capacity = 0;
}