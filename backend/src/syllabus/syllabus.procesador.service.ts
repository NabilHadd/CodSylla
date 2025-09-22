import { Injectable } from '@nestjs/common';


@Injectable()
export class ProcesadorService {
  procesarMalla(data: any) {

    if (data.error) {
      console.log('Error detectado:', data.error);
      return { status: 'error', message: data.error };
    }

    // Algoritmo para reconstruir la malla
    const niveles = data.reduce((actual , max) => actual.nivel > max.nivel ? actual : max, -1).nivel;

    const malla: any[] = [];

    for (let index = 0; index < niveles; index++) {
      const ramosDelSemestre = data
        .filter(r => r.nivel == index +1)
        .map(r => ({
          asignatura: r.asignatura,
          prereq: r.prereq ? r.prereq.split(",") : []
        }));

        const ramosConPrer = ramosDelSemestre.map(ramo => ({
          asignatura: ramo.asignatura,
          prerequisitos: ramo.prereq.map(p => {
            const encontrado = data.find(r => r.codigo === p);
            return encontrado ? encontrado.asignatura : null
          }).filter(r => r != null)

        }));


      malla.push({
        semestre: index +1,
        ramos: ramosConPrer
      });

      
    }


    //const mallaFinal = malla.map(sem => (sem.ramos.prereq.map(p => data.filter(r => r.codigo == p).map(n => n.asignatura))))

    return {
      status: 'ok',
      malla
    };
  }


}