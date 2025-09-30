import { Module } from '@nestjs/common';
import { ProcesadorService } from './advance.procesador.service';

@Module({
  providers: [ProcesadorService],
  exports: [ProcesadorService]
})
export class ProcesadorModule {}