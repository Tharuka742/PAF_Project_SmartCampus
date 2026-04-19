package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByReporterIdOrderByCreatedAtDesc(String reporterId);
    List<Ticket> findByAssignedTechnicianIdOrderByCreatedAtDesc(String technicianId);
    List<Ticket> findAllByOrderByCreatedAtDesc();
    long countByStatus(TicketStatus status);
    long countByReporterId(String reporterId);
    long countByReporterIdAndStatus(String reporterId, TicketStatus status);
    long countByAssignedTechnicianId(String technicianId);
    long countByAssignedTechnicianIdAndStatus(String technicianId, TicketStatus status);
}
