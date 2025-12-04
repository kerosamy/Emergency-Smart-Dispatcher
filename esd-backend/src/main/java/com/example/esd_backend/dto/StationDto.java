package com.example.esd_backend.dto;

import com.example.esd_backend.model.enums.StationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StationDto {
    private long id;
    private String name;
    private Double latitude;
    private Double longitude;
    private StationType type;
}
