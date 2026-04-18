package com.paf.backend.service;

import com.paf.backend.dto.*;
import com.paf.backend.exception.BadRequestException;
import com.paf.backend.exception.NotFoundException;
import com.paf.backend.exception.UnauthorizedException;
import com.paf.backend.model.*;
import com.paf.backend.repository.AppUserRepository;
import com.paf.backend.repository.TicketCommentRepository;
import com.paf.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.*;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final AppUserRepository userRepository;
    private final AuthService authService;

    @Value("${app.upload.dir:uploads/tickets}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public TicketService(TicketRepository ticketRepository,
                         TicketCommentRepository commentRepository,
                         AppUserRepository userRepository,
                         AuthService authService) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    // ─── CREATE TICKET ────────────────────────────────────────────────────────

    public Ticket createTicket(TicketCreateRequest req, List<MultipartFile> files) {
        AppUser reporter = authService.getCurrentUser();

        if (files != null && files.size() > 3) {
            throw new BadRequestException("A maximum of 3 image attachments are allowed");
        }

        List<String> attachmentUrls = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                if (file.getSize() > 5 * 1024 * 1024) {
                    throw new BadRequestException("Each attachment must be under 5 MB");
                }
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new BadRequestException("Only image files are allowed as attachments");
                }
                String url = saveFile(file);
                attachmentUrls.add(url);
            }
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(req.title().trim());
        ticket.setDescription(req.description().trim());
        ticket.setResourceLocation(req.resourceLocation().trim());
        ticket.setCategory(req.category());
        ticket.setPriority(req.priority());
        ticket.setContactNumber(req.contactNumber().trim());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setAttachmentUrls(attachmentUrls);
        ticket.setReporterId(reporter.getId());
        ticket.setReporterName(reporter.getUsername());
        ticket.setCreatedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());

        return ticketRepository.save(ticket);
    }

    // ─── GET MY TICKETS ──────────────────────────────────────────────────────

    public List<Ticket> getMyTickets() {
        AppUser user = authService.getCurrentUser();
        return ticketRepository.findByReporterIdOrderByCreatedAtDesc(user.getId());
    }

    // ─── GET ASSIGNED TICKETS (TECHNICIAN) ───────────────────────────────────

    public List<Ticket> getAssignedTickets() {
        AppUser technician = authService.getCurrentUser();
        return ticketRepository.findByAssignedTechnicianIdOrderByCreatedAtDesc(technician.getId());
    }

    // ─── GET ALL TICKETS (ADMIN) ──────────────────────────────────────────────

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    // ─── GET TICKET BY ID ─────────────────────────────────────────────────────

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
    }

    // ─── UPDATE TICKET (STUDENT) ──────────────────────────────────────────────

    public Ticket updateTicket(String id, TicketCreateRequest req) {
        Ticket ticket = getTicketById(id);
        AppUser user = authService.getCurrentUser();

        if (!ticket.getReporterId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own tickets");
        }
        
        if (ticket.getStatus() != TicketStatus.OPEN || ticket.getAssignedTechnicianId() != null) {
            throw new BadRequestException("You can only edit tickets that are OPEN and unassigned");
        }

        ticket.setTitle(req.title().trim());
        ticket.setDescription(req.description().trim());
        ticket.setResourceLocation(req.resourceLocation().trim());
        ticket.setCategory(req.category());
        ticket.setPriority(req.priority());
        ticket.setContactNumber(req.contactNumber().trim());
        ticket.setUpdatedAt(Instant.now());

        return ticketRepository.save(ticket);
    }

    // ─── DELETE TICKET (STUDENT/ADMIN) ────────────────────────────────────────

    public void deleteTicket(String id) {
        Ticket ticket = getTicketById(id);
        AppUser user = authService.getCurrentUser();

        boolean isOwner = ticket.getReporterId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not allowed to delete this ticket");
        }

        if (isOwner && !isAdmin) {
            if (ticket.getStatus() != TicketStatus.OPEN || ticket.getAssignedTechnicianId() != null) {
                throw new BadRequestException("You can only delete tickets that are OPEN and unassigned");
            }
        }

        commentRepository.deleteByTicketId(id);
        ticketRepository.deleteById(id);
    }

    // ─── UPDATE STATUS ────────────────────────────────────────────────────────

    public Ticket updateStatus(String id, TicketStatusUpdateRequest req) {
        AppUser user = authService.getCurrentUser();
        Ticket ticket = getTicketById(id);

        Role role = user.getRole();

        // Workflow permission rules
        if (role == Role.USER) {
            // Users can only cancel (not implemented as status here; users cannot change status)
            throw new UnauthorizedException("Students are not permitted to change ticket status");
        }

        if (role == Role.TECHNICIAN) {
            if (!user.getId().equals(ticket.getAssignedTechnicianId())) {
                throw new UnauthorizedException("You can only update status of tickets assigned to you");
            }
            // Allow technicians to update to any status to match the dashboard dropdown
        }

        if (role == Role.ADMIN) {
            if (req.status() == TicketStatus.REJECTED && (req.reason() == null || req.reason().isBlank())) {
                throw new BadRequestException("A reason is required when rejecting a ticket");
            }
        }

        ticket.setStatus(req.status());
        if (req.reason() != null && !req.reason().isBlank()) {
            if (req.status() == TicketStatus.REJECTED) {
                ticket.setRejectionReason(req.reason());
            } else {
                ticket.setResolutionNotes(req.reason());
            }
        }
        ticket.setUpdatedAt(Instant.now());
        return ticketRepository.save(ticket);
    }

    // ─── ASSIGN TECHNICIAN ────────────────────────────────────────────────────

    public Ticket assignTechnician(String ticketId, TicketAssignRequest req) {
        Ticket ticket = getTicketById(ticketId);
        AppUser technician = userRepository.findById(req.technicianId())
                .orElseThrow(() -> new NotFoundException("Technician not found"));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new BadRequestException("The specified user is not a technician");
        }

        ticket.setAssignedTechnicianId(technician.getId());
        ticket.setAssignedTechnicianName(technician.getUsername());
        ticket.setUpdatedAt(Instant.now());
        return ticketRepository.save(ticket);
    }

    // ─── ADD COMMENT ──────────────────────────────────────────────────────────

    public TicketComment addComment(String ticketId, CommentRequest req) {
        AppUser user = authService.getCurrentUser();
        // Ensure the ticket exists
        getTicketById(ticketId);

        TicketComment comment = new TicketComment();
        comment.setTicketId(ticketId);
        comment.setAuthorId(user.getId());
        comment.setAuthorName(user.getUsername());
        comment.setContent(req.content().trim());
        comment.setCreatedAt(Instant.now());
        comment.setUpdatedAt(Instant.now());
        return commentRepository.save(comment);
    }

    // ─── EDIT COMMENT ─────────────────────────────────────────────────────────

    public TicketComment editComment(String commentId, CommentRequest req) {
        AppUser user = authService.getCurrentUser();
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Comment not found"));

        if (!comment.getAuthorId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(req.content().trim());
        comment.setUpdatedAt(Instant.now());
        return commentRepository.save(comment);
    }

    // ─── DELETE COMMENT ───────────────────────────────────────────────────────

    public void deleteComment(String commentId) {
        AppUser user = authService.getCurrentUser();
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Comment not found"));

        boolean isOwner = comment.getAuthorId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not allowed to delete this comment");
        }

        commentRepository.deleteById(commentId);
    }

    // ─── GET COMMENTS ─────────────────────────────────────────────────────────

    public List<TicketComment> getComments(String ticketId) {
        getTicketById(ticketId); // validates ticket exists
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    // ─── STATS ───────────────────────────────────────────────────────────────

    public Map<String, Long> getMyStats() {
        AppUser user = authService.getCurrentUser();
        String uid = user.getId();
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total", ticketRepository.countByReporterId(uid));
        stats.put("open", ticketRepository.countByReporterIdAndStatus(uid, TicketStatus.OPEN));
        stats.put("inProgress", ticketRepository.countByReporterIdAndStatus(uid, TicketStatus.IN_PROGRESS));
        stats.put("resolved", ticketRepository.countByReporterIdAndStatus(uid, TicketStatus.RESOLVED));
        stats.put("urgent", ticketRepository.countByReporterIdAndStatus(uid, TicketStatus.OPEN));
        return stats;
    }

    public Map<String, Long> getAllStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total", ticketRepository.count());
        stats.put("open", ticketRepository.countByStatus(TicketStatus.OPEN));
        stats.put("inProgress", ticketRepository.countByStatus(TicketStatus.IN_PROGRESS));
        stats.put("resolved", ticketRepository.countByStatus(TicketStatus.RESOLVED));
        stats.put("closed", ticketRepository.countByStatus(TicketStatus.CLOSED));
        stats.put("rejected", ticketRepository.countByStatus(TicketStatus.REJECTED));
        return stats;
    }

    public Map<String, Long> getTechnicianStats() {
        AppUser user = authService.getCurrentUser();
        String uid = user.getId();
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total", ticketRepository.countByAssignedTechnicianId(uid));
        stats.put("open", ticketRepository.countByAssignedTechnicianIdAndStatus(uid, TicketStatus.OPEN));
        stats.put("inProgress", ticketRepository.countByAssignedTechnicianIdAndStatus(uid, TicketStatus.IN_PROGRESS));
        stats.put("resolved", ticketRepository.countByAssignedTechnicianIdAndStatus(uid, TicketStatus.RESOLVED));
        return stats;
    }

    // ─── GET TECHNICIANS LIST ─────────────────────────────────────────────────

    public List<AppUser> getAllTechnicians() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.TECHNICIAN)
                .toList();
    }

    // ─── FILE STORAGE ─────────────────────────────────────────────────────────

    private String saveFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String ext = Objects.requireNonNull(file.getOriginalFilename())
                    .substring(file.getOriginalFilename().lastIndexOf('.'));
            String filename = UUID.randomUUID() + ext;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            return baseUrl + "/uploads/tickets/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }
}
