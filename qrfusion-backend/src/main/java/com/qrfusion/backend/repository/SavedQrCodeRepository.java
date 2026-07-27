package com.qrfusion.backend.repository;

import com.qrfusion.backend.entity.SavedQrCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedQrCodeRepository extends JpaRepository<SavedQrCode, Long> {
    List<SavedQrCode> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SavedQrCode> findByUserIdAndIsFavoriteOrderByCreatedAtDesc(Long userId, boolean isFavorite);
    List<SavedQrCode> findByUserIdAndFolderIdOrderByCreatedAtDesc(Long userId, Long folderId);
    Optional<SavedQrCode> findByIdAndUserId(Long id, Long userId);
    Optional<SavedQrCode> findByShortId(String shortId);
    long countByUserId(Long userId);
}
