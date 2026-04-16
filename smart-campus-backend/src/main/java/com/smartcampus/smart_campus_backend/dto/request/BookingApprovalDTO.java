package com.smartcampus.smart_campus_backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload used by Admin when approving / rejecting / cancelling a booking.
 * The 'reason' field is required when rejecting or cancelling
 * (enforced in the service layer, not here, so the same DTO works for both).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingApprovalDTO {

    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;
}
