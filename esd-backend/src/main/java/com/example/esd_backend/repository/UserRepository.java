package com.example.esd_backend.repository;

import com.example.esd_backend.model.User;
import com.example.esd_backend.model.enums.Role;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO user (name, email, password, role) VALUES (:#{#user.name}, :#{#user.email}, :#{#user.password}, :#{#user.role.toString()})", 
   nativeQuery = true)
    void insertUser(@Param("user") User user);

    @Transactional
    @Query(value = "SELECT * FROM user WHERE email = :email", 
       nativeQuery = true)
    Optional<User> findByEmail(String email);

    @Transactional
    @Query(value = "SELECT * FROM user WHERE name = :name", 
       nativeQuery = true)
    Optional<User> findByName(String name);
    @Transactional
    @Query(value = "SELECT * FROM user LEFT JOIN vehicle ON user.id = vehicle.user_id WHERE role = :role AND vehicle.id IS NULL", 
       nativeQuery = true)
    List<User> findByRoleAndVehicleIsNull(Role role);

}
