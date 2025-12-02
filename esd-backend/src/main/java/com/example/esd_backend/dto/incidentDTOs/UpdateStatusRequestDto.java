package com.example.esd_backend.dto.incidentDTOs;

public class UpdateStatusRequestDto {
    private String status;
    

    public UpdateStatusRequestDto() {}
    
    public UpdateStatusRequestDto(String status) {
        this.status = status;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    @Override
    public String toString() {
        return "UpdateStatusRequestDto{" +
                "status='" + status + '\'' +
                '}';
    }
}
