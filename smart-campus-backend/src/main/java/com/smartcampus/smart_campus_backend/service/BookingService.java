package com.smartcampus.smart_campus_backend.service;
import java.time.LocalDateTime;
import java.util.List;

import com.smartcampus.smart_campus_backend.dto.request.BookingApprovalDTO;
import com.smartcampus.smart_campus_backend.dto.request.BookingRequestDTO;
import com.smartcampus.smart_campus_backend.dto.request.BookingUpdateDTO;
import com.smartcampus.smart_campus_backend.dto.response.BookingResponseDTO;
import com.smartcampus.smart_campus_backend.model.enums.BookingStatus;

/**
 * Service contract for Booking Management (Module B).
 * Defines all business operations exposed to the controller layer.
 */
public interface BookingService {

    // ---------- User operations ----------

    /** Create a new booking request (status = PENDING). */
    BookingResponseDTO createBooking(BookingRequestDTO request, String userId,
                                     String userName, String userEmail);

    /** Update an existing PENDING booking (only the owner can do this). */
    BookingResponseDTO updateBooking(String bookingId, BookingUpdateDTO update, String userId);

    /** Cancel an APPROVED booking (only the owner). */
    BookingResponseDTO cancelBooking(String bookingId, BookingApprovalDTO dto, String userId);

    /** Get a single booking by id. Owner or Admin only. */
    BookingResponseDTO getBookingById(String bookingId, String requesterId, boolean isAdmin);

    /** Get all bookings of the current user. */
    List<BookingResponseDTO> getMyBookings(String userId);

    // ---------- Admin operations ----------

    /** Admin: list all bookings, optionally filtered by status. */
    List<BookingResponseDTO> getAllBookings(BookingStatus statusFilter);

    /** Admin: approve a PENDING booking. */
    BookingResponseDTO approveBooking(String bookingId, BookingApprovalDTO dto, String adminId);

    /** Admin: reject a PENDING booking with a reason. */
    BookingResponseDTO rejectBooking(String bookingId, BookingApprovalDTO dto, String adminId);

    /** Admin: hard-delete a booking (rare — kept for DELETE endpoint compliance). */
    void deleteBooking(String bookingId);

        
    /** Check if a given time slot at a location has any APPROVED booking conflicts. */
    boolean hasConflict(String location, LocalDateTime localDateTime, LocalDateTime localDateTime2);
    
    /** suggest available time slots for a given location and date */
    List<String> suggestSlots(String location, String date);

}