import { Module } from '@nestjs/common';
import { AdvanceService } from './advance.service';
import { AdvanceController } from './advance.controller';

@Module({
  controllers: [AdvanceController],
  providers: [AdvanceService],
})
export class AdvanceModule {}
