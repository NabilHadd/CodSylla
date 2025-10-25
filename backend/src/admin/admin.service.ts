import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAuditLog() {
    try {
      return await this.prisma.audit_log.findMany({
        orderBy: { fecha: 'desc' },
        include: {
          usuario: {
            select: {
              rut: true,
              email: true,
              rol: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudieron obtener los registros de auditoría',
        {
          cause: error,
        },
      );
    }
  }

  async getRamos() {
    try {
      return await this.prisma.ramo.findMany({
        orderBy: [{ nivel: 'asc' }, { codigo: 'asc' }],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudieron obtener los ramos',
        {
          cause: error,
        },
      );
    }
  }
}
