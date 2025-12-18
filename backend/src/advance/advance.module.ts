import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdvanceService } from './advance.service';
import { AdvanceController } from './advance.controller';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [AdvanceController],
  providers: [AdvanceService],
  exports: [AdvanceService]
})
export class AdvanceModule {}