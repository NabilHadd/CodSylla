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

  const data = await this.authService.validateUser(email, password);

  const resultado = this.procesadorService.procesarUsuario(data);

  return data;
}
}