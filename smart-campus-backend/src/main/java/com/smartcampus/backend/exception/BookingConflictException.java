package com.smartcampus.backend.exception;

/**
 * Thrown when a booking overlaps with an existing APPROVED or PENDING booking
 * for the same resource.
 * Maps to HTTP 409 Conflict.
 */
public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}