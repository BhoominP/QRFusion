package com.qrfusion.backend.controller;

import com.qrfusion.backend.entity.SavedQrCode;
import com.qrfusion.backend.entity.ScanEvent;
import com.qrfusion.backend.repository.SavedQrCodeRepository;
import com.qrfusion.backend.repository.ScanEventRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Optional;

@RestController
public class RedirectController {

    private final SavedQrCodeRepository savedQrCodeRepository;
    private final ScanEventRepository scanEventRepository;

    public RedirectController(
            SavedQrCodeRepository savedQrCodeRepository,
            ScanEventRepository scanEventRepository
    ) {
        this.savedQrCodeRepository = savedQrCodeRepository;
        this.scanEventRepository = scanEventRepository;
    }

    @GetMapping("/r/{shortId}")
    public ResponseEntity<?> handleRedirect(
            @PathVariable String shortId,
            HttpServletRequest request
    ) {
        Optional<SavedQrCode> codeOpt = savedQrCodeRepository.findByShortId(shortId);

        if (codeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("QR Code not found.");
        }

        SavedQrCode code = codeOpt.get();

        // Detect device type from User-Agent
        String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
        String deviceType = "Desktop";
        if (userAgent != null) {
            String ua = userAgent.toLowerCase();
            if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
                deviceType = "Mobile";
            } else if (ua.contains("ipad") || ua.contains("tablet")) {
                deviceType = "Tablet";
            }
        }

        // Log Scan Event
        ScanEvent scanEvent = new ScanEvent(code.getId(), code.getUserId(), deviceType, userAgent);
        scanEventRepository.save(scanEvent);

        // Resolve Target URL
        String targetUrl = code.getContent();
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
            targetUrl = "https://" + targetUrl;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(targetUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}
