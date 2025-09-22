import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdvanceService } from './advance.service';
import { AdvanceController } from './advance.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [AdvanceController],
  providers: [AdvanceService],
})
export class AdvanceModule {}
