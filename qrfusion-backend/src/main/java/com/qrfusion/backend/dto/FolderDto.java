package com.qrfusion.backend.dto;

import com.qrfusion.backend.entity.Folder;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class FolderDto {
    private Long id;
    private Long userId;

    @NotBlank
    private String name;

    private String color;
    private LocalDateTime createdAt;

    public FolderDto() {
    }

    public FolderDto(Long id, Long userId, String name, String color, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.color = color;
        this.createdAt = createdAt;
    }

    public static FolderDto fromEntity(Folder folder) {
        return new FolderDto(folder.getId(), folder.getUserId(), folder.getName(), folder.getColor(), folder.getCreatedAt());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
