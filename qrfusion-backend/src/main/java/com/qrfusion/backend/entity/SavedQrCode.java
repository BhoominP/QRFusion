package com.qrfusion.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_qr_codes")
public class SavedQrCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String renderOptions; // Full QrConfig JSON string

    @Column(nullable = false)
    private String format; // PNG, SVG, PDF, GIF

    @Column(nullable = false)
    private boolean isFavorite = false;

    @Column
    private Long folderId;

    @Column(nullable = false, unique = true)
    private String shortId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SavedQrCode() {
    }

    public SavedQrCode(Long userId, String name, String content, String renderOptions, String format, String shortId) {
        this.userId = userId;
        this.name = name;
        this.content = content;
        this.renderOptions = renderOptions;
        this.format = format;
        this.shortId = shortId;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRenderOptions() {
        return renderOptions;
    }

    public void setRenderOptions(String renderOptions) {
        this.renderOptions = renderOptions;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public boolean isFavorite() {
        return isFavorite;
    }

    public void setFavorite(boolean favorite) {
        isFavorite = favorite;
    }

    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }

    public String getShortId() {
        return shortId;
    }

    public void setShortId(String shortId) {
        this.shortId = shortId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
