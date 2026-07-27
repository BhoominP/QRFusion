package com.qrfusion.backend.repository;

import com.qrfusion.backend.entity.DownloadEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadEventRepository extends JpaRepository<DownloadEvent, Long> {
    List<DownloadEvent> findByUserIdOrderByDownloadedAtDesc(Long userId);
}
