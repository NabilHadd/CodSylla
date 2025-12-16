// src/print/print.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PrintService } from './print.service';

@Controller('print')
export class PrintController {
  constructor(private readonly printService: PrintService) {}

  @Post('pdf')
  async printPdf(
    @Body('html') html: string,
    @Res() res: Response,
  ) {
    const pdf = await this.printService.printHtml(html);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=print.pdf',
    });

    res.send(pdf);
  }
}
