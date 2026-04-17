package com.smartcampus.smart_campus_backend.repository;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.smartcampus.smart_campus_backend.model.Booking;
import com.smartcampus.smart_campus_backend.model.enums.BookingStatus;

/**
 * MongoDB repository for Booking documents.
 * Spring Data auto-implements these methods based on naming conventions.
 */
@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // ---------- Basic lookups ----------

    /** Find all bookings made by a specific user. */
    List<Booking> findByUserId(String userId);

    /** Find all bookings for a specific resource. */
    List<Booking> findByResourceId(String resourceId);

    /** Find all bookings with a given status (e.g. all PENDING). */
    List<Booking> findByStatus(BookingStatus status);

    /** Find a user's bookings filtered by status. */
    List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);

    // ---------- Admin filters ----------

    /** Filter bookings for admin dashboard by resource + status. */
    List<Booking> findByResourceIdAndStatus(String resourceId, BookingStatus status);

    // ---------- ⭐ CONFLICT DETECTION ⭐ ----------

    /**
     * Finds any booking on the same resource whose time range OVERLAPS
     * with the requested [newStart, newEnd] window, AND whose status is
     * considered "blocking" (e.g. PENDING or APPROVED).
     *
     * Two time ranges [a,b] and [c,d] overlap when:  a < d  AND  c < b
     *
     * This query is the single most important piece of Module B —
     * it prevents double-booking, which is a core requirement.
     */
        @Query("{ " +
                "'location': ?0, " +
                "'status': { $in: ?3 }, " +
                "'startTime': { $lt: ?2 }, " +
                "'endTime':   { $gt: ?1 } " +
                "}")
        List<Booking> findConflictingBookingsByLocation(
                String location,
                LocalDateTime newStart,
                LocalDateTime newEnd,
                List<BookingStatus> blockingStatuses
        );

    /**
     * Same as above but excludes a specific booking id.
     * Used when UPDATING an existing booking — you don't want it
     * to conflict with itself.
     */
        @Query("{ " +
                "'location': ?0, " +
                "'_id': { $ne: ?4 }, " +
                "'status': { $in: ?3 }, " +
                "'startTime': { $lt: ?2 }, " +
                "'endTime':   { $gt: ?1 } " +
                "}")
        List<Booking> findConflictingBookingsByLocationExcludingId(
                String location,
                LocalDateTime newStart,
                LocalDateTime newEnd,
                List<BookingStatus> blockingStatuses,
                String excludeBookingId
        );

    // ---------- Date-range queries (useful for analytics / calendar view) ----------

    /** All bookings on a resource within a date window (for calendar UI). */
    List<Booking> findByResourceIdAndStartTimeBetween(
            String resourceId,
            LocalDateTime from,
            LocalDateTime to
    );
}