import { Controller, Post, Body, UseGuards, Req} from '@nestjs/common';
import { HistorialService } from './historial.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('historial')
export class HistorialController {
  constructor(
    private readonly historialService: HistorialService,
  ) {}
  
  @UseGuards(JwtAuthGuard)
  @Post('modificar-estado-ramos')
  async actualizarMultiples(@Req() req, @Body() body) {
    const rut = req.user.rut;
  
    return this.historialService.updateManyEstados(rut, body.ramos);
  }
}
