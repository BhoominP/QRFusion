package com.qrfusion.backend.service.export;

import com.google.zxing.common.BitMatrix;
import com.qrfusion.backend.renderer.RenderOptions;

public interface ExportService {

    byte[] export(
            BitMatrix matrix,
            RenderOptions options
    ) throws Exception;

}