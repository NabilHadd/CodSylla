// src/print/print.service.ts
import { Injectable, Inject } from '@nestjs/common';
import type { PrintEngine } from './ports/print.engine.port';

@Injectable()
export class PrintService {
  constructor(
    @Inject('PRINT_ENGINE')
    private readonly engine: PrintEngine,
  ) {}

  printHtml(html: string) {
    return this.engine.htmlToPdf(html);
  }
}
