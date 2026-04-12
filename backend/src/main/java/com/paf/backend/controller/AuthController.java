package com.paf.backend.controller;

import com.paf.backend.dto.AuthResponse;
import com.paf.backend.dto.LoginRequest;
import com.paf.backend.dto.RoleUpdateRequest;
import com.paf.backend.dto.RegisterRequest;
import com.paf.backend.model.AppUser;
import com.paf.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> currentUser() {
        AppUser user = authService.getCurrentUser();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "provider", user.getProvider()));
    }

    @PatchMapping("/me/role")
    public ResponseEntity<AuthResponse> updateRole(@Valid @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(authService.updateRole(request.role(), request.code()));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteMyAccount() {
        authService.deleteCurrentUser();
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}
