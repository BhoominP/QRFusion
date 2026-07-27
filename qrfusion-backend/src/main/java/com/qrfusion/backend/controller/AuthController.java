package com.qrfusion.backend.controller;

import com.qrfusion.backend.dto.*;
import com.qrfusion.backend.entity.User;
import com.qrfusion.backend.repository.UserRepository;
import com.qrfusion.backend.security.GoogleTokenVerifier;
import com.qrfusion.backend.security.JwtTokenProvider;
import com.qrfusion.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final GoogleTokenVerifier googleTokenVerifier;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            GoogleTokenVerifier googleTokenVerifier
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.googleTokenVerifier = googleTokenVerifier;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody AuthRequest.SignUp signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email address is already in use.");
        }

        User user = new User(
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                signUpRequest.getName()
        );

        User savedUser = userRepository.save(user);
        String jwt = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(jwt, UserDto.fromEntity(savedUser)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest.Login loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        String jwt = tokenProvider.generateToken(user.getId(), user.getEmail());
        return ResponseEntity.ok(new AuthResponse(jwt, UserDto.fromEntity(user)));
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogleUser(@Valid @RequestBody GoogleAuthRequest request) {
        try {
            GoogleTokenVerifier.VerifiedGoogleUser googleUser = googleTokenVerifier.verifyToken(request.getIdToken());

            User user = userRepository.findByEmail(googleUser.getEmail()).orElse(null);

            if (user == null) {
                // Create new user for Google SSO
                user = new User(googleUser.getEmail(), googleUser.getName(), "google", true);
                user = userRepository.save(user);
            }

            String jwt = tokenProvider.generateToken(user.getId(), user.getEmail());
            return ResponseEntity.ok(new AuthResponse(jwt, UserDto.fromEntity(user)));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Google authentication failed: " + ex.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(UserDto.fromEntity(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody UserProfileUpdateRequest request
    ) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(savedUser));
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("avatar") MultipartFile avatarFile
    ) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (avatarFile == null || avatarFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Avatar image file cannot be empty.");
        }

        try {
            byte[] bytes = avatarFile.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String contentType = avatarFile.getContentType() != null ? avatarFile.getContentType() : "image/png";
            String dataUrl = "data:" + contentType + ";base64," + base64;

            user.setAvatarUrl(dataUrl);
            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(UserDto.fromEntity(savedUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process profile avatar upload: " + e.getMessage());
        }
    }
}
