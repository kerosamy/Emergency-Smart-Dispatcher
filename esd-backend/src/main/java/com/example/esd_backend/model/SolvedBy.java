package com.example.esd_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "confirm",
    indexes = {
        @Index(name = "idx_solved_by_incident_id", columnList = "incident_id"),
        @Index(name = "idx_solved_by_vehicle_id", columnList = "vehicle_id"),
    }
)
@IdClass(SolvedBy.SolvedById.class)
public class SolvedBy {

    @Id
    @ManyToOne
    @JoinColumn(name = "incident_id")
    private Incident incident;

    @Id
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "solution_time")
    private LocalDateTime solutionTime;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SolvedById implements Serializable {
        private Long incident;
        private Long vehicle;
    }
}