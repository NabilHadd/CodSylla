import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { GetAllService } from 'src/get-all/get-all.service';
import { HistorialRepository } from 'src/persistence/historial.repository';
import { PlanificationRepository } from 'src/persistence/planification.repository';
import { RamoRepository } from 'src/persistence/ramo.repository';

@Injectable()
export class PlanificationService {

    //y aca se maneja la logica haciendo uso de rut, debido a que ya sea desde local storage o desde auth, se obtendra
      constructor(
        private readonly planRepo: PlanificationRepository,
        private readonly ramoRepo: RamoRepository,
        private readonly histoRepo: HistorialRepository,
        private readonly getAll: GetAllService
      ) {}

      async generarPlan(body: { 
                  rut: string; 
                  carrera: { codigo: string; catalogo: string; nombre: string; },
              })
      {

        const fecha_creacion = new Date();
        const MAX_CREDITOS = 32;
        const { rut, carrera} = body;

        const aprobados = await this.histoRepo.findAprobados(rut)
        const ramos = await this.getRamos(carrera.codigo, carrera.catalogo)
        const historial = await this.histoRepo.findHistorial(rut)
        historial.sort((a, b) => Number(a.sem_cursado) - Number(b.sem_cursado));


        //codigo de los ramos aprobados
        const aprobados_cod = aprobados.map(r => (ramos.find(ra => (ra.codigo_ramo == r.codigo_ramo)))).filter(r => r != null).map(r => r.codigo_ramo)
        
        //codigo de los ramos pendientes
        const pendientes = ramos.filter(r => !aprobados_cod.includes(r.codigo_ramo)).map(r => r.codigo_ramo)

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



        let semestreActual = this.getAll.siguienteSemestre(this.getAll.getSemestreActual())// primer semestre si no hay historial
        const semestre = semestreActual;

        while (pendientes_actuales.length > 0) {
          const disponiblesAhora = await this.getAll.getDisponibles(pendientes_actuales, aprobados_actuales);

          if (disponiblesAhora.length === 0) {
            console.warn("No hay más ramos disponibles (posible dependencia circular o datos incompletos)");
            break;
          }

          // Traer info completa de cada ramo
          const ramosDetallados = await this.ramoRepo.findDisponibles(disponiblesAhora);
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
          semestreActual = this.getAll.siguienteSemestre(semestreActual);
        }


        await this.createPlan(rut, 'provisional', String(semestre), 1, fecha_creacion)
        await this.agregarRamosPlanificacion(rut, fecha_creacion, plan)


        // 7️⃣ retorno final
        return {
          plan,
          totalSemestres: plan.length,
        };

      }





      async generarPlanS(body: { 
        rut: string; 
        carrera: { codigo: string; catalogo: string; nombre: string; },
        nombre: string;
        maxCredits: number;
        postponed: { codigo: string; nombre: string }[];
        priority: { codigo: string; nombre: string }[];
        reprobed: { codigo: string; nombre: string }[];
      }){

        const { rut, carrera, nombre, maxCredits, postponed, priority, reprobed} = body;

        let will_fail_once = [...reprobed].map(x => x.codigo);

        const MAX_CREDITOS = maxCredits
        const NOMBRE = nombre

        const fecha_creacion = new Date();
 
        const aprobados = await this.histoRepo.findAprobados(rut)
        const ramos = await this.getRamos(carrera.codigo, carrera.catalogo)
        const historial = await this.histoRepo.findHistorial(rut)


        historial.sort((a, b) => Number(a.sem_cursado) - Number(b.sem_cursado));


        //codigo de los ramos aprobados
        const aprobados_cod = aprobados.map(r => (ramos.find(ra => (ra.codigo_ramo == r.codigo_ramo)))).filter(r => r != null).map(r => r.codigo_ramo)
        
        //codigo de los ramos pendientes
        const pendientes = ramos.filter(r => !aprobados_cod.includes(r.codigo_ramo)).map(r => r.codigo_ramo)


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



        let semestreActual = this.getAll.siguienteSemestre(this.getAll.getSemestreActual()) // primer semestre si no hay historial
        const semestre = semestreActual;

                  // Ordenar por prioridad y nivel


        while (pendientes_actuales.length > 0) {

          const disponiblesAhora = pendientes.length == pendientes_actuales.length
            ? await this.getAll.getDisponibles(pendientes_actuales, aprobados_actuales, postponed)
            : await this.getAll.getDisponibles(pendientes_actuales, aprobados_actuales);

          if (disponiblesAhora.length === 0)
            throw new Error("No hay ramos disponibles para continuar la planificación.");

          // Traer info completa
          const ramosDetallados = await this.ramoRepo.findDisponibles(disponiblesAhora);

          // Ordenar por nivel (o prioridad)
          const ordenados = ramosDetallados.sort((a, b) => {
            const aPrioritario = priority.some(p => p.codigo === a.codigo);
            const bPrioritario = priority.some(p => p.codigo === b.codigo);

            if (aPrioritario && !bPrioritario) return -1; // a primero
            if (!aPrioritario && bPrioritario) return 1;  // b primero
            return Number(a.nivel) - Number(b.nivel); // si ambos o ninguno, por nivel
          });

          let semestreRamos: { codigo: string; estado: string; creditos: number }[] = [];
          let creditos = 0;

          for (const ramo of ordenados) {
            if (creditos + ramo.creditos <= MAX_CREDITOS) {

              if(will_fail_once.includes(ramo.codigo)){
                semestreRamos.push({ codigo: ramo.codigo, estado: "reprobado", creditos: ramo.creditos });
                creditos += ramo.creditos;

              }else{
                semestreRamos.push({ codigo: ramo.codigo, estado: "pendiente", creditos: ramo.creditos });
                creditos += ramo.creditos;

              }

            }
          }

          // ✅ Si no se pudo agregar ninguno (por límite bajo), agregar el más bajo nivel igual
          if (semestreRamos.length === 0 && ordenados.length > 0) {
            const ramoGrande = ordenados[0];
            semestreRamos.push({ codigo: ramoGrande.codigo, estado: "pendiente", creditos: ramoGrande.creditos });
            creditos = ramoGrande.creditos;
          }

          // Guardar el semestre
          plan.push({ semestre: semestreActual, ramos: semestreRamos, totalCreditos: creditos });

          // Actualizar aprobados y pendientes solo con los realmente agregados
          const cursadosEsteSemestre = semestreRamos.filter(x => x.estado !== 'reprobado').map(r => r.codigo);
          will_fail_once = will_fail_once.filter(x => !semestreRamos.map(x => x.codigo).includes(x));
          aprobados_actuales.push(...cursadosEsteSemestre);
          pendientes_actuales = pendientes_actuales.filter(r => !cursadosEsteSemestre.includes(r));

          // Avanzar semestre
          semestreActual = this.getAll.siguienteSemestre(semestreActual);
        }



        try {
          await this.createPlan(
            rut,
            NOMBRE,
            String(semestre),
            await this.getMaxRanking(rut),
            fecha_creacion
          );

          await this.agregarRamosPlanificacion(rut, fecha_creacion, plan);

          return {
            success: true,
            plan,
            totalSemestres: plan.length,
          };
        } catch (error) {
          return { success: false, error: error.message || 'Error al crear el plan.' };
        }

      }






