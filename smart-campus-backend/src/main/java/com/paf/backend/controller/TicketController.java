package com.paf.backend.controller;

import com.paf.backend.dto.*;
import com.paf.backend.model.Ticket;
import com.paf.backend.model.TicketComment;
import com.paf.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // ─── CREATE TICKET (multipart/form-data) ─────────────────────────────────

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> createTicket(
            @RequestPart("title") String title,
            @RequestPart("resourceLocation") String resourceLocation,
            @RequestPart("category") String category,
            @RequestPart("priority") String priority,
            @RequestPart("description") String description,
            @RequestPart("contactNumber") String contactNumber,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        TicketCreateRequest req = new TicketCreateRequest(
                title, resourceLocation,
                com.paf.backend.model.TicketCategory.valueOf(category),
                com.paf.backend.model.TicketPriority.valueOf(priority),
                description, contactNumber);

        Ticket created = ticketService.createTicket(req, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ─── GET MY TICKETS ───────────────────────────────────────────────────────

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets() {
        return ResponseEntity.ok(ticketService.getMyTickets());
    }

    // ─── GET ASSIGNED TICKETS (TECHNICIAN) ───────────────────────────────────

    @GetMapping("/assigned")
    public ResponseEntity<List<Ticket>> getAssignedTickets() {
        return ResponseEntity.ok(ticketService.getAssignedTickets());
    }

    // ─── GET ALL TICKETS (ADMIN) ──────────────────────────────────────────────

    @GetMapping("/all")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // ─── GET TICKET BY ID ─────────────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // ─── UPDATE TICKET (STUDENT) ──────────────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable String id,
            @Valid @RequestBody TicketCreateRequest req) {
        return ResponseEntity.ok(ticketService.updateTicket(id, req));
    }

    // ─── DELETE TICKET ────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok(Map.of("message", "Ticket deleted successfully"));
    }

    // ─── UPDATE STATUS ────────────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody TicketStatusUpdateRequest req) {
        return ResponseEntity.ok(ticketService.updateStatus(id, req));
    }

    // ─── ASSIGN TECHNICIAN (ADMIN) ────────────────────────────────────────────

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @Valid @RequestBody TicketAssignRequest req) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, req));
    }

    // ─── ADD COMMENT ──────────────────────────────────────────────────────────

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketComment> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.addComment(id, req));
    }

    // ─── GET COMMENTS ─────────────────────────────────────────────────────────

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketComment>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getComments(id));
    }

    // ─── EDIT COMMENT ─────────────────────────────────────────────────────────

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<TicketComment> editComment(
            @PathVariable String commentId,
            @Valid @RequestBody CommentRequest req) {
        return ResponseEntity.ok(ticketService.editComment(commentId, req));
    }

    // ─── DELETE COMMENT ───────────────────────────────────────────────────────

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable String commentId) {
        ticketService.deleteComment(commentId);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }

    // ─── STATS ────────────────────────────────────────────────────────────────

    @GetMapping("/stats/my")
    public ResponseEntity<Map<String, Long>> getMyStats() {
        return ResponseEntity.ok(ticketService.getMyStats());
    }

    @GetMapping("/stats/all")
    public ResponseEntity<Map<String, Long>> getAllStats() {
        return ResponseEntity.ok(ticketService.getAllStats());
    }

    @GetMapping("/stats/technician")
    public ResponseEntity<Map<String, Long>> getTechnicianStats() {
        return ResponseEntity.ok(ticketService.getTechnicianStats());
    }

    // ─── GET TECHNICIANS LIST (ADMIN) ─────────────────────────────────────────

    @GetMapping("/technicians")
    public ResponseEntity<?> getTechnicians() {
        return ResponseEntity.ok(ticketService.getAllTechnicians().stream()
                .map(u -> Map.of("id", u.getId(), "username", u.getUsername(), "email", u.getEmail()))
                .toList());
    }
}
