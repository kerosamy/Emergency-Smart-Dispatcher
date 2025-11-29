package com.example.esd_backend.model;

import com.example.esd_backend.model.enums.Role;
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
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true , nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SolvedBy> solvedBIES = new ArrayList<>();

    @OneToMany(mappedBy = "reporter" , cascade = CascadeType.ALL)
    private List<Incident> userReports = new ArrayList<>();

    @OneToOne(mappedBy = "driver" , cascade = CascadeType.ALL)
    private Vehicle vehicle;


}
