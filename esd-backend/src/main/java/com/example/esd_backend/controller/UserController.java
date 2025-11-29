package com.example.esd_backend.controller;

import com.example.esd_backend.dto.SignInRequestDto;
import com.example.esd_backend.dto.SignUpUserRequestDto;
import com.example.esd_backend.dto.UserResponseDto;
import com.example.esd_backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/sign-in")
    public UserResponseDto signInpDispatcher(@RequestBody SignInRequestDto signInUserRequestDto) {
        return userService.signInDispatcher(signInUserRequestDto);
    }

    @PostMapping("/sign-up")
    public UserResponseDto signUpDispatcher(@RequestBody SignUpUserRequestDto signUpUserRequestDto) {
        return userService.signUpDispatcher(signUpUserRequestDto);
    }
}