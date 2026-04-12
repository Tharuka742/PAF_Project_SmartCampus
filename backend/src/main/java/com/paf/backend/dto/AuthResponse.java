package com.paf.backend.dto;

import com.paf.backend.model.Role;

public record AuthResponse(
        String token,
        String userId,
        String username,
        String email,
        Role role) {
}
