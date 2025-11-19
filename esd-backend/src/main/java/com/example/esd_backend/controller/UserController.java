package com.example.esd_backend.controller;

import com.example.esd_backend.dto.SignInRequestDto;
import com.example.esd_backend.dto.SignUpUserRequestDto;
import com.example.esd_backend.dto.UserResponsDto;
import com.example.esd_backend.repository.UserRepository;
import com.example.esd_backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    UserService userService;
    UserController(UserService userService , UserRepository userRepository) {
        this.userService = userService;
    }
    @GetMapping("/user/sign-in-dispatcher")
    public UserResponsDto signInpDispatcher(@RequestBody SignInRequestDto signInUserRequestDto) {
        return userService.signInDispatcher(signInUserRequestDto);
    }

    @PostMapping("/user/sign-up-dispatcher")
    public UserResponsDto signUpDispatcher(@RequestBody SignUpUserRequestDto signUpUserRequestDto) {
        return userService.signUpDispatcher(signUpUserRequestDto);
    }
}
