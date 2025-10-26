import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('planification')
export class PlanificationController {
  constructor(private readonly planificationService: PlanificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('generar')
  generar(@Req() req) {
    const rut = req.user.rut; // obtenido desde el JWT
    return this.planificationService.generarPlanificacion(rut);
  }
}