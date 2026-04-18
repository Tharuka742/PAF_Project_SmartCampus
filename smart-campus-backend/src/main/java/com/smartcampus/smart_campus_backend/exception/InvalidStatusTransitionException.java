package com.smartcampus.smart_campus_backend.exception;

import com.smartcampus.smart_campus_backend.model.enums.BookingStatus;

/**
 * Thrown when an illegal status change is attempted
 * (e.g. trying to APPROVE a CANCELLED booking).
 * Maps to HTTP 400 Bad Request.
 */
public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(BookingStatus from, BookingStatus to) {
        super(String.format("Invalid status transition: %s → %s", from, to));
    }

    public InvalidStatusTransitionException(String message) {
        super(message);
    }
}