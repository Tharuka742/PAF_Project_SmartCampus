package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.Role;
import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(
        @NotNull(message = "Role is required") Role role,
        String code) {
}
