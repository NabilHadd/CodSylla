// src/print/ports/print-engine.port.ts
export interface PrintEngine {
  htmlToPdf(html: string): Promise<Buffer>;
}
