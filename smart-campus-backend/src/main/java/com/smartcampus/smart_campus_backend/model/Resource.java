package com.smartcampus.smart_campus_backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    private String id;

    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String status;
    private String description;
    private String imageUrl;
    private String amenities;
    private List<AvailabilityWindow> availabilityWindows;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}