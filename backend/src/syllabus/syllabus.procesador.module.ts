import { Module } from '@nestjs/common';
import { ProcesadorService } from './syllabus.procesador.service';

@Module({
  providers: [ProcesadorService],
  exports: [ProcesadorService]
})
export class ProcesadorModule {}