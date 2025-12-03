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
@Table(name = "confirm")
@IdClass(SolvedBy.SolvedById.class)
public class SolvedBy {

    @Id
    @ManyToOne
    @JoinColumn(name = "incident_id")
    private Incident incident;

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "solution_time")
    private LocalDateTime solutionTime;

    // Composite Key Class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SolvedById implements Serializable {
        private Long incident;
        private Long user;
    }
}