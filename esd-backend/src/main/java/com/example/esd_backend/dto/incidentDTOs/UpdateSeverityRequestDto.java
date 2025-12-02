package com.example.esd_backend.dto.incidentDTOs;

public class UpdateSeverityRequestDto {
    private Integer severity;
    
    // Constructors
    public UpdateSeverityRequestDto() {}
    
    public UpdateSeverityRequestDto(Integer severity) {
        this.severity = severity;
    }
    
    public Integer getSeverity() {
        return severity;
    }
    
    public void setSeverity(Integer severity) {
        this.severity = severity;
    }
    
    @Override
    public String toString() {
        return "UpdateSeverityRequestDto{" +
                "severity=" + severity +
                '}';
    }
}
