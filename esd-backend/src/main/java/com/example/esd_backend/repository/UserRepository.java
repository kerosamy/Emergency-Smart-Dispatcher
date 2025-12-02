package com.example.esd_backend.repository;

import com.example.esd_backend.model.User;
import com.example.esd_backend.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    List<User> findByRoleAndVehicleIsNull(Role role);

}
