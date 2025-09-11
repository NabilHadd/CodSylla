import { Controller } from '@nestjs/common';
import { AdvanceService } from './advance.service';

@Controller('advance')
export class AdvanceController {
  constructor(private readonly advanceService: AdvanceService) {}
}
