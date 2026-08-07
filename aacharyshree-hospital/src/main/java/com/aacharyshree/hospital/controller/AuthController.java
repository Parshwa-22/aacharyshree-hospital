package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.ApiResponse;
import com.aacharyshree.hospital.dto.AuthResponse;
import com.aacharyshree.hospital.dto.LoginRequest;
import com.aacharyshree.hospital.dto.RegisterRequest;
import com.aacharyshree.hospital.entity.AdminUser;
import com.aacharyshree.hospital.entity.Role;
import com.aacharyshree.hospital.repository.AdminUserRepository;
import com.aacharyshree.hospital.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Value("${admin.registration.secret}")
    private String registrationSecret;

    /**
     * Creates a new admin account. Requires the shared registrationSecret
     * (set in application.properties) so this can't be used by a random
     * visitor to grant themselves admin access — only share that secret
     * with people who should be able to create admin logins.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (!registrationSecret.equals(request.getRegistrationSecret())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(false, "Invalid registration secret"));
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Username already taken"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email already registered"));
        }

        AdminUser user = new AdminUser();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ADMIN);
        user.setIsActive(true);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok("Admin account created — you can now log in"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid username or password"));
        }

        AdminUser user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalStateException("User vanished after authentication"));

        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(
                token, user.getUsername(), user.getRole().name(), jwtUtil.getExpirationMs()
        ));
    }
}
