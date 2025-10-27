import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('planification')
export class PlanificationController {
  constructor(private readonly planificationService: PlanificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('generar')
  generar(@Req() req) {
    const body = {
      rut: req.user.rut,
      carrera: {
        codigo: req.user.carreras[0].codigo,
        catalogo: req.user.carreras[0].catalogo,
        nombre: req.user.carreras[0].nombre,
      },
    };
    return this.planificationService.generarPlanificacion(body);
  }

  // Nuevo endpoint para obtener una planificación según su ranking
  @UseGuards(JwtAuthGuard)
  @Get('obtener/:rank')
  async obtenerPorRanking(@Req() req, @Param('rank') rank: number) {
    const userRut = req.user.rut;
    const carrera = req.user.carreras[0]; // primera carrera del array

    const body = {
      rut: userRut,
      carrera: {
        codigo: carrera.codigo,
        catalogo: carrera.catalogo,
        nombre: carrera.nombre,
      },
    };

    return this.planificationService.getPlanificacion(body, Number(rank));
  }
}
