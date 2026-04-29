package com.smartcampus.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.smartcampus.backend.dto.resource.ResourceCreateRequest;
import com.smartcampus.backend.dto.resource.ResourceUpdateRequest;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import com.smartcampus.backend.service.ResourceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public Resource createResource(ResourceCreateRequest request) {
        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .status(request.getStatus())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .amenities(request.getAmenities())
                .availabilityWindows(request.getAvailabilityWindows())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getResources(String type, String location, Integer capacity, String status) {
        boolean hasType = type != null && !type.isBlank();
        boolean hasLocation = location != null && !location.isBlank();
        boolean hasCapacity = capacity != null;
        boolean hasStatus = status != null && !status.isBlank();

        if (!hasType && !hasLocation && !hasCapacity && !hasStatus) {
            return resourceRepository.findAll();
        }

        return resourceRepository.findAll().stream()
                .filter(resource -> !hasType || resource.getType().equalsIgnoreCase(type))
                .filter(resource -> !hasLocation || resource.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(resource -> !hasCapacity || resource.getCapacity() >= capacity)
                .filter(resource -> !hasStatus || resource.getStatus().equalsIgnoreCase(status))
                .toList();
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    @Override
    public Resource updateResource(String id, ResourceUpdateRequest request) {
        Resource resource = getResourceById(id);

        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setStatus(request.getStatus());
        resource.setDescription(request.getDescription());
        resource.setImageUrl(request.getImageUrl());
        resource.setAmenities(request.getAmenities());
        resource.setAvailabilityWindows(request.getAvailabilityWindows());
        resource.setUpdatedAt(LocalDateTime.now());

        return resourceRepository.save(resource);
    }

    @Override
    public void deleteResource(String id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }
}