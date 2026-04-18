package com.smartcampus.smart_campus_backend.model;

import java.time.LocalDateTime;
import java.util.List;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ⚠️ MINIMAL STUB — owned by Member 1 (Module A: Facilities & Assets Catalogue).
 *
 * This stub exists only so Module B (Booking) code compiles and can look up
 * resources to validate they exist and are ACTIVE before creating a booking.
 *
 * Member 1 will REPLACE this file with the full version containing
 * capacity, location, availability windows, images, etc.
 *
 * DO NOT add booking-specific logic here.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
@Document(collection = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    private String id;

    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String status;
    private String description;
    private String imageUrl;
    private String amenities;
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type; // later you can convert to enum

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Status is required")
    private String status; // ACTIVE / OUT_OF_SERVICE

    private String description;

    private String imageUrl;

    // Better as list instead of string
    private List<String> amenities;

    private List<AvailabilityWindow> availabilityWindows;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
}
