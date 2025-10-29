import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanificationService {

    //y aca se maneja la logica haciendo uso de rut, debido a que ya sea desde local storage o desde auth, se obtendra
      constructor(
        private readonly prisma: PrismaService
      ) {}

      async generarPlanificacion(body: { 
                  rut: string; 
                  carrera: { codigo: string; catalogo: string; nombre: string; },
              })
      {

        const fecha_creacion = new Date();
        const MAX_CREDITOS = 32;
        const { rut, carrera} = body;

        const aprobados = await this.getRamosAprobados(rut)
        const ramos = await this.getRamos(carrera.codigo, carrera.catalogo)
        const historial = await this.getHistorial(rut)
        historial.sort((a, b) => Number(a.sem_cursado) - Number(b.sem_cursado));


        //codigo de los ramos aprobados
        const aprobados_cod = aprobados.map(r => (ramos.find(ra => (ra.codigo_ramo == r.codigo_ramo)))).filter(r => r != null).map(r => r.codigo_ramo)
        
        //codigo de los ramos pendientes
        const pendientes = ramos.filter(r => !aprobados_cod.includes(r.codigo_ramo)).map(r => r.codigo_ramo)

        //semestres sin los de verano ni invierno
        const semestresNormales = historial
          .map(h => Number(h.sem_cursado))
          .filter(s => ![15, 25].includes(Number(String(s).slice(-2))));
        
        let maxSemestre = semestresNormales.length > 0 ? Math.max(...semestresNormales) : 0;
        let minSemestre = semestresNormales.length > 0 ? Math.min(...semestresNormales) : 0;

        const aux = historial.map(x => x.sem_cursado);
        const semestres_historial = [...new Set(aux)]
          .sort((a, b) => Number(a) - Number(b));



        



        let plan: { semestre: number; ramos: { codigo: string; estado: string; creditos: number }[]; totalCreditos: number }[] = [];
        let aprobados_actuales = [...aprobados_cod];
        let pendientes_actuales = [...pendientes];

        const historial_semestres = semestres_historial.map(z => historial.filter(x => x.sem_cursado == z))


        historial_semestres.forEach(semArray => {
          plan.push({
            semestre: Number(semArray[0].sem_cursado), 
            ramos: semArray.map(r => ({
              codigo: r.codigo_ramo,
              estado: r.estado,
              creditos: 0 // por ahora dejamos en 0
            })),
            totalCreditos: 0
          });
        });



        let semestreActual = maxSemestre > 0 ? this.siguienteSemestre(maxSemestre) : 200010; // primer semestre si no hay historial
        const semestre = semestreActual;

        while (pendientes_actuales.length > 0) {
          const disponiblesAhora = await this.disponibles(pendientes_actuales, aprobados_actuales);

          if (disponiblesAhora.length === 0) {
            console.warn("No hay más ramos disponibles (posible dependencia circular o datos incompletos)");
            break;
          }

          // Traer info completa de cada ramo
          const ramosDetallados = await this.prisma.ramo.findMany({
            where: { codigo: { in: disponiblesAhora } },
            select: { codigo: true, nombre: true, creditos: true, nivel: true },
          });

          // Ordenar por nivel
          const ordenados = ramosDetallados.sort((a, b) => Number(a.nivel) - Number(b.nivel));

          let semestreRamos: { codigo: string; estado: string; creditos: number }[] = [];
          let creditos = 0;

          for (const ramo of ordenados) {
            if (creditos + ramo.creditos <= MAX_CREDITOS) {
              semestreRamos.push({ codigo: ramo.codigo, estado: "pendiente", creditos: ramo.creditos });
              creditos += ramo.creditos;
            }
          }

          plan.push({ semestre: semestreActual, ramos: semestreRamos, totalCreditos: creditos });

          aprobados_actuales.push(...ordenados.map(r => r.codigo));
          pendientes_actuales = pendientes_actuales.filter(r => !ordenados.map(r => r.codigo).includes(r));

          // Avanzar al siguiente semestre normal
          semestreActual = this.siguienteSemestre(semestreActual);
        }

        //console.log('plan provisional')
        //console.log(JSON.stringify(plan, null, 2));


        await this.createPlan(rut, 'provisional', String(semestre), 1, fecha_creacion)
        await this.agregarRamosPlanificacion(rut, fecha_creacion, plan)

        console.log(plan)

        // 7️⃣ retorno final
        return {
          plan,
          totalSemestres: plan.length,
        };

      }

      //el home del alumno por defecto siempre va a consultar el ranking n°1
      //el cual siempre estara lleno debido a que apenas se ingresa a la pagina se agrega la provisional
      //al ranking n°1
      async getPlanificacion(body, ranking){

        const {rut, carrera} = body

        //se consulta por el plan
        const plan = await this.prisma.planificacion.findFirst({
          where: {
            rut_alumno: rut,
            ranking: ranking          
          },
        });

        if(!plan) throw new Error("Planificación no encontrada");

        //se utiliza la llave del plan para acceder a los ramos
        const ramos_plan = await this.prisma.planificacion_ramo.findMany({
          where: {
            rut_alumno: rut,
            fecha_plan: plan.fecha
          },
        })

        const ramos = await Promise.all(
          ramos_plan.map(async (r) => {
            const ramo = await this.prisma.ramo.findUnique({
              where: { codigo: r.codigo_ramo },
            });

            return {
              nombre: ramo?.nombre || '',
              estado: r.estado,
              sem_asignado: r.sem_asignado,
            };
          })
        );

        //se extraen los semestres
        const aux = ramos.map(x => x.sem_asignado);
        const semestres = [...new Set(aux)]
          .sort((a, b) => Number(a) - Number(b));

        //se ordenan los ramos por semestre
        const ramos_por_semestre = semestres
          .map(z => ({ 
            sem: z,
            ramos: ramos.filter(x => x.sem_asignado == z)
          }))
            
        return ramos_por_semestre
        
      }

      //despues de cada semestre construido se agrega a aprobados los ramos que se incluyeron en el semesre.
      async disponibles(ramosPendientes: string[], ramosAprobados: string[]) {
          const preramosList = await Promise.all(
            ramosPendientes.map(x => this.getPreramosCodes(x))
          );

          return ramosPendientes.filter((ramo, i) =>
            preramosList[i].every(pr => ramosAprobados.includes(pr))
          );
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

      //trae devuelta todos los ramos de una carrera
      async getRamos(codigo_syll: string, catalogo: string){
        return this.prisma.ramos_syllabus.findMany({
          where: {
            codigo_syll: codigo_syll,
            catalogo: catalogo
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


      //trae devuelta los codigos de preramo de un ramo
      async getPreramosCodes(codigo_ramo: string): Promise<string[]> {
        const prereqs = await this.prisma.prerequisitos.findMany({
          where: { codigo_ramo }
        });
        return prereqs.map(p => p.codigo_preramo); // <-- solo los códigos
      }

      //no se usa
      //calcula todos los semestres entre un rango de semestres
      async rangoSemestres(minSem: number, maxSem: number): Promise<number[]> {
        const semestres: number[] = [];
        
        let semActual = minSem;

        while (semActual <= maxSem) {
          semestres.push(semActual);

          // calcular el siguiente semestre
          const anio = Math.floor(semActual / 100);
          const semNum = semActual % 100;

          let siguiente;
          switch (semNum) {
            case 10: // primer semestre normal
              siguiente = anio * 100 + 20; // segundo semestre normal
              break;
            case 20: // segundo semestre normal
              siguiente = anio * 100 + 25; // invierno
              break;
            case 25: // invierno
              siguiente = anio * 100 + 15; // verano
              break;
            case 15: // verano
              siguiente = (anio + 1) * 100 + 10; // primer semestre del año siguiente
              break;
            default:
              throw new Error(`Semestre inválido: ${semActual}`);
          }

          semActual = siguiente;
        }

        return semestres;
      }
    
      //devuelve el semestre siguiente
      siguienteSemestre(sem: number): number {
        const anio = Math.floor(sem / 100);
        let semNum = sem % 100;
        if (semNum === 10) return anio * 100 + 20; // pasar al segundo semestre normal
        else return (anio + 1) * 100 + 10; // pasar al primer semestre del año siguiente
      }

      async createPlan(
        rut: string,
        nombre: string,
        semestre: string,
        ranking: number,
        fecha: Date
      ) {
        const plan = await this.prisma.planificacion.create({
          data: {
            rut_alumno: rut,
            fecha: fecha,
            nombre_plan: nombre,
            sem_plan: semestre,
            ranking: ranking
          }
        });
        return plan;
      }


      async agregarRamosPlanificacion(
        rut: string,
        fechaPlan: Date,
        plan: { semestre: number; ramos: { codigo: string; estado: string; creditos: number }[]; totalCreditos: number }[]
      ) {
        for (const semestreObj of plan) {
          const semAsig = String(semestreObj.semestre);

          if (semestreObj.ramos.length === 0) continue; // evitar llamar createMany con array vacío

          await this.prisma.planificacion_ramo.createMany({
            data: semestreObj.ramos.map(ramo => ({
              rut_alumno: rut,
              fecha_plan: fechaPlan,
              codigo_ramo: ramo.codigo,
              sem_asignado: semAsig,
              estado: ramo.estado || "pendiente",
            })),
          });
        }
      }


}
