package com.smartcampus.backend.util;

import org.springframework.stereotype.Component;

import com.smartcampus.backend.dto.response.BookingResponseDTO;
import com.smartcampus.backend.model.Booking;

/**
 * Converts Booking entities to response DTOs.
 * Kept as a Spring @Component so it can be injected into services/controllers.
 *
 * Why not use ModelMapper / MapStruct?
 *   - Manual mapping is explicit, easy to read, and has zero reflection cost.
 *   - Easier to explain in the viva.
 */
@Component
public class BookingMapper {

    public BookingResponseDTO toResponse(Booking booking) {
        if (booking == null) return null;

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .userName(booking.getUserName())
                .userEmail(booking.getUserEmail())
                .resourceId(booking.getResourceId())
                .resourceName(booking.getResourceName())
                .resourceType(booking.getResourceType())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .decisionReason(booking.getDecisionReason())
                .decidedBy(booking.getDecidedBy())
                .decidedAt(booking.getDecidedAt())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}