import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    try {
      const user = this.jwtService.verify(token);
      req.user = user; // ✅ agregamos los datos del usuario
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
