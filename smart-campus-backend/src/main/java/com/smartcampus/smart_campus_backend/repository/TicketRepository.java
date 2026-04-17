package com.smartcampus.smart_campus_backend.repository;

import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatedByUserId(String createdByUserId);
    List<Ticket> findByAssignedTechnicianId(String assignedTechnicianId);
    List<Ticket> findByStatus(TicketStatus status);
   
}
