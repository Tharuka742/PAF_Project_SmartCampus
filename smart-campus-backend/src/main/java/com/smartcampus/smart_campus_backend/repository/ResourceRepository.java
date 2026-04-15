package com.smartcampus.smart_campus_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartcampus.smart_campus_backend.model.Resource;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByTypeIgnoreCase(String type);
    List<Resource> findByLocationContainingIgnoreCase(String location);
    List<Resource> findByStatusIgnoreCase(String status);
}