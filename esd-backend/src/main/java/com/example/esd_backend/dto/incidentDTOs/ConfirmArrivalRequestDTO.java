package com.example.esd_backend.dto.incidentDTOs;

public class ConfirmArrivalRequestDTO {
    private Integer userId;
    
    public ConfirmArrivalRequestDTO() {}
    
    public ConfirmArrivalRequestDTO(Integer userId) {
        this.userId = userId;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    @Override
    public String toString() {
        return "ConfirmArrivalRequestDTO{" +
                "userId=" + userId +
                '}';
    }
}
