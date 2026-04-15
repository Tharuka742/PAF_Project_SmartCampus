package com.smartcampus.smart_campus_backend.dto.resource;

import java.util.List;

import com.smartcampus.smart_campus_backend.model.AvailabilityWindow;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceUpdateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Status is required")
    private String status;

    private String description;
    private String imageUrl;
    private String amenities;
    private List<AvailabilityWindow> availabilityWindows;
}