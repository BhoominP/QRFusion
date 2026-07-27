package com.qrfusion.backend.controller;

import com.qrfusion.backend.dto.SavedQrCodeRequest;
import com.qrfusion.backend.dto.SavedQrCodeResponse;
import com.qrfusion.backend.entity.SavedQrCode;
import com.qrfusion.backend.repository.SavedQrCodeRepository;
import com.qrfusion.backend.repository.ScanEventRepository;
import com.qrfusion.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/qr/saved")
public class SavedQrCodeController {

    private final SavedQrCodeRepository savedQrCodeRepository;
    private final ScanEventRepository scanEventRepository;
    private final String baseUrl;

    public SavedQrCodeController(
            SavedQrCodeRepository savedQrCodeRepository,
            ScanEventRepository scanEventRepository,
            @Value("${qrfusion.app.base-url:http://localhost:8080}") String baseUrl
    ) {
        this.savedQrCodeRepository = savedQrCodeRepository;
        this.scanEventRepository = scanEventRepository;
        this.baseUrl = baseUrl;
    }

    @GetMapping
    public ResponseEntity<List<SavedQrCodeResponse>> getSavedQrCodes(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Boolean favorite,
            @RequestParam(required = false) Long folderId
    ) {
        List<SavedQrCode> codes;

        if (Boolean.TRUE.equals(favorite)) {
            codes = savedQrCodeRepository.findByUserIdAndIsFavoriteOrderByCreatedAtDesc(currentUser.getId(), true);
        } else if (folderId != null) {
            codes = savedQrCodeRepository.findByUserIdAndFolderIdOrderByCreatedAtDesc(currentUser.getId(), folderId);
        } else {
            codes = savedQrCodeRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        }

        List<SavedQrCodeResponse> dtos = codes.stream()
                .map(code -> {
                    long scans = scanEventRepository.countBySavedQrCodeId(code.getId());
                    return SavedQrCodeResponse.fromEntity(code, baseUrl, scans);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<SavedQrCodeResponse> createSavedQrCode(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody SavedQrCodeRequest request
    ) {
        String shortId = UUID.randomUUID().toString().substring(0, 8);

        SavedQrCode entity = new SavedQrCode(
                currentUser.getId(),
                request.getName(),
                request.getContent(),
                request.getRenderOptions(),
                request.getFormat(),
                shortId
        );

        if (request.getFavorite() != null) {
            entity.setFavorite(request.getFavorite());
        }
        if (request.getFolderId() != null) {
            entity.setFolderId(request.getFolderId());
        }

        SavedQrCode saved = savedQrCodeRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SavedQrCodeResponse.fromEntity(saved, baseUrl, 0));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateSavedQrCode(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestBody SavedQrCodeRequest request
    ) {
        SavedQrCode entity = savedQrCodeRepository.findByIdAndUserId(id, currentUser.getId())
                .orElse(null);

        if (entity == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Saved QR code not found or unauthorized.");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            entity.setName(request.getName());
        }
        if (request.getContent() != null && !request.getContent().isBlank()) {
            entity.setContent(request.getContent());
        }
        if (request.getRenderOptions() != null) {
            entity.setRenderOptions(request.getRenderOptions());
        }
        if (request.getFormat() != null) {
            entity.setFormat(request.getFormat());
        }
        if (request.getFavorite() != null) {
            entity.setFavorite(request.getFavorite());
        }
        if (request.getFolderId() != null) {
            entity.setFolderId(request.getFolderId());
        }

        SavedQrCode updated = savedQrCodeRepository.save(entity);
        long scans = scanEventRepository.countBySavedQrCodeId(updated.getId());

        return ResponseEntity.ok(SavedQrCodeResponse.fromEntity(updated, baseUrl, scans));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSavedQrCode(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        SavedQrCode entity = savedQrCodeRepository.findByIdAndUserId(id, currentUser.getId())
                .orElse(null);

        if (entity == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Saved QR code not found or unauthorized.");
        }

        savedQrCodeRepository.delete(entity);
        return ResponseEntity.ok().build();
    }
}
