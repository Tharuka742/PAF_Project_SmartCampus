package com.smartcampus.smart_campus_backend.controller;

import com.smartcampus.smart_campus_backend.dto.AssignTechnicianRequest;
import com.smartcampus.smart_campus_backend.dto.CreateTicketRequest;
import com.smartcampus.smart_campus_backend.dto.UpdateTicketStatusRequest;
import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Ticket createTicket(@Valid @RequestBody CreateTicketRequest request) {
        return ticketService.createTicket(request);
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
