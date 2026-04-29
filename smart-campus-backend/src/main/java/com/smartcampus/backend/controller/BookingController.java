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
import com.smartcampus.backend.model.AppUser;
import com.smartcampus.backend.model.enums.BookingStatus;
import com.smartcampus.backend.service.AuthService;
import com.smartcampus.backend.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

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
        AppUser currentUser = authService.getCurrentUser();
        BookingResponseDTO created =
                bookingService.createBooking(request, currentUser.getId(), currentUser.getUsername(), currentUser.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", created));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyBookings() {
        AppUser currentUser = authService.getCurrentUser();
        List<BookingResponseDTO> mine = bookingService.getMyBookings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("My bookings retrieved", mine));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        AppUser currentUser = authService.getCurrentUser();
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");
        BookingResponseDTO booking =
                bookingService.getBookingById(id, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved", booking));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingUpdateDTO update) {
        AppUser currentUser = authService.getCurrentUser();
        BookingResponseDTO updated =
                bookingService.updateBooking(id, update, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking updated", updated));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable String id,
            @RequestBody(required = false) BookingApprovalDTO dto) {
        AppUser currentUser = authService.getCurrentUser();
        BookingResponseDTO cancelled =
                bookingService.cancelBooking(id, dto, currentUser.getId());
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
        AppUser currentUser = authService.getCurrentUser();
        BookingResponseDTO approved =
                bookingService.approveBooking(id, dto, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking approved", approved));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingApprovalDTO dto) {
        AppUser currentUser = authService.getCurrentUser();
        BookingResponseDTO rejected =
                bookingService.rejectBooking(id, dto, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking rejected", rejected));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}