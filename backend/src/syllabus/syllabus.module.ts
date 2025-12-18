import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import {ProcesadorModule } from './syllabus.procesador.module';

@Module({
  imports: [
    HttpModule,
    ProcesadorModule,
  ],
  controllers: [SyllabusController],
  providers: [SyllabusService],
  exports: [SyllabusService]
})
export class SyllabusModule {}