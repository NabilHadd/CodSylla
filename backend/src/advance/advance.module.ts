import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdvanceService } from './advance.service';
import { AdvanceController } from './advance.controller';
import { ProcesadorModule } from './advance.procesador.module';

@Module({
  imports: [
    HttpModule, // ⬅️ rompe la circularidad
    ProcesadorModule
  ],
  controllers: [AdvanceController],
  providers: [AdvanceService],
  exports: [AdvanceService]
})
export class AdvanceModule {}