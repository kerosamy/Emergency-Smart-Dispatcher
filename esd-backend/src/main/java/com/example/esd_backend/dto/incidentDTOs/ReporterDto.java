package com.example.esd_backend.dto.incidentDTOs;

public class ReporterDto {
    private Long id;
    private String name;
    
    public ReporterDto() {}
    
    public ReporterDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    @Override
    public String toString() {
        return "ReporterDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}