      //el home del alumno por defecto siempre va a consultar el ranking n°1
      //el cual siempre estara lleno debido a que apenas se ingresa a la pagina se agrega la provisional
      //al ranking n°1
      async getPlanificacion(body, ranking){

        const {rut, carrera} = body

        //se consulta por el plan
        const plan = await this.planRepo.findByRanking(rut, ranking); 

        if(!plan) throw new Error("Planificación no encontrada");

        //se utiliza la llave del plan para acceder a los ramos
        const ramos_plan = await this.planRepo.findRamosPlan(rut, plan.fecha);

        const ramos = await Promise.all(
          ramos_plan.map(async (r) => {
            const ramo = await this.ramoRepo.findRamo(r.codigo_ramo)

            //por que no devolvemos los creditos???????????
            return {
              nombre: ramo?.nombre || '',
              estado: r.estado,
              sem_asignado: r.sem_asignado,
              codigo: ramo?.codigo,
              creditos: ramo?.creditos
            };
          })
        );

        //se extraen los semestres
        const aux = ramos.map(x => x.sem_asignado);
        const semestres = [...new Set(aux)]
          .sort((a, b) => Number(a) - Number(b));

        //se ordenan los ramos por semestre
        const planificacion = semestres
          .map(z => ({ 
            sem: z,
            ramos: ramos.filter(x => x.sem_asignado == z)
          }))
            
        return planificacion
        
      }



      async getPlanes(body){
        const planes = await this.planRepo.findAllPlanByRut(body.rut)

        return planes
      }



      //trae devuelta todos los ramos de una carrera
      async getRamos(codigo_syll: string, catalogo: string){
        return await this.ramoRepo.findAllRamos(codigo_syll, catalogo);
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


      async getMaxRanking(rut: string){
        const planes = await this.planRepo.findAllPlanByRut(rut);

        const rankings = planes.map(r => r.ranking)

        return (rankings.length > 0) ?  (Math.max(...rankings) + 1) : 0;
      }
    


    
      async createPlan(
        rut: string,
        nombre: string,
        semestre: string,
        ranking: number,
        fecha: Date
      ) {
        const existingPlan = await this.planRepo.findPlanByName(rut, nombre);

        if (existingPlan) {
          throw new Error('Ya existe un plan con ese nombre para este alumno.');
        }

        const plan = await this.planRepo.createPlan(          
          {
            rut_alumno: rut,
            fecha,
            nombre_plan: nombre,
            sem_plan: semestre,
            ranking,
          }
        )
        console.log('plan subido')
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

          await this.planRepo.fillPlan({rut_alumno: rut, fecha_plan: fechaPlan, infoSemestre: semestreObj})

        }
        console.log('planificacion provisional lista.')
      }




      //se podria usar el rut que esta en planes, o el del alumno en el local storage, aqui estamos usando la del local storage.
      async actualizarRanking(rut, planes: any) {
        for (const element of planes) {
          
          await this.planRepo.updateRanking({rut_alumno: rut, fecha_plan: element.fecha}, element.ranking)
        }

        return { message: 'Rankings actualizados correctamente' };
      }

      async deletePlan(rut_alumno: string, fecha: Date, ranking: number){

        const planes = await this.planRepo.findAllPlanByRut(rut_alumno);


        planes.forEach(async p => {
          if(p.ranking > ranking){
            await this.planRepo.updateRanking({rut_alumno: p.rut_alumno, fecha_plan: p.fecha}, (p.ranking-1))
          }
        });

        try {
          const res = await this.planRepo.deletePlan(rut_alumno, fecha);
          return {
            success: true,
            res
          }
        } catch (error) {
          return {
            success: false,
            error
          }
        }

      }

}
