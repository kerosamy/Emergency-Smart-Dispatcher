package com.example.esd_backend.dto.AnalyticsDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSeriesDataPointDTO {
    private String date;
    private Double avgResponseTime;
    private Long incidentCount;
    private String type;}