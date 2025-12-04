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
        @Index(name = "idx_solved_by_user_id", columnList = "user_id"),
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