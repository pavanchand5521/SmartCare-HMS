package com.hospital.smartcare.controller;

import com.hospital.smartcare.dto.AuthRequest;
import com.hospital.smartcare.dto.AuthResponse;
import com.hospital.smartcare.dto.RegisterRequest;
import com.hospital.smartcare.dto.PasswordResetRequest;
import com.hospital.smartcare.service.AuthService;
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

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody RegisterRequest request) {
        try {
            authService.sendOtp(request);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-and-register")
    public ResponseEntity<?> verifyAndRegister(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.verifyAndRegister(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody com.hospital.smartcare.dto.PasswordChangeRequest request) {
        try {
            // Since email is in the token subject, let's extract it (or we could rely on Spring SecurityContext)
            // But doing it via SecurityContextHolder is cleaner:
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            authService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendPasswordResetOtp(@RequestBody PasswordResetRequest request) {
        try {
            authService.sendPasswordResetOtp(request.getEmail());
            return ResponseEntity.ok(Map.of("message", "Password reset OTP sent successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<?> verifyPasswordResetOtp(@RequestBody PasswordResetRequest request) {
        try {
            authService.verifyPasswordResetOtp(request.getEmail(), request.getOtpCode(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password has been successfully reset"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
