import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1]; // Bearer <token>

    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      req.user = payload; // ahora req.user tendrá { rut, carreras }
      return true;
    } catch (err) {
      console.error('JWT Error:', err.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
