import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GetAllService {

    //y aca se maneja la logica haciendo uso de rut, debido a que ya sea desde local storage o desde auth, se obtendra
    constructor(
        private readonly prisma: PrismaService
        ) {}

    async getRamos(body: { rut: string; carrera: { codigo: string; catalogo: string }}) {
        const { rut, carrera } = body;

    // Todos los ramos del syllabus de la carrera
    const ramos = await this.prisma.ramos_syllabus.findMany({
        where: {
            codigo_syll: carrera.codigo,
            catalogo: carrera.catalogo,
        },
    });

        // Obtenemos los códigos de ramos ya aprobados o inscritos
        const historial = await this.getPendientes(rut); // devuelve los NO pendientes
        // historial = [codigos de ramos aprobados o inscritos]

        // Filtramos los ramos pendientes (los que NO están en historial)
        const pendientes = ramos.filter(r => !historial.includes(r.codigo_ramo));

        // Agregamos el nombre
        const ramosConNombre = await Promise.all(
            pendientes.map(async (x) => ({
                nombre: await this.getNombreRamo(x.codigo_ramo),
                codigo: x.codigo_ramo,
            }))
        );

        return ramosConNombre;
    }


    async getNombreRamo(codigo: string) {
        const ramo = await this.prisma.ramo.findFirst({
            where: { codigo },
        });

        return ramo?.nombre || "";
    }

    async getPendientes(rut: string): Promise<string[]> {
        const filtro = await this.prisma.historial_academico.findMany({
            where: {
                rut_alumno: rut,
                estado: { in: ['APROBADO', 'INSCRITO'] },
            },
        });

        return filtro.map(x => x.codigo_ramo);
    }

    getSemestreActual(){
        const fecha = new Date()
        const semestre = String(fecha.getFullYear()) + (fecha.getMonth() < 5 ? '10' : '20')
        return Number(semestre)
    }

    async getRamosActuales(rut: string){
        const ramosActuales = await this.prisma.historial_academico.findMany({
            where:{
                sem_cursado: String(this.getSemestreActual()),
                rut_alumno: rut,
            },
        });

        return ramosActuales;
    }

    //trae devuelta los codigos de preramo de un ramo
    async getPreramosCodes(codigo_ramo: string): Promise<string[]> {
        const prereqs = await this.prisma.prerequisitos.findMany({
          where: { codigo_ramo }
        });
        return prereqs.map(p => p.codigo_preramo); // <-- solo los códigos
      }

              //se esta obviando que los inscritos se aprobaron solo para la planificación provisional.
      async getRamosAprobados(rutAlumno: string) {
        return this.prisma.historial_academico.findMany({
          where: {
            rut_alumno: rutAlumno,
            estado: {
              not: 'REPROBADO', // Filtra todo lo que NO sea "reprobado"
            },
          },
        });
      }



      

      //trae devuelta TODOS los ramos del historial.
    async getHistorial(rutAlumno: string){
        return this.prisma.historial_academico.findMany({
          where: {
            rut_alumno: rutAlumno,
          },
        });
    }



      //no se usa
      //trae de vuelta los preramos de un ramo
      async getPreramos(codigo_ramo: string){
        return this.prisma.prerequisitos.findMany({
          where: {
            codigo_ramo: codigo_ramo
          },
        });
      }

            //despues de cada semestre construido se agrega a aprobados los ramos que se incluyeron en el semesre.
      async getDisponibles(
        ramosPendientes: string[],
        ramosAprobados: string[],
        postponed?: { codigo: string; nombre: string }[],
      ) {
        
          const preramosList = await Promise.all(
            ramosPendientes.map(x => this.getPreramosCodes(x))
          );

          const disponibles = ramosPendientes.filter((ramo, i) =>
            preramosList[i].every(pr => ramosAprobados.includes(pr))
          );
          if(!postponed){
            return disponibles
          }else {
            return disponibles.filter(d => !postponed.map(p => p.codigo).includes(d))
          }


      }




}