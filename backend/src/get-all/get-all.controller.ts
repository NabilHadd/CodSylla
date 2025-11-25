import { Controller, Get, Req, UseGuards, Query, Post, Body } from '@nestjs/common';
import { GetAllService } from './get-all.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('get-all')
export class GetAllController {
  constructor(private readonly getAllService: GetAllService) {}


@UseGuards(JwtAuthGuard)
@Post('actualizar-estado-multiple')
async actualizarMultiples(@Req() req, @Body() body) {
  const rut = req.user.rut;

  // body.ramos = [ { codigo_ramo, sem_cursado, estado } ]

  return this.getAllService.actualizarMultiples(rut, body.ramos);
}


  
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
  @Get('disponibles')
  async obtenerPendientes(@Req() req) {
    const rut = req.user.rut;
    const carrera = req.user.carreras[0]; // primera carrera del array

    const body = {
      rut: rut,
      carrera: {
          codigo: carrera.codigo,
          catalogo: carrera.catalogo,
      }

    };

    const resPendientes =  await this.getAllService.getRamos(body);
    const pendientes = resPendientes.map(x => x.codigo)
    const resAprobados = await this.getAllService.getRamosAprobados(req.user.rut);
    const aprobados = resAprobados.map(a => a.codigo_ramo)

    return this.getAllService.getDisponibles(pendientes, aprobados);
  }

    
  @UseGuards(JwtAuthGuard)
  @Get('ramos-actuales')
  async obtenerRamosActuales(
    @Req() req,
  ) {
    const rut = req.user.rut;
    return await this.getAllService.getRamosActuales(rut);
  }


  @Get('semestre')
  async getSemestreActual() {
    return this.getAllService.getSemestreActual();
  }

  @Get('carreras')
  async getCarreras() {
    return this.getAllService.getCarreras();
  }

}
