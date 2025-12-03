package com.example.esd_backend.dto.incidentDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ConfirmSolutionRequestDTO {
    private Integer userId;
}
