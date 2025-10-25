import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('audit-log')
  findAuditLog() {
    return this.adminService.getAuditLog();
  }

  @Get('ramos')
  findRamos() {
    return this.adminService.getRamos();
  }
}
