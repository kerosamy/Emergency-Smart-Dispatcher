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
public class StationNameTypeDto {
    private String name;
    private StationType type;
}
