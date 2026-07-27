package com.qrfusion.backend.repository;

import com.qrfusion.backend.entity.SavedQrCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedQrCodeRepository extends JpaRepository<SavedQrCode, Long> {
    List<SavedQrCode> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT s FROM SavedQrCode s WHERE s.userId = :userId AND s.isFavorite = true ORDER BY s.createdAt DESC")
    List<SavedQrCode> findFavoritesByUserId(@Param("userId") Long userId);

    List<SavedQrCode> findByUserIdAndFolderIdOrderByCreatedAtDesc(Long userId, Long folderId);
    Optional<SavedQrCode> findByIdAndUserId(Long id, Long userId);
    Optional<SavedQrCode> findByShortId(String shortId);
    long countByUserId(Long userId);
}
