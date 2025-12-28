package com.example.esd_backend.dto.AnalyticsDTOs;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseTimeStatsDTO {

    private String type;
    private Integer day;
    private Integer month;
    private Integer year;
    private Long maxResponseTime;
    private Long minResponseTime;
    private Double avgResponseTime;
    
    private Long totalIncidents;
}
