import React from 'react';
import { QrPreviewCanvas, QrPreviewCanvasProps } from '../../../components/qr/QrPreviewCanvas';

export type PreviewPanelProps = QrPreviewCanvasProps;

export function PreviewPanel(props: PreviewPanelProps) {
  return <QrPreviewCanvas {...props} />;
}
