package com.luca.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * Returns the current logged-in owner. The admin UI calls this (with HTTP Basic
     * credentials) to check whether the login worked. If not authenticated, Spring
     * Security returns 401 before this method is reached.
     */
    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        return Map.of(
                "username", auth.getName(),
                "authorities", auth.getAuthorities()
        );
    }
}
