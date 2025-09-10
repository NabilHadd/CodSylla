import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Valida las credenciales contra el endpoint externo
   */
  async validateUser(email: string, password: string) {
    const url = `https://puclaro.ucn.cl/eross/avance/login.php?email=${email}&password=${password}`;

    try {
      // Hacemos la petición GET usando axios integrado con NestJS
      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;

      // Si la respuesta tiene "error", devolvemos null
      if (data.error) {
        return { success: false, message: data.error };
      }

      // Si es exitoso, devolvemos los datos del usuario
      return {
        success: true,
        rut: data.rut,
        carreras: data.carreras,
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
