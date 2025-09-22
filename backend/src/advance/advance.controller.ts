import { Controller, Get, Query} from '@nestjs/common';
import { AdvanceService } from './advance.service';

@Controller('advance')
export class AdvanceController {
  constructor(private readonly AdvanceService: AdvanceService) {}

  @Get()
  async getSyllabus(
    @Query('rut') rut: string,
    @Query('codcarrera') codcarrera: string
  ) {
    return await this.AdvanceService.getAdvance(rut, codcarrera);
  }
}
