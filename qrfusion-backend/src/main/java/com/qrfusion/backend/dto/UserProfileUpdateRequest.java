package com.qrfusion.backend.dto;

public class UserProfileUpdateRequest {
    private String name;
    private String avatarUrl;

    public UserProfileUpdateRequest() {
    }

    public UserProfileUpdateRequest(String name, String avatarUrl) {
        this.name = name;
        this.avatarUrl = avatarUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
