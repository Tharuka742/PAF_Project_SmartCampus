package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.Role;

public record AuthResponse(
        String token,
        String userId,
        String username,
        String email,
        Role role) {
}
