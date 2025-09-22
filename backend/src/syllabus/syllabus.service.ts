import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { ProcesadorService } from './syllabus.procesador.service';


@Injectable()
export class SyllabusService {
    constructor(private readonly httpService: HttpService, 
      private readonly procesadorService: ProcesadorService,
      private readonly authService: AuthService
    ) {}

    async getSyllabus(syllabusCode: string, catalogCode: string) {
    const url = `https://losvilos.ucn.cl/hawaii/api/mallas?${syllabusCode}-${catalogCode}`;

    try {
      // Hacemos la petición GET usando axios integrado con NestJS
      const response = await firstValueFrom(
        this.httpService.get(url, {
            headers: {
                'X-HAWAII-AUTH': 'jf400fejof13f',
            },
        }),
    
    );

      const data = response.data;

      // Si la respuesta tiene "error", devolvemos null
      if (data.error) {
        return { success: false, message: data.error };
      }

      // Si es exitoso, devolvemos los datos del usuario
      const ramos = this.procesadorService.procesarMalla(data)
      return {
        success: true,
        ramos
      };

    } catch (error) {
      // Si la API externa falla (timeout, caida, etc.)
      return {
        success: false,
        message: 'Error al conectar con el servicio externo',
        details: error.message,
      };
    }
  }
}
