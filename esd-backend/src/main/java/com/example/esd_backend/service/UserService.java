package com.example.esd_backend.service;

import com.example.esd_backend.dto.SignInRequestDto;
import com.example.esd_backend.dto.SignUpUserRequestDto;
import com.example.esd_backend.dto.UserResponsDto;
import com.example.esd_backend.model.Role;
import com.example.esd_backend.model.User;
import com.example.esd_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public UserResponsDto signInDispatcher (SignInRequestDto signInUserRequestDto) {

        String email = signInUserRequestDto.getEmail();
        String password = signInUserRequestDto.getPassword();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Incorrect password");
        }
        return mappingUserToDto(user);
    }
    public UserResponsDto signUpDispatcher(SignUpUserRequestDto signUpUserRequestDto) {

        // Check if email already exists
        if (userRepository.findByEmail(signUpUserRequestDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Convert DTO → Entity
        User user = mappingDtoToUser(signUpUserRequestDto);

        // Assign role for dispatcher
        user.setRole(Role.DISPATCHER);

        // Save to DB
        userRepository.save(user);

        // Convert back to DTO
        return mappingUserToDto(user);
    }

    private User mappingDtoToUser(SignUpUserRequestDto dto) {
        return User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())  // TODO: hash later
                .build();
    }

    private UserResponsDto mappingUserToDto(User user) {
        return UserResponsDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}

