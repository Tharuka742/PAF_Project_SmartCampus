package com.smartcampus.smart_campus_backend.service;

import com.smartcampus.smart_campus_backend.dto.CreateTicketRequest;
import com.smartcampus.smart_campus_backend.dto.UpdateTicketStatusRequest;
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

        public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public List<Ticket> getAssignedTickets(String technicianId) {
        return ticketRepository.findByAssignedTechnicianId(technicianId);
    }

    public Ticket assignTechnician(String ticketId, String technicianId) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setAssignedTechnicianId(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(String ticketId, UpdateTicketStatusRequest request) {
        Ticket ticket = getTicketById(ticketId);

        if (request.getStatus() == TicketStatus.REJECTED &&
                (request.getRejectedReason() == null || request.getRejectedReason().trim().isEmpty())) {
            throw new RuntimeException("Rejected reason is required");
        }

        if (request.getStatus() == TicketStatus.RESOLVED &&
                (request.getResolutionNotes() == null || request.getResolutionNotes().trim().isEmpty())) {
            throw new RuntimeException("Resolution notes are required");
        }

        ticket.setStatus(request.getStatus());
        ticket.setResolutionNotes(request.getResolutionNotes());
        ticket.setRejectedReason(request.getRejectedReason());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }
}