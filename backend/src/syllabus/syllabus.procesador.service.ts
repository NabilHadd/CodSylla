import { Injectable } from '@nestjs/common';


@Injectable()
export class ProcesadorService {
  procesarMalla(data: any) {

    if (data.error) {
      console.log('Error detectado:', data.error);
      return { status: 'error', message: data.error };
    }

    // Ejemplo de procesamiento
    const ramos = data.map(r => ({
      asignatura: r.asignatura
    }));

    return {
      status: 'ok',
      ramos
    };
  }
}