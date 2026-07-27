package com.qrfusion.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qrfusion.backend.dto.GoogleAuthRequest;
import com.qrfusion.backend.entity.User;
import com.qrfusion.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "qrfusion.auth.allow-mock-google-tokens=true")
@AutoConfigureMockMvc
public class GoogleAuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
    }

    @Test
    public void validGoogleSign_createsNewUser_andReturnsJwt() throws Exception {
        GoogleAuthRequest request = new GoogleAuthRequest("dev-mock-google-token:john@example.com:John Doe");

        mockMvc.perform(post("/api/v1/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("john@example.com"))
                .andExpect(jsonPath("$.user.name").value("John Doe"));

        assertEquals(1, userRepository.count());
        User user = userRepository.findByEmail("john@example.com").orElse(null);
        assertNotNull(user);
        assertEquals("google", user.getAuthProvider());
    }

    @Test
    public void googleSign_withMockJwtToken_parsesPayloadAndCreatesUser() throws Exception {
        String mockJwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXhAZ29vZ2xlLmNvbSIsIm5hbWUiOiJBbGV4IFNtaXRoIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9.fake_signature";

        GoogleAuthRequest request = new GoogleAuthRequest(mockJwt);

        mockMvc.perform(post("/api/v1/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("alex@google.com"))
                .andExpect(jsonPath("$.user.name").value("Alex Smith"));

        assertEquals(1, userRepository.count());
    }

    @Test
    public void googleSign_existingPasswordAccount_logsIntoExistingUser() throws Exception {
        // Pre-create account with password
        User existingUser = userRepository.save(new User("jane@example.com", passwordEncoder.encode("secret123"), "Jane Doe"));

        GoogleAuthRequest request = new GoogleAuthRequest("dev-mock-google-token:jane@example.com:Jane Google");

        mockMvc.perform(post("/api/v1/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.id").value(existingUser.getId()))
                .andExpect(jsonPath("$.user.email").value("jane@example.com"));

        // Count should still be 1 (no duplicate creation)
        assertEquals(1, userRepository.count());
    }

    @Test
    public void invalidOrForgedToken_returns401() throws Exception {
        GoogleAuthRequest request = new GoogleAuthRequest("invalid-forged-token-xyz");

        mockMvc.perform(post("/api/v1/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
