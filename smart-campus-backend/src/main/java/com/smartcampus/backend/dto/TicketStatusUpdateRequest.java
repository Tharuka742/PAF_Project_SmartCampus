package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record TicketStatusUpdateRequest(
        @NotNull(message = "Status is required")
        TicketStatus status,

        String reason
) {}
