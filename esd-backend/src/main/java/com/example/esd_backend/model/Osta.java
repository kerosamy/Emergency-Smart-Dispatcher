package com.example.esd_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Osta {
    private Long id;
    private String name;
    private int score;
}
