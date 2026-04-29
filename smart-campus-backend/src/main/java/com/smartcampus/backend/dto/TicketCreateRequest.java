package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.TicketCategory;
import com.smartcampus.backend.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TicketCreateRequest(

        @NotBlank(message = "Title is required")
        @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
        String title,

        @NotBlank(message = "Resource or location is required")
        String resourceLocation,

        @NotNull(message = "Category is required")
        TicketCategory category,

        @NotNull(message = "Priority is required")
        TicketPriority priority,

        @NotBlank(message = "Description is required")
        @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
        String description,

        @NotBlank(message = "Contact number is required")
        @Pattern(regexp = "^[0-9+\\-\\s()]{7,20}$", message = "Enter a valid contact number")
        String contactNumber
) {}
