import { Controller, Get, Param, UseGuards, Req, Post, Body, Delete } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('planification')
export class PlanificationController {
  constructor(private readonly planificationService: PlanificationService
  ) {}

@UseGuards(JwtAuthGuard)
@Post('generar')
async generar(@Req() req, @Body() body) {
  const data = {
    rut: req.user.rut,
    carrera: {
      codigo: req.user.carreras[0].codigo,
      catalogo: req.user.carreras[0].catalogo,
      nombre: req.user.carreras[0].nombre,
    },
    nombre: body.nombre,
    maxCredits: body.maxCredits,
    postponed: body.postponed,
    priority: body.priority,
    reprobed: body.reprobed
  };

  return this.planificationService.generarPlanS(data);
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

  @UseGuards(JwtAuthGuard)
  @Get('obtener-todo')
  async obtenerPlanes(@Req() req) {
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

    return this.planificationService.getPlanes(body);
  }

@UseGuards(JwtAuthGuard)
@Post('actualizar-ranking')
async actualizarRanking(@Req() req, @Body() body: any) {
  const rut = req.user.rut;
  const planes = body.planes;


  // Simular retraso de 2 segundos
  //await new Promise((resolve) => setTimeout(resolve, 2000));
  // body podría contener algo como: { nuevosRankings: [...] }
  return this.planificationService.actualizarRanking(rut, planes);
}

@UseGuards(JwtAuthGuard)
@Delete('eliminar-plan')
async eliminarPlan(@Req() req, @Body() body: any) {
  const rut = req.user.rut;
  const fecha = body.fecha;
  const ranking = body.ranking;

  return this.planificationService.deletePlan(rut, fecha, ranking);
}


  // Nuevo endpoint para obtener una planificación según su ranking
  @UseGuards(JwtAuthGuard)
  @Get('obtener-nombre/:rank')
  async obtenerNombrePorRanking(@Req() req, @Param('rank') rank: number) {
    //OBTENER EL NOMBRE DE UNA PLANIFIFCACIÓN
  }



}

