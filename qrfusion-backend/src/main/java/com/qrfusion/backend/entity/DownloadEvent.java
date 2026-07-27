package com.qrfusion.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "download_events")
public class DownloadEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column
    private Long savedQrCodeId;

    @Column
    private String qrName;

    @Column(nullable = false)
    private String format;

    @Column
    private String resolution;

    @Column
    private String fileSize;

    @Column(nullable = false, updatable = false)
    private LocalDateTime downloadedAt;

    public DownloadEvent() {
    }

    public DownloadEvent(Long userId, Long savedQrCodeId, String qrName, String format, String resolution, String fileSize) {
        this.userId = userId;
        this.savedQrCodeId = savedQrCodeId;
        this.qrName = qrName;
        this.format = format;
        this.resolution = resolution;
        this.fileSize = fileSize;
        this.downloadedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.downloadedAt == null) {
            this.downloadedAt = LocalDateTime.now();
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

    public Long getSavedQrCodeId() {
        return savedQrCodeId;
    }

    public void setSavedQrCodeId(Long savedQrCodeId) {
        this.savedQrCodeId = savedQrCodeId;
    }

    public String getQrName() {
        return qrName;
    }

    public void setQrName(String qrName) {
        this.qrName = qrName;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getDownloadedAt() {
        return downloadedAt;
    }

    public void setDownloadedAt(LocalDateTime downloadedAt) {
        this.downloadedAt = downloadedAt;
    }
}
