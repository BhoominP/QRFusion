package com.qrfusion.backend.repository;

import com.qrfusion.backend.entity.ScanEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScanEventRepository extends JpaRepository<ScanEvent, Long> {
    List<ScanEvent> findByUserIdOrderByScannedAtDesc(Long userId);
    List<ScanEvent> findByUserIdAndScannedAtAfter(Long userId, LocalDateTime after);
    long countByUserId(Long userId);
    long countBySavedQrCodeId(Long savedQrCodeId);
}
