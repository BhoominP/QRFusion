package com.qrfusion.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qrfusion.backend.dto.QrRequest;
import com.qrfusion.backend.renderer.export.ExportFormat;
import com.qrfusion.backend.service.QrService;
import com.qrfusion.backend.service.export.ExportResult;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/qr")
public class QrController {

    private final QrService qrService;
    private final ObjectMapper objectMapper;
    private final Validator validator;

    public QrController(
            QrService qrService,
            ObjectMapper objectMapper,
            Validator validator
    ) {
        this.qrService = qrService;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    /**
     * ---------------------------------------
     * JSON Endpoint (No Logo / No Background)
     * ---------------------------------------
     */
    @PostMapping(
            value = "/generate",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> generateJson(
            @RequestBody QrRequest request
    ) throws Exception {

        Set<ConstraintViolation<QrRequest>> violations =
                validator.validate(request);

        if (!violations.isEmpty()) {
            java.util.Map<String, String> fieldErrors = new java.util.HashMap<>();
            StringBuilder message = new StringBuilder();

            for (ConstraintViolation<QrRequest> violation : violations) {
                String field = violation.getPropertyPath().toString();
                String msg = violation.getMessage();
                fieldErrors.put(field, msg);
                message.append(field).append(": ").append(msg).append("; ");
            }

            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(java.util.Map.of(
                            "error", message.toString(),
                            "message", "Validation failed",
                            "fieldErrors", fieldErrors
                    ));
        }

        ExportResult result =
                qrService.generateQRCode(
                        request,
                        null,
                        null,
                        null
                );

        return buildResponse(
                request.getFormat(),
                result
        );
    }

    @GetMapping("/health")
    public ResponseEntity<?> checkHealth() {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(java.util.Map.of(
                        "status", "UP",
                        "service", "QRFusion Engine Backend",
                        "version", "1.0.0",
                        "timestamp", System.currentTimeMillis()
                ));
    }

    /**
     * ---------------------------------------
     * Multipart Endpoint
     * Supports:
     *  - Logo
     *  - Background Art Image (for Art Fusion)
     *  - Frame Background Image (for Glass Plate Frame)
     * ---------------------------------------
     */
    @PostMapping(
            value = "/generate",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> generateMultipart(

            @RequestPart("request")
            String requestJson,

            @RequestPart(value = "logo", required = false)
            MultipartFile logo,

            @RequestPart(value = "backgroundArt", required = false)
            MultipartFile backgroundArt,

            @RequestPart(value = "frameBackground", required = false)
            MultipartFile frameBackground

    ) throws Exception {

        QrRequest request = objectMapper.readValue(requestJson, QrRequest.class);

        Set<ConstraintViolation<QrRequest>> violations = validator.validate(request);

        if (!violations.isEmpty()) {
            java.util.Map<String, String> fieldErrors = new java.util.HashMap<>();
            StringBuilder message = new StringBuilder();

            for (ConstraintViolation<QrRequest> v : violations) {
                String field = v.getPropertyPath().toString();
                String msg = v.getMessage();
                fieldErrors.put(field, msg);
                message.append(field).append(": ").append(msg).append("; ");
            }

            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(java.util.Map.of(
                            "error", message.toString(),
                            "message", "Validation failed",
                            "fieldErrors", fieldErrors
                    ));
        }

        ExportResult result = qrService.generateQRCode(request, logo, backgroundArt, frameBackground);

        return buildResponse(request.getFormat(), result);
    }

    /**
     * ---------------------------------------
     * File Download Response
     * ---------------------------------------
     */
    private ResponseEntity<byte[]> buildResponse(
            ExportFormat format,
            ExportResult result
    ) {

        String fileName = switch (format) {
            case PNG -> "qr.png";
            case SVG -> "qr.svg";
            case PDF -> "qr.pdf";
            case GIF -> "qr.gif";
        };

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\""
                )
                .contentType(
                        MediaType.parseMediaType(
                                result.getContentType()
                        )
                )
                .contentLength(result.getData().length)
                .body(result.getData());
    }
}