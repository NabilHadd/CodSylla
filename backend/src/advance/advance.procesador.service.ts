import { Injectable } from '@nestjs/common';


@Injectable()
export class ProcesadorService {
  ramosPendientes(data: any) {

    if (data.error) {
      return { status: 'error', message: data.error };
    }

    const aprobados = data.filter(r => r.status == 'APROBADO').map(r => r.course)

    return aprobados
  }
}