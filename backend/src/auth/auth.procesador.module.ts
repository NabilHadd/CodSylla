import { Module } from '@nestjs/common';
import { ProcesadorService } from './auth.procesador.service';

@Module({
  providers: [ProcesadorService],
  exports: [ProcesadorService]
})
export class ProcesadorModule {}