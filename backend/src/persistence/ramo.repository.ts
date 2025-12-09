import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RamoRepository{
    constructor(private readonly prisma: PrismaService){}

    //getters

    async findRamo(codigo_ramo: string){
        return await this.prisma.ramo.findUnique({
            where: { codigo: codigo_ramo },
        });
    }

    async findAllRamos(codigo_syll, catalogo){
        return await this.prisma.ramos_syllabus.findMany({
          where: {
            codigo_syll: codigo_syll,
            catalogo: catalogo
          },
        });
    }

    async findDisponibles(disponibles: string[]){
        return await this.prisma.ramo.findMany({
            where: { codigo: { in: disponibles } },
            select: { codigo: true, nombre: true, creditos: true, nivel: true },
          });
    }

    async findRamosActuales(rut_alumno: string, semestre_actual: string){
        const ramosActuales = await this.prisma.historial_academico.findMany({
            where:{
                sem_cursado: semestre_actual,
                rut_alumno: rut_alumno,
            },
        });

        const ramosConNombre = await Promise.all(
            ramosActuales.map(async (x) => ({
                nombre: await this.findNombreRamo(x.codigo_ramo),
                codigo: x.codigo_ramo,
                estado: x.estado
            }))
        );

        return ramosConNombre;
    }

    async findNombreRamo(codigo_ramo: string){
      const ramo = await this.prisma.ramo.findUnique({
        where: {
          codigo: codigo_ramo,
        },
      });
      return ramo?.nombre
    }

    async findCarreraByRamo(codigo_ramo: string){
      const carrera = await this.prisma.ramos_syllabus.findFirst({
        where: {
          codigo_ramo: codigo_ramo,
        },
        include: {
          carrera: true,
        },
      });

      return carrera?.carrera || ''
    }


    

}