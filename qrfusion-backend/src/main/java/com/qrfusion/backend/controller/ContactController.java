package com.qrfusion.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    /**
     * Stub endpoint for contact form submissions.
     * Accepts: { name, email, subject, message }
     */
    @PostMapping
    public ResponseEntity<?> handleContactForm(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Thank you! Your message has been received."
        ));
    }
}
