package com.qrfusion.backend.dto;

import com.qrfusion.backend.entity.User;
import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String authProvider;
    private String avatarUrl;
    private LocalDateTime createdAt;

    public UserDto() {
    }

    public UserDto(Long id, String email, String name, String authProvider, String avatarUrl, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.authProvider = authProvider;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
    }

    public static UserDto fromEntity(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getAuthProvider(),
                user.getAvatarUrl(),
                user.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
