package com.smartcampus.smart_campus_backend.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smartcampus.smart_campus_backend.model.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response payload sent to clients.
 * Flattened, safe projection of the Booking entity.
 *
 * All date fields serialized as ISO-8601 strings for easy JavaScript parsing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {

    private String id;

    // user info
    private String userId;
    private String userName;
    private String userEmail;

    // resource info
    private String resourceId;
    private String resourceName;
    private String resourceType;

    // timing
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    // details
    private String purpose;
    private Integer expectedAttendees;

    // workflow
    private BookingStatus status;

    // admin decision
    private String decisionReason;
    private String decidedBy;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime decidedAt;

    // auditing
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
}