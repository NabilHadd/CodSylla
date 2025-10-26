import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { ProcesadorService } from './advance.procesador.service';


@Injectable()
export class AdvanceService {
        constructor(private readonly httpService: HttpService,
        private readonly procesadorService: ProcesadorService){}
    
        async getAdvance(rut: string, codcarrera: string) {
        const url = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${rut}&codcarrera=${codcarrera}`;
    
        try {
          // Hacemos la petición GET usando axios integrado con NestJS
          const response = await firstValueFrom(
            this.httpService.get(url),
        
        );
    
          const data = response.data;
    
          // Si la respuesta tiene "error", devolvemos null
          if (data.error) {
            return { success: false, message: data.error };
          }
    
          const aprobados = this.procesadorService.ramosPendientes(data)

          const data_no_excluded = data.filter(r => r.excluded === false)


          // Si es exitoso, devolvemos los datos del usuario
          return [{
            success: true,
            aprobados: aprobados
          }, data_no_excluded];
    
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
