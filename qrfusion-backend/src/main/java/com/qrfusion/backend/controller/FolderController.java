package com.qrfusion.backend.controller;

import com.qrfusion.backend.dto.FolderDto;
import com.qrfusion.backend.entity.Folder;
import com.qrfusion.backend.repository.FolderRepository;
import com.qrfusion.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/folders")
public class FolderController {

    private final FolderRepository folderRepository;

    public FolderController(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    @GetMapping
    public ResponseEntity<List<FolderDto>> getUserFolders(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Folder> folders = folderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        List<FolderDto> dtos = folders.stream().map(FolderDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<FolderDto> createFolder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody FolderDto request
    ) {
        Folder folder = new Folder(currentUser.getId(), request.getName(), request.getColor());
        Folder saved = folderRepository.save(folder);
        return ResponseEntity.status(HttpStatus.CREATED).body(FolderDto.fromEntity(saved));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateFolder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestBody FolderDto request
    ) {
        Folder folder = folderRepository.findByIdAndUserId(id, currentUser.getId())
                .orElse(null);

        if (folder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found or unauthorized.");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            folder.setName(request.getName());
        }
        if (request.getColor() != null) {
            folder.setColor(request.getColor());
        }

        Folder updated = folderRepository.save(folder);
        return ResponseEntity.ok(FolderDto.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFolder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        Folder folder = folderRepository.findByIdAndUserId(id, currentUser.getId())
                .orElse(null);

        if (folder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found or unauthorized.");
        }

        folderRepository.delete(folder);
        return ResponseEntity.ok().build();
    }
}
