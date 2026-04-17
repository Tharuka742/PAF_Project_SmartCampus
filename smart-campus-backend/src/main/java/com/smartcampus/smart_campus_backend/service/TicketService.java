package com.smartcampus.smart_campus_backend.service;

import com.smartcampus.smart_campus_backend.dto.UpdateTicketStatusRequest;
import com.smartcampus.smart_campus_backend.model.*;
import com.smartcampus.smart_campus_backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final Path uploadRoot = Paths.get("uploads", "tickets");

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(
            String title,
            String resourceOrLocation,
            TicketCategory category,
            String description,
            PriorityLevel priority,
            String preferredContact,
            MultipartFile[] attachments
    ) throws IOException {

        Files.createDirectories(uploadRoot);

        List<AttachmentMetadata> attachmentList = new ArrayList<>();

        if (attachments != null) {
            for (MultipartFile file : attachments) {
                if (file == null || file.isEmpty()) continue;

                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new RuntimeException("Only image files are allowed");
                }

                String originalFileName = file.getOriginalFilename();
                String storedFileName = UUID.randomUUID() + "_" + originalFileName;
                Path filePath = uploadRoot.resolve(storedFileName);

                Files.copy(file.getInputStream(), filePath);

                attachmentList.add(new AttachmentMetadata(
                        originalFileName,
                        storedFileName,
                        contentType,
                        file.getSize(),
                        "/uploads/tickets/" + storedFileName
                ));
            }
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setResourceOrLocation(resourceOrLocation);
        ticket.setCategory(category);
        ticket.setDescription(description);
        ticket.setPriority(priority);
        ticket.setPreferredContact(preferredContact);

        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedByUserId("user123"); // later replace with logged user
        ticket.setAssignedTechnicianId(null);
        ticket.setRejectedReason(null);
        ticket.setResolutionNotes(null);
        ticket.setAttachments(attachmentList);
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