package com.smartcampus.smart_campus_backend.dto;

import com.smartcampus.smart_campus_backend.model.PriorityLevel;
import com.smartcampus.smart_campus_backend.model.TicketCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Resource or location is required")
    private String resourceOrLocation;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private PriorityLevel priority;

    @NotBlank(message = "Preferred contact is required")
    private String preferredContact;





}
