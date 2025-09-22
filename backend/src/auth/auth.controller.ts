import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ProcesadorService } from './auth.procesador.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly procesadorService: ProcesadorService,
  ) {}

  /**
   * Endpoint POST /auth/login
   * Recibe email y password en el body
   */
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
  const { email, password } = body;

  console.log('1) Body recibido en controller:', body);

  const data = await this.authService.validateUser(email, password);
  console.log('2) Data recibida desde AuthService:', data);

  const resultado = this.procesadorService.procesarUsuario(data);
  console.log('3) Resultado procesado:', resultado);

  return resultado;
}
}