package com.example.esd_backend.model;

import com.example.esd_backend.model.enums.StationType;
import com.example.esd_backend.model.enums.VehicleStatus;
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

@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer Capacity;

    @Column(nullable = false)
    private StationType stationType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus vehicleStatus;

    @ManyToOne()
    @JoinColumn(name = "station_id")
    private Station station;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<IncidentVehicle> incidentVehicles = new ArrayList<>();


    @OneToOne
    @JoinColumn(name = "user_id")
    private User driver;



}
