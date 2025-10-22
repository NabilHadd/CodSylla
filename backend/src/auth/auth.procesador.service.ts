import { Injectable } from '@nestjs/common';


@Injectable()
export class ProcesadorService {
  procesarUsuario(data: any) {

    if (data.error) {
      console.log('Error detectado:', data.error);
      return { status: 'error', message: data.error };
    }

    // Ejemplo de procesamiento
    //const carreras = data.carreras.map(c => ({
    //  codigo: c.codigo,
    //  nombre: c.nombre.toUpperCase(), // transforma el nombre
    //  catalogo: c.catalogo,
    //}));

    return {
      rut: data.rut,
    };
  }
}