package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.AuthProvider;
import com.smartcampus.backend.model.Role;

public record UserAdminResponse(
        String id,
        String username,
        String email,
        Role role,
        AuthProvider provider) {
}