package com.example.esd_backend.controller;

import com.example.esd_backend.dto.*;
import com.example.esd_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping ("/sign-in")
    public ResponseEntity<JwtResponseDto> signInpDispatcher(@RequestBody SignInRequestDto signInUserRequestDto) {
        return ResponseEntity.ok(userService.signInDispatcher(signInUserRequestDto));
    }

    @PostMapping("/add-user")
    public ResponseEntity<Void> addUser(@RequestBody SignUpUserRequestDto signUpUserRequestDto) {
        userService.addUser(signUpUserRequestDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unassigned")
    public ResponseEntity<List<UnassignedResponderDto>> getUnassignedResponders() {
        List<UnassignedResponderDto> responders = userService.getUnassignedResponders();
        return ResponseEntity.ok(responders);
    }
}