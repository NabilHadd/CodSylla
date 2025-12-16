// src/print/print.module.ts
import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import { PrintController } from './print.controller';
import { PlaywrightAdapter } from './adapters/playwright.adapter';

@Module({
  controllers: [PrintController],
  providers: [
    PrintService,
    {
      provide: 'PRINT_ENGINE',
      useClass: PlaywrightAdapter,
    },
  ],
})
export class PrintModule {}
