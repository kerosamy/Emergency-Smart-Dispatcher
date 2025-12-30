package com.example.esd_backend.dto.AnalyticsDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSeriesResponseDTO {
    private List<TimeSeriesDataPointDTO> dataPoints;
    private String chartType;
}
