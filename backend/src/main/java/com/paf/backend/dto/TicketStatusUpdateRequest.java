package com.paf.backend.dto;

import com.paf.backend.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record TicketStatusUpdateRequest(
        @NotNull(message = "Status is required")
        TicketStatus status,

        String reason
) {}
