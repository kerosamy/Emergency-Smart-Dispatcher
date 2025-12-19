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
@Table(name = "assign_to",
    indexes = {
        @Index(name = "idx_assign_to_incident_id", columnList = "incident_id"),
        @Index(name = "idx_assign_to_vehicle_id", columnList = "vehicle_id"),
    }
)
@IdClass(AssignTo.AssignToId.class)
public class AssignTo {

    @Id
    @ManyToOne
    @JoinColumn(name = "incident_id")
    private Incident incident;

    @Id
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "assign_time", nullable = false, updatable = false)
    private LocalDateTime assignTime;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignToId implements Serializable {
        private Long incident;
        private Long vehicle;
    }
}