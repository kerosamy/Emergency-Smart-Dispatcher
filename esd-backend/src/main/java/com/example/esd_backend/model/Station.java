package com.example.esd_backend.model;

import com.example.esd_backend.model.enums.StationType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "station",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"latitude", "longitude"})
        }
)
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StationType type;

    @OneToMany(mappedBy = "station" , cascade = CascadeType.ALL)
    private List<Vehicle> vehicles = new ArrayList<>();

}
