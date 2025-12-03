package com.example.esd_backend.config;

import com.example.esd_backend.model.User;
import com.example.esd_backend.model.enums.Role;
import com.example.esd_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SuperAdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public SuperAdminInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@example.com";

        boolean exists = userRepository.findByEmail(adminEmail).isPresent();
        if (exists) {
            return; // Already exists, do nothing
        }

        User superAdmin = new User();
        superAdmin.setEmail(adminEmail);
        superAdmin.setPassword("admin123"); // TODO: consider hashing the password
        superAdmin.setRole(Role.DISPATCHER);
        superAdmin.setName("Super Admin");

        userRepository.save(superAdmin);

        System.out.println("Super admin created: " + adminEmail);
    }
}
