package com.smartcampus.backend.model.enums;

/**
 * Represents the lifecycle status of a booking.
 *
 * Workflow:
 *   PENDING  → APPROVED or REJECTED
 *   APPROVED → CANCELLED
 *
 * REJECTED and CANCELLED are terminal states.
 */
public enum BookingStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED
}
