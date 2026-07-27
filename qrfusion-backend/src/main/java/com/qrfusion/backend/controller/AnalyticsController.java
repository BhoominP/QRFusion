package com.qrfusion.backend.controller;

import com.qrfusion.backend.dto.AnalyticsSummaryDto;
import com.qrfusion.backend.entity.SavedQrCode;
import com.qrfusion.backend.entity.ScanEvent;
import com.qrfusion.backend.repository.SavedQrCodeRepository;
import com.qrfusion.backend.repository.ScanEventRepository;
import com.qrfusion.backend.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final SavedQrCodeRepository savedQrCodeRepository;
    private final ScanEventRepository scanEventRepository;

    public AnalyticsController(
            SavedQrCodeRepository savedQrCodeRepository,
            ScanEventRepository scanEventRepository
    ) {
        this.savedQrCodeRepository = savedQrCodeRepository;
        this.scanEventRepository = scanEventRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDto> getAnalyticsSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        Long userId = currentUser.getId();

        long totalCodes = savedQrCodeRepository.countByUserId(userId);
        long totalScans = scanEventRepository.countByUserId(userId);

        List<SavedQrCode> codes = savedQrCodeRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long activeCampaigns = codes.size();

        // Compute 7-day scan trends
        Map<String, Long> scanCountsByDate = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE");

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            scanCountsByDate.put(date.format(formatter), 0L);
        }

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<ScanEvent> recentScans = scanEventRepository.findByUserIdAndScannedAtAfter(userId, sevenDaysAgo);

        for (ScanEvent event : recentScans) {
            String dayName = event.getScannedAt().toLocalDate().format(formatter);
            if (scanCountsByDate.containsKey(dayName)) {
                scanCountsByDate.put(dayName, scanCountsByDate.get(dayName) + 1);
            }
        }

        List<AnalyticsSummaryDto.ScanTrendPoint> trends = new ArrayList<>();
        scanCountsByDate.forEach((day, count) -> {
            trends.add(new AnalyticsSummaryDto.ScanTrendPoint(day, count, Math.max(0, count - 1)));
        });

        // Compute Format Breakdown
        Map<String, Long> formatCounts = new HashMap<>();
        for (SavedQrCode code : codes) {
            String fmt = code.getFormat() != null ? code.getFormat().toUpperCase() : "SVG";
            formatCounts.put(fmt, formatCounts.getOrDefault(fmt, 0L) + 1);
        }

        List<AnalyticsSummaryDto.FormatCount> formatBreakdown = new ArrayList<>();
        if (totalCodes > 0) {
            formatCounts.forEach((fmt, count) -> {
                double pct = Math.round((double) count / totalCodes * 1000.0) / 10.0;
                formatBreakdown.add(new AnalyticsSummaryDto.FormatCount(fmt, count, pct));
            });
        }

        AnalyticsSummaryDto summary = new AnalyticsSummaryDto();
        summary.setTotalCodes(totalCodes);
        summary.setTotalScans(totalScans);
        summary.setActiveCampaigns(activeCampaigns);
        summary.setScanTrends(trends);
        summary.setFormatBreakdown(formatBreakdown);

        return ResponseEntity.ok(summary);
    }
}
