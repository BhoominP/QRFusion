package com.qrfusion.backend.controller;

import com.qrfusion.backend.entity.DownloadEvent;
import com.qrfusion.backend.repository.DownloadEventRepository;
import com.qrfusion.backend.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/downloads")
public class DownloadHistoryController {

    private final DownloadEventRepository downloadEventRepository;

    public DownloadHistoryController(DownloadEventRepository downloadEventRepository) {
        this.downloadEventRepository = downloadEventRepository;
    }

    @GetMapping
    public ResponseEntity<List<DownloadEvent>> getDownloadHistory(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<DownloadEvent> events = downloadEventRepository.findByUserIdOrderByDownloadedAtDesc(currentUser.getId());
        return ResponseEntity.ok(events);
    }

    @PostMapping
    public ResponseEntity<DownloadEvent> recordDownloadEvent(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody DownloadEvent request
    ) {
        DownloadEvent event = new DownloadEvent(
                currentUser.getId(),
                request.getSavedQrCodeId(),
                request.getQrName() != null ? request.getQrName() : "Custom QR Code",
                request.getFormat() != null ? request.getFormat() : "PNG",
                request.getResolution() != null ? request.getResolution() : "1024x1024",
                request.getFileSize() != null ? request.getFileSize() : "1.2 MB"
        );

        DownloadEvent saved = downloadEventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
