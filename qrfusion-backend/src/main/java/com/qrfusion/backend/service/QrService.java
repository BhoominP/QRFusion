package com.qrfusion.backend.service;

import com.qrfusion.backend.dto.QrRequest;
import com.qrfusion.backend.service.export.ExportResult;
import org.springframework.web.multipart.MultipartFile;

public interface QrService {

    ExportResult generateQRCode(
            QrRequest request,
            MultipartFile logo
    ) throws Exception;

    ExportResult generateQRCode(
            QrRequest request,
            MultipartFile logo,
            MultipartFile background
    ) throws Exception;

    ExportResult generateQRCode(
            QrRequest request,
            MultipartFile logo,
            MultipartFile backgroundArt,
            MultipartFile frameBackground
    ) throws Exception;
}