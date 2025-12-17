import { Controller, Get, UseGuards, Req, ForbiddenException, Post, Body} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private ensureAdmin(user: any) {
    if (!user || user.isAdmin !== true) {
      throw new ForbiddenException('Solo los administradores pueden acceder a este recurso');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('audit-log')
  findAuditLog(@Req() req) {
    this.ensureAdmin(req.user);
    return this.adminService.getAuditLog();
  }

  @UseGuards(JwtAuthGuard)
  @Get('ramos')
  findRamos(@Req() req) {
    this.ensureAdmin(req.user);
    return this.adminService.getRamos();
  }

  @Post('audit-ramos')
  findAuditRamos(@Body('semestre') semestre: string) {
    const sem = Number(semestre);
    console.log(semestre)
    return this.adminService.getAuditRamos(sem);
  }
}
