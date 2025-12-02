package com.example.esd_backend.service;

import com.example.esd_backend.dto.SignInRequestDto;
import com.example.esd_backend.dto.SignUpUserRequestDto;
import com.example.esd_backend.dto.UnassignedResponderDto;
import com.example.esd_backend.dto.UserResponseDto;
import com.example.esd_backend.mapper.UserMapper;
import com.example.esd_backend.model.enums.Role;
import com.example.esd_backend.model.User;
import com.example.esd_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository , UserMapper userMapper) {

        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }
    public UserResponseDto signInDispatcher (SignInRequestDto signInUserRequestDto) {

        String email = signInUserRequestDto.getEmail();
        String password = signInUserRequestDto.getPassword();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Incorrect password");
        }
        return userMapper.toResponseDto(user);
    }
    public UserResponseDto signUpDispatcher(SignUpUserRequestDto signUpUserRequestDto) {

        // Check if email already exists
        if (userRepository.findByEmail(signUpUserRequestDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = userMapper.toEntity(signUpUserRequestDto);

        user.setRole(Role.DISPATCHER);

        userRepository.save(user);

        return userMapper.toResponseDto(user);
    }

    public List<UnassignedResponderDto> getUnassignedResponders() {
        return userRepository.findByRoleAndVehicleIsNull(Role.RESPONDER).stream()
                .map(u -> new UnassignedResponderDto(u.getName()))
                .toList();
    }
}

