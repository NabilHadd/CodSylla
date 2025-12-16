import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanificationRepository{
    constructor(private readonly prisma: PrismaService){}


    

    async findPlan(rut: string, fecha: Date){
      const plan = await this.prisma.planificacion.findUnique({
        where: {
          rut_alumno_fecha: {
            rut_alumno: rut,
            fecha: fecha,
          },
        },
      });
    }

    async findByRanking(rut: string, ranking: number){
        return await this.prisma.planificacion.findFirst({
          where: {
            rut_alumno: rut,
            ranking: ranking          
          },
        });
    }


    

    async findRamosPlan(rut: string, fecha_plan: Date){
        return await this.prisma.planificacion_ramo.findMany({
          where: {
            rut_alumno: rut,
            fecha_plan: fecha_plan
          },
        })
    }





    async findAllPlanByRut(rut: string){
      return await this.prisma.planificacion.findMany({
          where: {
            rut_alumno: rut,         
          },
        });
    }





    async findAllByRutWR(rut: string){
      return await this.prisma.planificacion.findMany({
        where:{
          rut_alumno: rut,
        }, 
        include: {
          ramos: true,
        },
      });

    }





    async findPlanByName(rut: string, nombre_plan: string){
      return await this.prisma.planificacion.findFirst({
          where: {
            rut_alumno: rut,
            nombre_plan: nombre_plan,
          },
        });
    }






    async createPlan(
      data: {
        rut_alumno: string,
        fecha: Date,
        nombre_plan: string,
        sem_plan: string,
        ranking: number,
      }
    ){
      return await this.prisma.planificacion.create({
          data: data
        });
    }





    async fillPlan(
      data: {
        rut_alumno: string,
        fecha_plan: Date,
        infoSemestre: {semestre: number; ramos: { codigo: string; estado: string; creditos: number }[]; totalCreditos: number}
      }

    ){
      await this.prisma.planificacion_ramo.createMany({
        data: data.infoSemestre.ramos.map(ramo => ({
          rut_alumno: data.rut_alumno,
          fecha_plan: data.fecha_plan,
          codigo_ramo: ramo.codigo,
          sem_asignado: String(data.infoSemestre.semestre),
          estado: ramo.estado || "pendiente",
        })),
      });
    }




    async updateRanking(plan_key: {rut_alumno: string, fecha_plan: Date}, ranking: number){
      const res = await this.prisma.planificacion.update({
        where: {
          rut_alumno_fecha: {
            rut_alumno: plan_key.rut_alumno,
            fecha: plan_key.fecha_plan,
          },
        },
        data: {
          ranking: ranking,
        },
      });

      return res;
    }



    async deletePlan(rut_alumno: string, fecha: Date){

       const plan = await this.prisma.planificacion.delete({
          where:{
            rut_alumno_fecha:{
              rut_alumno: rut_alumno,
              fecha: fecha,
            }
          },
          include: {
            ramos: true,
          },
        });

        return plan;
    }

}