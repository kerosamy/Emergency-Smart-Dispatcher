package com.example.esd_backend;

import com.example.esd_backend.model.User;
import com.example.esd_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EsdBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(EsdBackendApplication.class, args);
	}
//	@Bean
//	public CommandLineRunner commandLineRunner(UserRepository userRepository) {
//		return args -> {
//			User user = User.builder().name("KERO").email("1029").password("DDDDDD").build();;
//			userRepository.save(user);
//		};
//	}

}
