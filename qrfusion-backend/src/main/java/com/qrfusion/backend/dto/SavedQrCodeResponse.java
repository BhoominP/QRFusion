package com.qrfusion.backend.dto;

import com.qrfusion.backend.entity.SavedQrCode;
import java.time.LocalDateTime;

public class SavedQrCodeResponse {
    private Long id;
    private Long userId;
    private String name;
    private String content;
    private String redirectUrl;
    private String renderOptions;
    private String format;
    private boolean isFavorite;
    private Long folderId;
    private String shortId;
    private long scansCount;
    private LocalDateTime createdAt;

    public SavedQrCodeResponse() {
    }

    public static SavedQrCodeResponse fromEntity(SavedQrCode entity, String baseUrl, long scansCount) {
        SavedQrCodeResponse resp = new SavedQrCodeResponse();
        resp.setId(entity.getId());
        resp.setUserId(entity.getUserId());
        resp.setName(entity.getName());
        resp.setContent(entity.getContent());
        resp.setRedirectUrl(baseUrl + "/r/" + entity.getShortId());
        resp.setRenderOptions(entity.getRenderOptions());
        resp.setFormat(entity.getFormat());
        resp.setFavorite(entity.isFavorite());
        resp.setFolderId(entity.getFolderId());
        resp.setShortId(entity.getShortId());
        resp.setScansCount(scansCount);
        resp.setCreatedAt(entity.getCreatedAt());
        return resp;
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

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
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

    public long getScansCount() {
        return scansCount;
    }

    public void setScansCount(long scansCount) {
        this.scansCount = scansCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
