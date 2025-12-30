package com.example.esd_backend;

import com.example.esd_backend.model.User;
import com.example.esd_backend.repository.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class EsdBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(EsdBackendApplication.class, args);
	}
}
