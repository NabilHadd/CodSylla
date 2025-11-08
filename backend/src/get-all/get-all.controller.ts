import { Controller, Get, Req, UseGuards, Query, Post, Body } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get('aprobados')
  async obtenerAprobados(@Req() req) {
    const rut = req.user.rut;

    return this.getAllService.getRamosAprobados(rut);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('disponibles')
  async obtenerPendientes(
    @Req() req,
    @Body() body: { pendientes: string[]; aprobados: string[] }
  ) {
    const { pendientes, aprobados } = body;

    return this.getAllService.getDisponibles(pendientes, aprobados);
  }




  //full testeo este endpoint. la idea es llamarla inyectando getAll.
  @UseGuards(JwtAuthGuard)
  @Get('semestre')
  async getSemestreActual(@Req() req) {
    const rut = req.user.rut;
    return this.getAllService.getSemestreActual();
  }

}
