package com.paf.backend.controller;

import com.paf.backend.dto.RoleUpdateRequest;
import com.paf.backend.dto.UserAdminResponse;
import com.paf.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<UserAdminResponse>> listUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<UserAdminResponse> updateUserRole(
            @PathVariable String userId,
            @Valid @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(authService.updateUserRole(userId, request.role()));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String userId) {
        authService.deleteUser(userId);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "User deleted successfully"));
    }
}