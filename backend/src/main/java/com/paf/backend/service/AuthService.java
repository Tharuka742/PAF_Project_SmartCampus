package com.paf.backend.service;

import com.paf.backend.dto.AuthResponse;
import com.paf.backend.dto.LoginRequest;
import com.paf.backend.dto.RegisterRequest;
import com.paf.backend.dto.UserAdminResponse;
import com.paf.backend.exception.BadRequestException;
import com.paf.backend.exception.NotFoundException;
import com.paf.backend.exception.UnauthorizedException;
import com.paf.backend.model.AppUser;
import com.paf.backend.model.AuthProvider;
import com.paf.backend.model.Role;
import com.paf.backend.repository.AppUserRepository;
import com.paf.backend.security.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.time.Instant;
import java.util.List;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.role.admin-code:admin123}")
    private String adminRoleCode;

    @Value("${app.role.technician-code:tech123}")
    private String technicianRoleCode;

    public AuthService(AppUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new BadRequestException("Email is already registered");
        }

        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Username is already taken");
        }

        AppUser user = new AppUser();
        user.setUsername(request.username().trim());
        user.setEmail(request.email().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        user.setProvider(AuthProvider.LOCAL);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        AppUser saved = userRepository.save(user);
        return toAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        String principal = request.usernameOrEmail().trim();

        AppUser user = principal.contains("@")
                ? userRepository.findByEmail(principal.toLowerCase())
                        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"))
                : userRepository.findByUsername(principal)
                        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (user.getProvider() == AuthProvider.GOOGLE && (user.getPassword() == null || user.getPassword().isBlank())) {
            throw new UnauthorizedException("This account uses Google sign-in. Please continue with Google.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return toAuthResponse(user);
    }

    public AuthResponse handleGoogleLogin(String email, String displayName) {
        AppUser user = userRepository.findByEmail(email.toLowerCase())
                .orElseGet(() -> {
                    AppUser newUser = new AppUser();
                    String baseUsername = displayName == null || displayName.isBlank() ? email.split("@")[0]
                            : displayName.replaceAll("\\s+", "").toLowerCase();
                    String uniqueUsername = baseUsername;
                    int counter = 1;
                    while (userRepository.existsByUsername(uniqueUsername)) {
                        uniqueUsername = baseUsername + counter;
                        counter++;
                    }
                    newUser.setUsername(uniqueUsername);
                    newUser.setEmail(email.toLowerCase());
                    newUser.setPassword("");
                    newUser.setRole(Role.USER);
                    newUser.setProvider(AuthProvider.GOOGLE);
                    newUser.setCreatedAt(Instant.now());
                    newUser.setUpdatedAt(Instant.now());
                    return userRepository.save(newUser);
                });

        if (user.getProvider() == null) {
            user.setProvider(AuthProvider.GOOGLE);
            user.setUpdatedAt(Instant.now());
            user = userRepository.save(user);
        }

        return toAuthResponse(user);
    }

    public AppUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new UnauthorizedException("Unauthorized");
        }

        String userId = authentication.getName();
        return userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
    }

    public AuthResponse updateRole(Role role, String code) {
        AppUser user = getCurrentUser();
        String normalizedCode = code == null ? "" : code.trim();

        if (role == Role.ADMIN) {
            if (!adminRoleCode.equalsIgnoreCase(normalizedCode)) {
                throw new UnauthorizedException("Invalid admin code");
            }
        }

        if (role == Role.TECHNICIAN) {
            if (!technicianRoleCode.equalsIgnoreCase(normalizedCode)) {
                throw new UnauthorizedException("Invalid technician code");
            }
        }

        user.setRole(role);
        user.setUpdatedAt(Instant.now());
        AppUser saved = userRepository.save(user);
        return toAuthResponse(saved);
    }

    public List<UserAdminResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toAdminUserResponse)
                .toList();
    }

    public UserAdminResponse updateUserRole(String userId, Role role) {
        AppUser currentUser = getCurrentUser();
        if (currentUser.getId().equals(userId)) {
            throw new BadRequestException("You cannot change your own role from the admin panel");
        }

        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.setRole(role);
        user.setUpdatedAt(Instant.now());
        return toAdminUserResponse(userRepository.save(user));
    }

    public void deleteUser(String userId) {
        AppUser currentUser = getCurrentUser();
        if (currentUser.getId().equals(userId)) {
            throw new BadRequestException("You cannot delete your own account from the admin panel");
        }

        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found");
        }

        userRepository.deleteById(userId);
    }

    public void deleteCurrentUser() {
        AppUser user = getCurrentUser();
        userRepository.deleteById(user.getId());
    }

    public AuthResponse toAuthResponse(AppUser user) {
        String token = jwtService.generateToken(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    private UserAdminResponse toAdminUserResponse(AppUser user) {
        return new UserAdminResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getProvider());
    }
}
