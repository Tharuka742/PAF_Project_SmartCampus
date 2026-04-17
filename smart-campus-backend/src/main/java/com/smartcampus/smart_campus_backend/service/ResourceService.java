package com.smartcampus.smart_campus_backend.service;

import java.util.List;

import com.smartcampus.smart_campus_backend.dto.resource.ResourceCreateRequest;
import com.smartcampus.smart_campus_backend.dto.resource.ResourceUpdateRequest;
import com.smartcampus.smart_campus_backend.model.Resource;

public interface ResourceService {
    Resource createResource(ResourceCreateRequest request);

    List<Resource> getResources(String type, String location, Integer capacity, String status);

    Resource getResourceById(String id);

    Resource updateResource(String id, ResourceUpdateRequest request);

    void deleteResource(String id);
}