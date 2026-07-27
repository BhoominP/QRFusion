package com.qrfusion.backend;

import com.qrfusion.backend.entity.SavedQrCode;
import com.qrfusion.backend.entity.User;
import com.qrfusion.backend.repository.SavedQrCodeRepository;
import com.qrfusion.backend.repository.UserRepository;
import com.qrfusion.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SavedQrCodeRepository savedQrCodeRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private String userAToken;
    private String userBToken;
    private SavedQrCode userACode;

    @BeforeEach
    public void setup() {
        savedQrCodeRepository.deleteAll();
        userRepository.deleteAll();

        User userA = userRepository.save(new User("userA@example.com", "hashA", "User A"));
        User userB = userRepository.save(new User("userB@example.com", "hashB", "User B"));

        userAToken = tokenProvider.generateToken(userA.getId(), userA.getEmail());
        userBToken = tokenProvider.generateToken(userB.getId(), userB.getEmail());

        userACode = savedQrCodeRepository.save(new SavedQrCode(
                userA.getId(),
                "User A Secret Code",
                "https://example.com/a",
                "{}",
                "PNG",
                "shortA12"
        ));
    }

    @Test
    public void unauthenticatedRequests_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/v1/qr/saved"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/folders"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/analytics/summary"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/downloads"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void userB_cannotDeleteUserACode_returns404Or403() throws Exception {
        mockMvc.perform(delete("/api/v1/qr/saved/" + userACode.getId())
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isNotFound());
    }

    @Test
    public void userA_canFetchOwnSavedCodes() throws Exception {
        mockMvc.perform(get("/api/v1/qr/saved")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("User A Secret Code"));
    }
}
