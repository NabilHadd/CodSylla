import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint POST /auth/login
   * Recibe email y password en el body
   */
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return await this.authService.validateUser(email, password);
  }
}