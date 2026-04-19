package com.smartcampus.backend.exception;

/**
 * Thrown when a requested entity (Booking, Resource, User) is not found.
 * Maps to HTTP 404 Not Found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String entity, String id) {
        super(String.format("%s not found with id: %s", entity, id));
    }
}