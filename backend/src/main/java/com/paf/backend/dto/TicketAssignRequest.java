package com.paf.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record TicketAssignRequest(
        @NotBlank(message = "Technician user ID is required")
        String technicianId
) {}
