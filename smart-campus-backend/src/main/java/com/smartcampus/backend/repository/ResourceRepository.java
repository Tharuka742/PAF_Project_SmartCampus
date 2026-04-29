package com.smartcampus.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartcampus.backend.model.Resource;
/**
 * Repository for Resource documents.
 *
 * NOTE: Module A (Facilities Catalogue) belongs to Member 1,
 * so they will own and extend this repository. We declare a
 * minimal version here only so Booking services can LOOK UP
 * a resource to validate it exists / is ACTIVE.
 *
 * Coordinate with Member 1 — if they already created it, delete this
 * file and import theirs instead.
 */
@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByTypeIgnoreCase(String type);
    List<Resource> findByLocationContainingIgnoreCase(String location);
    List<Resource> findByStatusIgnoreCase(String status);
}