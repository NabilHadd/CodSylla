import { Injectable } from '@nestjs/common';


@Injectable()
export class ProcesadorService {
  ramosPendientes(data: any) {

    if (data.error) {
      return { status: 'error', message: data.error };
    }

    const aprobados = data.filter(r => r.status == 'APROBADO').map(r => r.course)

    const resultado = Object.entries(
      data.reduce((acc, r) => ((acc[r.course] = (acc[r.course] || 0) + 1), acc), {} as Record<string, number>)
    ).map(([course, count]) => ({ course, count }));


    const resultado_1 = Object.entries(
      data.reduce((acc, r) => {
        const key = JSON.stringify(r); // convierte todo el objeto a string
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([objStr, count]) => ({ ...JSON.parse(objStr), count }));

    const resultado_2 = Object.entries(
      data.reduce((acc, r) => {
        const key = `${r.course}|${r.period}`; // clave combinada course + period
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([key, count]) => {
      const [course, period] = key.split('|');
      return { course, period, count };
    });

    const ecin = data.filter(r => r.course === 'ECIN-00261');

    const count = data.length
      
    return count
          
    }
    
}