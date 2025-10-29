import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetAllService } from './get-all.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('get-all')
export class GetAllController {
  constructor(private readonly getAllService: GetAllService) {}

  
  @UseGuards(JwtAuthGuard)
  @Get('ramos')
  async obtenerRamos(@Req() req) {
    const rut = req.user.rut;
    const carrera = req.user.carreras[0]; // primera carrera del array

    const body = {
      rut: rut,
      carrera: {
          codigo: carrera.codigo,
          catalogo: carrera.catalogo,
      }

    };

    return this.getAllService.getRamos(body);
  }

}
