package com.example.esd_backend.dto.incidentDTOs;

import com.example.esd_backend.model.enums.IncidentType;

public class UpdateIncidentDto {
    private Integer severity;
    private Integer capacity;
    private IncidentType type;

    public Integer getSeverity() {
        return severity;
    }
    public void setSeverity(Integer severity) {
        this.severity = severity;
    }
    public Integer getCapacity() {
        return capacity;
    }
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    public IncidentType getType() {
        return type;
    }
    public void setType(IncidentType type) {
        this.type = type;
    }
}
