package com.smartcampus.smart_campus_backend.exception;

/**
 * Thrown when a user attempts an action they are not permitted to perform
 * (e.g. a USER trying to approve a booking, or cancelling someone else's booking).
 * Maps to HTTP 403 Forbidden.
 */
public class UnauthorizedActionException extends RuntimeException {
    public UnauthorizedActionException(String message) {
        super(message);
    }
}