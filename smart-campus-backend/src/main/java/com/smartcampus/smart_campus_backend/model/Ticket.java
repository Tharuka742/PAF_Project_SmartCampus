package com.smartcampus.smart_campus_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String title;
    private String resourceOrLocation;
    private TicketCategory category;
    private String description;
    private PriorityLevel priority;
    private String preferredContact;

    private TicketStatus status;
    private String rejectedReason;
    private String resolutionNotes;

    private String createdByUserId;
    private String assignedTechnicianId;

    private List<AttachmentMetadata> attachments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}