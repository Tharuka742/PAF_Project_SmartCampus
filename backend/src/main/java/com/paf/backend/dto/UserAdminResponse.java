package com.paf.backend.dto;

import com.paf.backend.model.AuthProvider;
import com.paf.backend.model.Role;

public record UserAdminResponse(
        String id,
        String username,
        String email,
        Role role,
        AuthProvider provider) {
}