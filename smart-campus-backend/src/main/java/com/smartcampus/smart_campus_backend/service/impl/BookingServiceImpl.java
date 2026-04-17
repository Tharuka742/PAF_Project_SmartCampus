package com.smartcampus.smart_campus_backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.smartcampus.smart_campus_backend.dto.request.BookingApprovalDTO;
import com.smartcampus.smart_campus_backend.dto.request.BookingRequestDTO;
import com.smartcampus.smart_campus_backend.dto.request.BookingUpdateDTO;
import com.smartcampus.smart_campus_backend.dto.response.BookingResponseDTO;
import com.smartcampus.smart_campus_backend.exception.BookingConflictException;
import com.smartcampus.smart_campus_backend.exception.InvalidStatusTransitionException;
import com.smartcampus.smart_campus_backend.exception.ResourceNotFoundException;
import com.smartcampus.smart_campus_backend.exception.UnauthorizedActionException;
import com.smartcampus.smart_campus_backend.model.Booking;
import com.smartcampus.smart_campus_backend.model.enums.BookingStatus;
import com.smartcampus.smart_campus_backend.repository.BookingRepository;
import com.smartcampus.smart_campus_backend.service.BookingService;
import com.smartcampus.smart_campus_backend.util.BookingMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    private static final List<BookingStatus> BLOCKING_STATUSES =
            List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    // ================= (LIVE CHECK) =================

    @Override
    public boolean hasConflict(String location, LocalDateTime start, LocalDateTime end) {
        List<Booking> conflicts =
                bookingRepository.findConflictingBookingsByLocation(
                        location,
                        start,
                        end,
                        BLOCKING_STATUSES
                );

        return !conflicts.isEmpty();
    }


    // ================= STEP 3: SUGGEST SLOTS =================

    @Override
    public List<String> suggestSlots(String location, String date) {

        LocalDateTime startOfDay = LocalDateTime.parse(date + "T00:00:00");
        LocalDateTime endOfDay   = LocalDateTime.parse(date + "T23:59:59");

        List<Booking> bookings =
                bookingRepository.findConflictingBookingsByLocation(
                        location,
                        startOfDay,
                        endOfDay,
                        List.of(BookingStatus.APPROVED)
                );

        List<String> suggestions = new java.util.ArrayList<>();

        for (Booking b : bookings) {
            LocalDateTime freeStart = b.getEndTime();
            LocalDateTime freeEnd   = freeStart.plusHours(2);

            suggestions.add(
                    freeStart.toLocalTime() + " - " + freeEnd.toLocalTime()
            );
        }

        return suggestions;
    }


    // ================= USER =================

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO request, String userId,
                                            String userName, String userEmail) {

        log.info("Creating booking for user={} location={}", userId, request.getLocation());

        validateTimeRange(request.getStartTime(), request.getEndTime());

        // Conflict check by LOCATION
        ensureNoConflictByLocation(
                request.getLocation(),
                request.getStartTime(),
                request.getEndTime(),
                null
        );

        Booking booking = Booking.builder()
                .userId(userId)
                .userName(userName)
                .userEmail(userEmail)
                .resourceName(request.getResourceName())
                .resourceType(request.getResourceType())
                .location(request.getLocation()) 
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);

        log.info("Booking created id={}", saved.getId());

        return bookingMapper.toResponse(saved);
    }

    @Override
    public BookingResponseDTO updateBooking(String bookingId, BookingUpdateDTO update, String userId) {
        Booking booking = loadBooking(bookingId);

        if (!booking.getUserId().equals(userId)) {
            throw new UnauthorizedActionException("You can only update your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidStatusTransitionException(
                    "Only PENDING bookings can be updated");
        }

        LocalDateTime newStart = update.getStartTime() != null ? update.getStartTime() : booking.getStartTime();
        LocalDateTime newEnd   = update.getEndTime() != null ? update.getEndTime() : booking.getEndTime();

        validateTimeRange(newStart, newEnd);

        // Conflict check by LOCATION
        ensureNoConflictByLocation(
                booking.getLocation(),
                newStart,
                newEnd,
                booking.getId()
        );

        booking.setStartTime(newStart);
        booking.setEndTime(newEnd);

        if (update.getPurpose() != null)
            booking.setPurpose(update.getPurpose());

        if (update.getExpectedAttendees() != null)
            booking.setExpectedAttendees(update.getExpectedAttendees());

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDTO cancelBooking(String bookingId, BookingApprovalDTO dto, String userId) {
        Booking booking = loadBooking(bookingId);

        if (!booking.getUserId().equals(userId)) {
            throw new UnauthorizedActionException("You can only cancel your own bookings");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setDecisionReason(dto != null ? dto.getReason() : null);
        booking.setDecidedBy(userId);
        booking.setDecidedAt(LocalDateTime.now());

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDTO getBookingById(String bookingId, String requesterId, boolean isAdmin) {
        Booking booking = loadBooking(bookingId);

        if (!isAdmin && !booking.getUserId().equals(requesterId)) {
            throw new UnauthorizedActionException("You cannot view this booking");
        }

        return bookingMapper.toResponse(booking);
    }

    @Override
    public List<BookingResponseDTO> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }


    @Override
    public BookingResponseDTO approveBooking(String bookingId, BookingApprovalDTO dto, String adminId) {
        Booking booking = loadBooking(bookingId);

        booking.setStatus(BookingStatus.APPROVED);
        booking.setDecidedBy(adminId);
        booking.setDecidedAt(LocalDateTime.now());

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDTO rejectBooking(String bookingId, BookingApprovalDTO dto, String adminId) {
        Booking booking = loadBooking(bookingId);

        booking.setStatus(BookingStatus.REJECTED);
        booking.setDecisionReason(dto.getReason());
        booking.setDecidedBy(adminId);
        booking.setDecidedAt(LocalDateTime.now());

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    public void deleteBooking(String bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new ResourceNotFoundException("Booking", bookingId);
        }
        bookingRepository.deleteById(bookingId);
    }

    // ================= HELPERS =================

    private Booking loadBooking(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
    }

    private void validateTimeRange(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null)
            throw new IllegalArgumentException("Start & End required");

        if (!end.isAfter(start))
            throw new IllegalArgumentException("End must be after start");

        if (start.isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("Start cannot be past");
    }

    //(LOCATION-BASED CONFLICT)
    private void ensureNoConflictByLocation(String location,
                                            LocalDateTime start,
                                            LocalDateTime end,
                                            String excludeBookingId) {

        List<Booking> conflicts = (excludeBookingId == null)
                ? bookingRepository.findConflictingBookingsByLocation(
                        location, start, end, BLOCKING_STATUSES)
                : bookingRepository.findConflictingBookingsByLocationExcludingId(
                        location, start, end, BLOCKING_STATUSES, excludeBookingId);

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "This location is already booked for the selected time"
            );
        }
    }
}