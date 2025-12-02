package com.example.esd_backend.dto.incidentDTOs;

public class AssignVehicleResponseDto {
    
    private String message;
    private Integer vehicleId;
    private Integer userId;
    private boolean success;
    
    public AssignVehicleResponseDto() {}
    
    public AssignVehicleResponseDto(String message, Integer vehicleId, Integer userId, boolean success) {
        this.message = message;
        this.vehicleId = vehicleId;
        this.userId = userId;
        this.success = success;
    }
    
    public static AssignVehicleResponseDto success(String message, Integer vehicleId, Integer userId) {
        return new AssignVehicleResponseDto(message, vehicleId, userId, true);
    }
    
    public static AssignVehicleResponseDto failure(String message) {
        return new AssignVehicleResponseDto(message, null, null, false);
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Integer getVehicleId() {
        return vehicleId;
    }
    
    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    @Override
    public String toString() {
        return "AssignVehicleResponseDto{" +
                "message='" + message + '\'' +
                ", vehicleId=" + vehicleId +
                ", userId=" + userId +
                ", success=" + success +
                '}';
    }
}
