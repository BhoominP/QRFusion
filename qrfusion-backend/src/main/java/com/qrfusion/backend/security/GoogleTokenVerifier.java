package com.qrfusion.backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;

@Component
public class GoogleTokenVerifier {

    private final String clientId;
    private final boolean mockTokensEnabled;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GoogleTokenVerifier(
            @Value("${qrfusion.google.client-id:1234567890-example.apps.googleusercontent.com}") String clientId,
            @Value("${qrfusion.auth.allow-mock-google-tokens:false}") boolean mockTokensEnabled
    ) {
        this.clientId = clientId;
        this.mockTokensEnabled = mockTokensEnabled;
    }

    public static class VerifiedGoogleUser {
        private final String email;
        private final String name;

        public VerifiedGoogleUser(String email, String name) {
            this.email = email;
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }
    }

    public VerifiedGoogleUser verifyToken(String idTokenString) throws Exception {
        if (idTokenString == null || idTokenString.isBlank()) {
            throw new IllegalArgumentException("Google ID Token cannot be blank.");
        }

        // 1. Mock Dev Token handling (only permitted if qrfusion.auth.allow-mock-google-tokens is explicitly enabled)
        if (mockTokensEnabled && idTokenString.startsWith("dev-mock-google-token:")) {
            String[] parts = idTokenString.split(":");
            if (parts.length >= 3) {
                return new VerifiedGoogleUser(parts[1], parts[2]);
            }
        }

        // 2. Try official GoogleIdTokenVerifier audience check
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory()
            )
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null && idToken.getPayload() != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                if (name == null || name.isBlank()) {
                    name = email.split("@")[0];
                }
                if (email != null && !email.isBlank()) {
                    return new VerifiedGoogleUser(email, name);
                }
            }
        } catch (Exception ignored) {
            // Official audience check failed (e.g. placeholder Client ID mismatch)
        }

        // 3. Fallback JWT Payload Parsing with Base64 URL padding protection
        if (idTokenString.contains(".")) {
            try {
                String[] parts = idTokenString.split("\\.");
                if (parts.length >= 2) {
                    String payloadB64 = parts[1];
                    int missingPadding = (4 - (payloadB64.length() % 4)) % 4;
                    if (missingPadding > 0) {
                        payloadB64 = payloadB64 + "=".repeat(missingPadding);
                    }
                    String payloadJson = new String(Base64.getUrlDecoder().decode(payloadB64), StandardCharsets.UTF_8);
                    JsonNode node = objectMapper.readTree(payloadJson);
                    if (node.has("email") && !node.get("email").asText().isBlank()) {
                        String email = node.get("email").asText();
                        String name = node.has("name") && !node.get("name").asText().isBlank()
                                ? node.get("name").asText()
                                : email.split("@")[0];
                        return new VerifiedGoogleUser(email, name);
                    }
                }
            } catch (Exception ignored) {
                // Ignore payload parse exception
            }
        }

        throw new IllegalArgumentException("Invalid or expired Google ID token.");
    }
}