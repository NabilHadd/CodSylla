import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('planification')
export class PlanificationController {
  constructor(private readonly planificationService: PlanificationService) {}

  //luego desde el frontend se genera una pasandole el rut desde localstorage
  @UseGuards(JwtAuthGuard)
  @Get('generar')
  generar(@Req() req) {
    const body = {
      rut: req.rut,
      carrera: {
            codigo: req.carreras[0].codigo,
            catalogo: req.carreras[0].catalogo,
            nombre: req.carreras[0].nombre
      },
      //debe consumirse el nombre desde el formulario, asi como muchas otras variables.
    } // obtenido desde el JWT
    return this.planificationService.generarPlanificacion(body);
  }
}