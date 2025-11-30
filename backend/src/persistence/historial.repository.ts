import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistorialRepository{
    constructor(private readonly prisma: PrismaService){}

    async findAprobados(rut_alumno: string){
        const aprobados = await  this.prisma.historial_academico.findMany({
          where: {
            rut_alumno: rut_alumno,
            estado: {
              not: 'REPROBADO', // Filtra todo lo que NO sea "reprobado"
            },
          },
        });

        if(!aprobados) throw new Error("Historial Vacio");
        
        return aprobados;
    }

    async findHistorial(rut_alumno: string){
        const historial = await this.prisma.historial_academico.findMany({
          where: {
            rut_alumno: rut_alumno,
          },
        });

        if(!historial) throw new Error("Historial vacio");

        return historial;
        
    }

    async updateEstadoRamo(rut_alumno: string, ramos: any[], semestre: string){
        const operaciones = ramos.map(r => 
            this.prisma.historial_academico.update({
            where: {
                rut_alumno_codigo_ramo_sem_cursado: {
                rut_alumno: rut_alumno,
                codigo_ramo: r.codigo_ramo,
                sem_cursado: semestre
                },
            },
            data: {
                estado: r.estado,
            },
            })
        );

        return Promise.all(operaciones);
    }


}