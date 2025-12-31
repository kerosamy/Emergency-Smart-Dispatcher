package com.example.esd_backend.model;

import com.example.esd_backend.model.enums.IncidentStatus;
import com.example.esd_backend.model.enums.IncidentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "incident",
    indexes = {
        @Index(name = "idx_incident_report_time", columnList = "report_time"),
        @Index(name = "idx_incident_reporter_id", columnList = "reporter_id"),
        @Index(name = "idx_incident_coordinates", columnList = "latitude, longitude")
    }
)
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_time", nullable = false, updatable = false)
    private LocalDateTime reportTime;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;
    
    @Column()
    private Integer severity;
    
    @Column()
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL)
    private List<AssignTo> assignTos = new ArrayList<>();

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL)
    private List<SolvedBy> solvedBIES = new ArrayList<>();
}