package com.smartcampus.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.dto.request.BookingApprovalDTO;
import com.smartcampus.backend.dto.request.BookingRequestDTO;
import com.smartcampus.backend.dto.request.BookingUpdateDTO;
import com.smartcampus.backend.dto.response.ApiResponse;
import com.smartcampus.backend.dto.response.BookingResponseDTO;
import com.smartcampus.backend.model.enums.BookingStatus;
import com.smartcampus.backend.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    private final BookingService bookingService;

    // Dev-mode user identity — no auth wired in.
    private static final String DEV_USER_ID = "dev-user";
    private static final String DEV_USER_NAME = "Dev User";
    private static final String DEV_USER_EMAIL = "dev@smartcampus.local";
    private static final boolean DEV_IS_ADMIN = true;

    @GetMapping("/check-conflict")
    public boolean checkConflict(
            @RequestParam String location,
            @RequestParam String start,
            @RequestParam String end
    ) {
        return bookingService.hasConflict(
                location,
                LocalDateTime.parse(start),
                LocalDateTime.parse(end)
        );
    }

    @GetMapping("/suggest-slots")
    public List<String> suggestSlots(
            @RequestParam String location,
            @RequestParam String date
    ) {
        return bookingService.suggestSlots(location, date);
    }

    // ================= USER =================

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        BookingResponseDTO created =
                bookingService.createBooking(request, DEV_USER_ID, DEV_USER_NAME, DEV_USER_EMAIL);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", created));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyBookings() {
        List<BookingResponseDTO> mine = bookingService.getMyBookings(DEV_USER_ID);
        return ResponseEntity.ok(ApiResponse.success("My bookings retrieved", mine));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        BookingResponseDTO booking =
                bookingService.getBookingById(id, DEV_USER_ID, DEV_IS_ADMIN);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved", booking));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingUpdateDTO update) {
        BookingResponseDTO updated =
                bookingService.updateBooking(id, update, DEV_USER_ID);
        return ResponseEntity.ok(ApiResponse.success("Booking updated", updated));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable String id,
            @RequestBody(required = false) BookingApprovalDTO dto) {
        BookingResponseDTO cancelled =
                bookingService.cancelBooking(id, dto, DEV_USER_ID);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", cancelled));
    }

    // ================= ADMIN =================

    @GetMapping
    public ResponseEntity<?> getAllBookings(
            @RequestParam(required = false) BookingStatus status) {
        List<BookingResponseDTO> all = bookingService.getAllBookings(status);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", all));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(
            @PathVariable String id,
            @RequestBody(required = false) BookingApprovalDTO dto) {
        BookingResponseDTO approved =
                bookingService.approveBooking(id, dto, DEV_USER_ID);
        return ResponseEntity.ok(ApiResponse.success("Booking approved", approved));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingApprovalDTO dto) {
        BookingResponseDTO rejected =
                bookingService.rejectBooking(id, dto, DEV_USER_ID);
        return ResponseEntity.ok(ApiResponse.success("Booking rejected", rejected));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
