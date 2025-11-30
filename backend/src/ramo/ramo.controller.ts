import { Controller, UseGuards, Req, Get} from '@nestjs/common';
import { RamoService } from './ramo.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('ramo')
export class RamoController {
  constructor(private readonly ramoService: RamoService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('ramos-actuales')
  async obtenerRamosActuales(
    @Req() req,
  ) {
    const rut = req.user.rut;
    return await this.ramoService.getRamosActuales(rut);
  }


  @UseGuards(JwtAuthGuard)
  @Get('ramos-pendientes')
  async obtenerRamos(@Req() req) {
    const rut = req.user.rut;
    const carrera = req.user.carreras[0]; // primera carrera del array

    const body = {
      rut: rut,
      carrera: {
          codigo_syll: carrera.codigo,
          catalogo: carrera.catalogo,
      }

    };

    return this.ramoService.getRamosPendientes(body);
  }

}
