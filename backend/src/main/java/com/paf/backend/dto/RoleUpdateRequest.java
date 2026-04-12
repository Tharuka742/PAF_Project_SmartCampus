package com.paf.backend.dto;

import com.paf.backend.model.Role;
import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(
        @NotNull(message = "Role is required") Role role,
        String code) {
}
