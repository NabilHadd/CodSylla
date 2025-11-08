import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetAllService } from 'src/get-all/get-all.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService,
              private readonly getAll: GetAllService
  ) {}

  async getAuditLog() {
    try {
      return await this.prisma.audit_log.findMany({
        orderBy: { fecha: 'desc' },
        include: {
          usuario: {
            select: {
              rut: true,
              email: true,
              rol: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudieron obtener los registros de auditoría',
        {
          cause: error,
        },
      );
    }
  }

  async getRamos() {
    try {
      return await this.prisma.ramo.findMany({
        orderBy: [{ nivel: 'asc' }, { codigo: 'asc' }],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudieron obtener los ramos',
        {
          cause: error,
        },
      );
    }
  }

  async updateAuditLog(body: { 
    rut: string,
    accion: string
  }) {
    try {
      await this.prisma.audit_log.create({
        data: {
          rut_usuario: body.rut,
          accion: body.accion,
          fecha: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Error insertando log: ${error.message}`);
    }
  }


  async getAuditRamos(){
    const planificaciones_ramos = await this.prisma.planificacion.findMany({
      where:{
        ranking: 1
      },
      include: {
        ramos: true,
      },
    });
    
    const semestre = this.getAll.siguienteSemestre(this.getAll.getSemestreActual());

    const ramosNextSem = planificaciones_ramos
      .map(r => r.ramos)
      .flat()
      .filter(s => s.sem_asignado == String(semestre))
      .map(ss => ss.codigo_ramo)
    
    const contar = (arr: String[], a: String) => {
      return arr.filter(x => x === a).length
    };

    //linea de testeo
    const test = 
    [
      "UNFE-10001",
      "UNFE-10001",
      "UNFE-10001",
      "ECIN-00362",
      "UNFV-02002",
      "ECIN-00361",
      "ECIN-00360",
      "DCCB-00341",
      "UNFP-40001"
    ]


    const auditRamos = await Promise.all(
      [...new Set(ramosNextSem)].map(async (a) => ({
        codigo_ramo: a,
        nombre: await this.getAll.getNombreRamo(a),
        count: contar(ramosNextSem, a),
        carrera: await this.getAll.getCarreraRamo(a),
      }))
    );
    //const auditRamos = [...new Set(test)].map(a => ({codigo_ramo: a, nombre: this.getAll.getNombreRamo(a), count: contar(test, a)}))

    return auditRamos
  }



}
