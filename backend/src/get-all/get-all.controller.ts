import { Controller, Get, Req, UseGuards, Query, Post, Body } from '@nestjs/common';
import { GetAllService } from './get-all.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RamoRepository } from 'src/persistence/ramo.repository';
import { HistorialRepository } from 'src/persistence/historial.repository';
import { RamoService } from 'src/ramo/ramo.service';

@Controller('get-all')
export class GetAllController {
  constructor(
    private readonly getAllService: GetAllService,
    private readonly ramoService: RamoService,
    private readonly histoRepo: HistorialRepository
  ) {}


  //@UseGuards(JwtAuthGuard)
  //@Get('aprobados')
  //async obtenerAprobados(@Req() req) {
  //  const rut = req.user.rut;
  //
  //  return this.getAllService.getAprobados(rut);
  //}

  
  @UseGuards(JwtAuthGuard)
  @Get('disponibles')
  async obtenerPendientes(@Req() req) {
    const rut = req.user.rut;
    const carrera = req.user.carreras[0]; // primera carrera del array

    const body = {
      rut: rut,
      carrera: {
          codigo_syll: carrera.codigo,
          catalogo: carrera.catalogo,
      }

    };

    const resPendientes =  await this.ramoService.getRamosPendientes(body);
    const pendientes = resPendientes.map(x => x.codigo)
    const resAprobados = await this.histoRepo.findAprobados(req.user.rut);
    const aprobados = resAprobados.map(a => a.codigo_ramo)

    return this.getAllService.getDisponibles(pendientes, aprobados);
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
