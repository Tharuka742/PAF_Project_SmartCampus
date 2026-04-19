package com.smartcampus.backend.model;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.smartcampus.backend.model.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Booking entity representing a resource reservation.
 * Stored in the "bookings" MongoDB collection.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    // --- Who is booking ---
    @Indexed
    private String userId;          // ID of the user who made the booking
    private String userEmail;       // stored for quick display/audit
    private String userName;

    // --- What is being booked ---
    @Indexed
    private String resourceId;      // references Resource (Member 1's module)
    private String resourceName;    // snapshot for display
    private String resourceType;    // e.g. LECTURE_HALL, LAB, EQUIPMENT

    //Location 
    private String location;

    // --- When ---
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // --- Booking details ---
    private String purpose;         // reason for booking
    private Integer expectedAttendees;

    // --- Workflow ---
    @Indexed
    private BookingStatus status;   // PENDING / APPROVED / REJECTED / CANCELLED

    // --- Admin decision info ---
    private String decisionReason;  // reason when rejected / cancelled
    private String decidedBy;       // admin user id who approved/rejected
    private LocalDateTime decidedAt;

    // --- Auditing ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}