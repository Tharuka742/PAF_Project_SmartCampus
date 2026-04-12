package com.paf.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    @GetMapping("/student/dashboard")
    public ResponseEntity<Map<String, String>> studentDashboard() {
        return ResponseEntity.ok(Map.of(
                "role", "USER",
                "dashboard", "Student Dashboard",
                "message", "Welcome to the student dashboard"));
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<Map<String, String>> adminDashboard() {
        return ResponseEntity.ok(Map.of(
                "role", "ADMIN",
                "dashboard", "Admin Dashboard",
                "message", "Welcome to the admin dashboard"));
    }

    @GetMapping("/technician/dashboard")
    public ResponseEntity<Map<String, String>> technicianDashboard() {
        return ResponseEntity.ok(Map.of(
                "role", "TECHNICIAN",
                "dashboard", "Technician Dashboard",
                "message", "Welcome to the technician dashboard"));
    }
}
