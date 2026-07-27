package com.qrfusion.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scan_events")
public class ScanEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long savedQrCodeId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime scannedAt;

    @Column
    private String deviceType;

    @Column
    private String userAgent;

    public ScanEvent() {
    }

    public ScanEvent(Long savedQrCodeId, Long userId, String deviceType, String userAgent) {
        this.savedQrCodeId = savedQrCodeId;
        this.userId = userId;
        this.deviceType = deviceType;
        this.userAgent = userAgent;
        this.scannedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.scannedAt == null) {
            this.scannedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSavedQrCodeId() {
        return savedQrCodeId;
    }

    public void setSavedQrCodeId(Long savedQrCodeId) {
        this.savedQrCodeId = savedQrCodeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getScannedAt() {
        return scannedAt;
    }

    public void setScannedAt(LocalDateTime scannedAt) {
        this.scannedAt = scannedAt;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}
