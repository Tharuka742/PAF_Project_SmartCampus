package com.smartcampus.smart_campus_backend.dto;

import com.smartcampus.smart_campus_backend.model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTicketStatusRequest {
    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String resolutionNotes;
    private String rejectedReason;
}
