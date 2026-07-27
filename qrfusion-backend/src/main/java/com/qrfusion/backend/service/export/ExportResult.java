package com.qrfusion.backend.service.export;

public class ExportResult {

    private final byte[] data;
    private final String contentType;

    public ExportResult(byte[] data, String contentType) {
        this.data = data;
        this.contentType = contentType;
    }

    public byte[] getData() {
        return data;
    }

    public String getContentType() {
        return contentType;
    }
}