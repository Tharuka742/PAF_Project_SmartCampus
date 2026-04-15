package com.smartcampus.smart_campus_backend.service;

import com.smartcampus.smart_campus_backend.dto.CreateTicketRequest;
import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.model.TicketStatus;
import com.smartcampus.smart_campus_backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setResourceOrLocation(request.getResourceOrLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());

        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedByUserId("user123"); // temporary, later auth member will replace
        ticket.setAssignedTechnicianId(null);
        ticket.setRejectedReason(null);
        ticket.setResolutionNotes(null);
        ticket.setAttachments(new ArrayList<>());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getMyTickets(String userId) {
        return ticketRepository.findByCreatedByUserId(userId);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
}