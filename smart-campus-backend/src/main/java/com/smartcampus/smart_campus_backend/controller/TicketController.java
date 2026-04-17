package com.smartcampus.smart_campus_backend.controller;

import com.smartcampus.smart_campus_backend.dto.AssignTechnicianRequest;
import com.smartcampus.smart_campus_backend.dto.UpdateTicketStatusRequest;
import com.smartcampus.smart_campus_backend.model.PriorityLevel;
import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.model.TicketCategory;
import com.smartcampus.smart_campus_backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Ticket createTicket(
            @RequestParam String title,
            @RequestParam String resourceOrLocation,
            @RequestParam TicketCategory category,
            @RequestParam String description,
            @RequestParam PriorityLevel priority,
            @RequestParam String preferredContact,
            @RequestParam(value = "attachments", required = false) MultipartFile[] attachments
    ) throws IOException {

        if (attachments != null) {
            if (attachments.length > 3) {
                throw new RuntimeException("Maximum 3 images allowed");
            }

            for (MultipartFile file : attachments) {
                if (file.getSize() > 5 * 1024 * 1024) {
                    throw new RuntimeException("Each image must be 5MB or less");
                }
            }
        }

        return ticketService.createTicket(
                title,
                resourceOrLocation,
                category,
                description,
                priority,
                preferredContact,
                attachments
        );
    }

    @GetMapping("/my")
    public List<Ticket> getMyTickets() {
        return ticketService.getMyTickets("user123");
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id);
    }

    @GetMapping("/assigned/{technicianId}")
    public List<Ticket> getAssignedTickets(@PathVariable String technicianId) {
        return ticketService.getAssignedTickets(technicianId);
    }

    @PatchMapping("/{id}/assign")
    public Ticket assignTechnician(
            @PathVariable String id,
            @Valid @RequestBody AssignTechnicianRequest request
    ) {
        return ticketService.assignTechnician(id, request.getTechnicianId());
    }

    @PatchMapping("/{id}/status")
    public Ticket updateTicketStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateTicketStatusRequest request
    ) {
        return ticketService.updateTicketStatus(id, request);
    }
}