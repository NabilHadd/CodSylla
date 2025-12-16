// src/print/adapters/playwright.adapter.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { chromium, Browser } from 'playwright';
import { PrintEngine } from '../ports/print.engine.port';

@Injectable()
export class PlaywrightAdapter
  implements PrintEngine, OnModuleDestroy {

  private browser: Browser;

  async onModuleInit() {
    this.browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async htmlToPdf(html: string): Promise<Buffer> {
    const page = await this.browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });

    // 1️⃣ Medir tamaño real del contenido
    const { width, height } = await page.evaluate(() => {
      return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      };
    });

    // 2️⃣ Tamaño A4 landscape en px (96 DPI aprox)
    const A4_WIDTH = 1122;  // 297mm
    const A4_HEIGHT = 793;  // 210mm

    // 3️⃣ Calcular escala necesaria para que TODO quepa
    const scale = Math.min(
      A4_WIDTH / width,
      A4_HEIGHT / height
    );

    // 4️⃣ Generar PDF forzado a 1 página
    const pdf = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      scale,          // 👈 AQUÍ está la magia
      pageRanges: '1' // 👈 fuerza una sola página
    });

    await page.close();
    return pdf;
  }
  async onModuleDestroy() {
    await this.browser?.close();
  }
}
