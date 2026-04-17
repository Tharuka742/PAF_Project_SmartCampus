package com.smartcampus.smart_campus_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.smart_campus_backend.dto.resource.ResourceCreateRequest;
import com.smartcampus.smart_campus_backend.dto.resource.ResourceUpdateRequest;
import com.smartcampus.smart_campus_backend.model.Resource;
import com.smartcampus.smart_campus_backend.service.ResourceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<Resource> createResource(
            @RequestHeader(value = "X-User-Role", defaultValue = "student") String role,
            @Valid @RequestBody ResourceCreateRequest request) {
        requireAdmin(role);
        Resource created = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(
                resourceService.getResources(type, location, capacity, status)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(
            @RequestHeader(value = "X-User-Role", defaultValue = "student") String role,
            @PathVariable String id,
            @Valid @RequestBody ResourceUpdateRequest request) {
        requireAdmin(role);
        return ResponseEntity.ok(resourceService.updateResource(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(
            @RequestHeader(value = "X-User-Role", defaultValue = "student") String role,
            @PathVariable String id) {
        requireAdmin(role);
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    private void requireAdmin(String role) {
        if (role == null || !role.trim().equalsIgnoreCase("admin")) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admin users can modify resources"
            );
        }
    }
}