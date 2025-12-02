package com.example.esd_backend.dto.incidentDTOs;

public class IncidentRequestDto {
    
    private Integer reporterId;
    private String type;
    private Integer severity;
    
    private double latitude;
    private double longitude;
    private String location;
    
    private String status;
    
    private Integer capacity;
    
    public IncidentRequestDto() {
        this.status = "REPORTED";
        this.capacity = 0;
    }
    
    public IncidentRequestDto(Integer reporterId, String type, Integer severity, 
                             Integer latitude, Integer longitude, Integer capacity) {
        this.reporterId = reporterId;
        this.type = type;
        this.severity = severity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = "REPORTED";
        this.capacity = capacity != null ? capacity : 0;
    }

    public IncidentRequestDto(Integer reporterId, String type, 
                             Integer latitude, Integer longitude, Integer capacity) {
        this.reporterId = reporterId;
        this.type = type;
        this.severity = 1;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = "REPORTED";
        this.capacity = capacity != null ? capacity : 0;
    }
    
    public Integer getReporterId() {
        return reporterId;
    }
    
    public void setReporterId(Integer reporterId) {
        this.reporterId = reporterId;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Integer getSeverity() {
        return severity;
    }
    
    public void setSeverity(Integer severity) {
        this.severity = severity;
    }
    
    public double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
    
    public double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    @Override
    public String toString() {
        return "IncidentRequestDTO{" +
                "reporterId=" + reporterId +
                ", type='" + type + '\'' +
                ", severity=" + severity +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", status='" + status + '\'' +
                ", capacity=" + capacity +
                '}';
    }
}