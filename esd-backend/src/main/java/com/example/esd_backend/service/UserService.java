package com.example.esd_backend.service;

import com.example.esd_backend.dto.*;
import com.example.esd_backend.mapper.UserMapper;
import com.example.esd_backend.model.enums.Role;
import com.example.esd_backend.model.User;
import com.example.esd_backend.repository.UserRepository;
import com.example.esd_backend.security.JwtService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository , UserMapper userMapper , JwtService jwtService) {

        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.jwtService = jwtService;
    }
    public JwtResponseDto signInDispatcher (SignInRequestDto signInUserRequestDto) {

        String email = signInUserRequestDto.getEmail();
        String password = signInUserRequestDto.getPassword();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Incorrect password");
        }
        if (!user.getRole().equals(Role.DISPATCHER)) {
            throw new RuntimeException("User is not a dispatcher");
        }

        return new JwtResponseDto(jwtService.generateToken(user));
    }
    public void addUser(SignUpUserRequestDto signUpUserRequestDto) {

        // Check if email already exists
        if (userRepository.findByEmail(signUpUserRequestDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = userMapper.toEntity(signUpUserRequestDto);

        userRepository.save(user);
    }

    public List<UnassignedResponderDto> getUnassignedResponders() {
        return userRepository.findByRoleAndVehicleIsNull(Role.RESPONDER).stream()
                .map(u -> new UnassignedResponderDto(u.getId(), u.getEmail()))
                .toList();
    }
}

