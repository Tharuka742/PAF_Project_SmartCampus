package com.smartcampus.smart_campus_backend.controller;

import com.smartcampus.smart_campus_backend.dto.CreateTicketRequest;
import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
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
        return ticketService.getMyTickets("user123"); // temporary
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }
    
}
