package com.smartcampus.smart_campus_backend.model;

import java.time.LocalDateTime;
import java.util.List;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private List<AvailabilityWindow> availabilityWindows;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
