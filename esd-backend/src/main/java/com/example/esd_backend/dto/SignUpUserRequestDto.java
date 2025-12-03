package com.example.esd_backend.dto;

import com.example.esd_backend.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpUserRequestDto {
    private String name;
    private String email;
    private String password;
    private Role role;
}