package com.example.esd_backend.dto.incidentDTOs;

import java.sql.Timestamp;

public class IncidentResponseDto {
    private Integer id;
    private Integer reporterId;
    private String reporterName;
    private String type;
    private Integer severity;
    private double latitude;
    private double longitude;
    private String location;
    private String status;
    private Integer capacity;
    private Timestamp reportTime;
    private Integer assignedVehicleCount;
    
    public IncidentResponseDto() {}
    
    public IncidentResponseDto(Integer id, Integer reporterId, String type, Integer severity,
                              Integer latitude, Integer longitude, String location, String status, 
                              Integer capacity, Timestamp reportTime) {
        this.id = id;
        this.reporterId = reporterId;
        this.type = type;
        this.severity = severity;
        this.latitude = latitude;
        this.longitude = longitude;
        this.location = location;
        this.status = status;
        this.capacity = capacity;
        this.reportTime = reportTime;
    }
    
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Integer getReporterId() {
        return reporterId;
    }
    
    public void setReporterId(Integer reporterId) {
        this.reporterId = reporterId;
    }
    
    public String getReporterName() {
        return reporterName;
    }
    
    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
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
    
    public Timestamp getReportTime() {
        return reportTime;
    }
    
    public void setReportTime(Timestamp reportTime) {
        this.reportTime = reportTime;
    }
    
    public Integer getAssignedVehicleCount() {
        return assignedVehicleCount;
    }
    
    public void setAssignedVehicleCount(Integer assignedVehicleCount) {
        this.assignedVehicleCount = assignedVehicleCount;
    }
    
    @Override
    public String toString() {
        return "IncidentResponseDto{" +
                "id=" + id +
                ", reporterId=" + reporterId +
                ", reporterName='" + reporterName + '\'' +
                ", type='" + type + '\'' +
                ", severity=" + severity +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", location='" + location + '\'' +
                ", status='" + status + '\'' +
                ", capacity=" + capacity +
                ", reportTime=" + reportTime +
                ", assignedVehicleCount=" + assignedVehicleCount +
                '}';
    }
}