package com.smartcampus.smart_campus_backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
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

import com.smartcampus.smart_campus_backend.dto.request.BookingApprovalDTO;
import com.smartcampus.smart_campus_backend.dto.request.BookingRequestDTO;
import com.smartcampus.smart_campus_backend.dto.request.BookingUpdateDTO;
import com.smartcampus.smart_campus_backend.dto.response.ApiResponse;
import com.smartcampus.smart_campus_backend.dto.response.BookingResponseDTO;
import com.smartcampus.smart_campus_backend.model.enums.BookingStatus;
import com.smartcampus.smart_campus_backend.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    private final BookingService bookingService;

    private ResponseEntity<ApiResponse<?>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("User not authenticated"));
    }

    // ================= CONFLICT API =================

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


    // ================= SUGGESTION API =================

    @GetMapping("/suggest-slots")
    public List<String> suggestSlots(
            @RequestParam String location,
            @RequestParam String date
    ) {
        return bookingService.suggestSlots(location, date);
    }


    // ================= USER =================

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        String userId    = principal.getSubject();
        String userEmail = principal.getEmail();
        String userName  = principal.getFullName();

        // 🔥 DEBUG LOG (optional)
        System.out.println("Creating booking: " + request);

        BookingResponseDTO created =
                bookingService.createBooking(request, userId, userName, userEmail);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", created));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getMyBookings(
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        List<BookingResponseDTO> mine =
                bookingService.getMyBookings(principal.getSubject());

        return ResponseEntity.ok(ApiResponse.success("My bookings retrieved", mine));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getBookingById(
            @PathVariable String id,
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        BookingResponseDTO booking =
                bookingService.getBookingById(id, principal.getSubject(), isAdmin);

        return ResponseEntity.ok(ApiResponse.success("Booking retrieved", booking));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> updateBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingUpdateDTO update,
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        BookingResponseDTO updated =
                bookingService.updateBooking(id, update, principal.getSubject());

        return ResponseEntity.ok(ApiResponse.success("Booking updated", updated));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> cancelBooking(
            @PathVariable String id,
            @RequestBody(required = false) BookingApprovalDTO dto,
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        BookingResponseDTO cancelled =
                bookingService.cancelBooking(id, dto, principal.getSubject());

        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", cancelled));
    }

    // ================= ADMIN =================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        List<BookingResponseDTO> all = bookingService.getAllBookings(status);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", all));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveBooking(
            @PathVariable String id,
            @RequestBody(required = false) BookingApprovalDTO dto,
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        BookingResponseDTO approved =
                bookingService.approveBooking(id, dto, principal.getSubject());

        return ResponseEntity.ok(ApiResponse.success("Booking approved", approved));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingApprovalDTO dto,
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        BookingResponseDTO rejected =
                bookingService.rejectBooking(id, dto, principal.getSubject());

        return ResponseEntity.ok(ApiResponse.success("Booking rejected", rejected));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBooking(
            @PathVariable String id,
            @AuthenticationPrincipal OidcUser principal) {

        if (principal == null) return unauthorized();

        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}