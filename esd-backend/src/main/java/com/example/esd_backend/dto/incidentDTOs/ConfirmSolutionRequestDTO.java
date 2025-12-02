package com.example.esd_backend.dto.incidentDTOs;

public class ConfirmSolutionRequestDTO {
    private Integer userId;
    
    public ConfirmSolutionRequestDTO() {}
    
    public ConfirmSolutionRequestDTO(Integer userId) {
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
        return "ConfirmSolutionRequestDTO{" +
                "userId=" + userId +
                '}';
    }
}
