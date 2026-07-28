package com.qrfusion.backend.controller;

import com.qrfusion.backend.entity.ContactMessage;
import com.qrfusion.backend.repository.ContactMessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public ContactController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping
    public ResponseEntity<?> handleContactForm(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String subject = payload.get("subject");
        String message = payload.get("message");

        if (name == null || name.isBlank() ||
            email == null || email.isBlank() ||
            subject == null || subject.isBlank() ||
            message == null || message.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("All contact form fields (name, email, subject, message) are required.");
        }

        // 1. Save message to Supabase PostgreSQL database
        ContactMessage contactEntity = new ContactMessage(name.trim(), email.trim(), subject.trim(), message.trim());
        ContactMessage savedMessage = contactMessageRepository.save(contactEntity);

        // 2. Dispatch real email to patelbhoomin345@gmail.com via FormSubmit form payload asynchronously
        CompletableFuture.runAsync(() -> {
            try {
                String formBody = "name=" + URLEncoder.encode(name.trim(), StandardCharsets.UTF_8) +
                        "&email=" + URLEncoder.encode(email.trim(), StandardCharsets.UTF_8) +
                        "&_subject=" + URLEncoder.encode("QRFusion Contact: " + subject.trim(), StandardCharsets.UTF_8) +
                        "&message=" + URLEncoder.encode(message.trim(), StandardCharsets.UTF_8) +
                        "&_captcha=false";

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://formsubmit.co/patelbhoomin345@gmail.com"))
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .header("Accept", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(formBody))
                        .build();

                httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
            } catch (Exception e) {
                System.err.println("Failed to send async contact email notification: " + e.getMessage());
            }
        });

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Thank you! Your message has been received and saved.",
                "id", savedMessage.getId()
        ));
    }
}
