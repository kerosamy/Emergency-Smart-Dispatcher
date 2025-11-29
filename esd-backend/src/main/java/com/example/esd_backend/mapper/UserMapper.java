package com.example.esd_backend.mapper;

import com.example.esd_backend.dto.SignUpUserRequestDto;
import com.example.esd_backend.dto.UserResponseDto;
import com.example.esd_backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User toEntity(SignUpUserRequestDto dto) {
        return User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())  // TODO: hash later
                .build();
    }

    public UserResponseDto toResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
