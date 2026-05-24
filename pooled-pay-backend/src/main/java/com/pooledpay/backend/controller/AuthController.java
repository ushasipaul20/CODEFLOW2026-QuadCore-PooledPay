package com.pooledpay.backend.controller;

import com.pooledpay.backend.model.Role;
import com.pooledpay.backend.model.User;
import com.pooledpay.backend.repository.UserRepository;
import com.pooledpay.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import com.pooledpay.backend.model.PasswordResetToken;
import com.pooledpay.backend.repository.PasswordResetTokenRepository;
import com.pooledpay.backend.service.EmailService;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        if(userRepository.findByUsername(request.get("username")).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if(request.containsKey("email") && userRepository.findByEmail(request.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setUsername(request.get("username"));
        user.setEmail(request.get("email")); // Can be null for existing logic
        user.setPassword(passwordEncoder.encode(request.get("password")));
        user.setLocation(request.getOrDefault("location", "Mumbai")); // Default location for demo
        
        try {
            user.setRole(Role.valueOf(request.get("role").toUpperCase()));
        } catch (Exception e) {
            user.setRole(Role.RETAILER);
        }
        
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        User user = userRepository.findByUsername(request.get("username"))
                .orElse(null);

        if (user != null && passwordEncoder.matches(request.get("password"), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("role", user.getRole().name());
            response.put("userId", String.valueOf(user.getId()));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Return ok to prevent email enumeration attacks
            return ResponseEntity.ok("If an account exists with this email, a reset link has been sent.");
        }

        User user = userOpt.get();
        // Delete any existing token for this user
        tokenRepository.deleteByUser(user);

        // Generate new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user, 30); // 30 min expiry
        tokenRepository.save(resetToken);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return ResponseEntity.ok("If an account exists with this email, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token and password are required");
        }

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body("Token has expired");
        }

        // Update user password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete token to prevent reuse
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Password successfully reset. You can now log in.");
    }
}
