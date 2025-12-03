package com.example.esd_backend.mapper;

import com.example.esd_backend.dto.incidentDTOs.IncidentResponseDto;
import com.example.esd_backend.model.Incident;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IncidentMapper {
    
    private static final Logger logger = LoggerFactory.getLogger(IncidentMapper.class);
    
    public static IncidentResponseDto convertToResponseDto(Incident incident) {
        try {
            IncidentResponseDto dto = new IncidentResponseDto();
            dto.setId(incident.getId().intValue());
            dto.setReporterId(incident.getReporter() != null ? incident.getReporter().getId().intValue() : null);
            dto.setType(incident.getType().name().toLowerCase());
            dto.setLatitude(incident.getLatitude());
            dto.setLongitude(incident.getLongitude());
            dto.setStatus(incident.getStatus().name().toLowerCase());
            
            if (incident.getReportTime() != null) {
                dto.setReportTime(java.sql.Timestamp.valueOf(incident.getReportTime()));
            } else {
                logger.warn("Incident {} has null reportTime", incident.getId());
                dto.setReportTime(java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
            }
            
            if (incident.getCapacity() != null) {
                dto.setCapacity(incident.getCapacity());
            } else {
                int capacity = 0;
                if (incident.getAssignTos() != null) {
                    capacity = incident.getAssignTos().size();
                }
                dto.setCapacity(capacity);
            }
            
            dto.setSeverity(incident.getSeverity() != null ? incident.getSeverity() : 1);
            
            logger.debug("Successfully converted incident {} to DTO", incident.getId());
            return dto;
            
        } catch (Exception e) {
            logger.error("Error converting incident {} to DTO: {}", incident.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to convert incident to DTO", e);
        }
    }
}