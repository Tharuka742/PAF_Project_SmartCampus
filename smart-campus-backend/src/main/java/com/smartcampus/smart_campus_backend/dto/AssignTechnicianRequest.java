package com.smartcampus.smart_campus_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssignTechnicianRequest {
    @NotBlank(message = "Technician ID is required")
    private String technicianId;

    
}
