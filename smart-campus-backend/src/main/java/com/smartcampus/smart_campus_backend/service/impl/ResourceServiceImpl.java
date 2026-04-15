package com.smartcampus.smart_campus_backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.smartcampus.smart_campus_backend.dto.resource.ResourceCreateRequest;
import com.smartcampus.smart_campus_backend.dto.resource.ResourceUpdateRequest;
import com.smartcampus.smart_campus_backend.exception.ResourceNotFoundException;
import com.smartcampus.smart_campus_backend.model.Resource;
import com.smartcampus.smart_campus_backend.repository.ResourceRepository;
import com.smartcampus.smart_campus_backend.service.ResourceService;

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
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
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

    @Override
    public List<Resource> searchResources(String type, String location, String status) {
        if (type != null && !type.isBlank()) {
            return resourceRepository.findByTypeIgnoreCase(type);
        }
        if (location != null && !location.isBlank()) {
            return resourceRepository.findByLocationContainingIgnoreCase(location);
        }
        if (status != null && !status.isBlank()) {
            return resourceRepository.findByStatusIgnoreCase(status);
        }
        return resourceRepository.findAll();
    }
}