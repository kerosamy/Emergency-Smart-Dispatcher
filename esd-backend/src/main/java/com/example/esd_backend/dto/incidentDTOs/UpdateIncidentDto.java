package com.example.esd_backend.dto.incidentDTOs;

import com.example.esd_backend.model.enums.IncidentType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UpdateIncidentDto {
    private Integer severity;
    private Integer capacity;
    private IncidentType type;
}
