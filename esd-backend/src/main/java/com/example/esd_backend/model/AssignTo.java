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
@Table(name = "assign_to")
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

    // Composite Key Class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignToId implements Serializable {
        private Long incident;
        private Long vehicle;
    }
}