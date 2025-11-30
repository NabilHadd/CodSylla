import { Module } from '@nestjs/common';

import { PlanificationRepository } from './planification.repository';
import { RamoRepository } from './ramo.repository';
import { HistorialRepository } from './historial.repository';
import { PreramosRepository } from './preramos.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    PlanificationRepository,
    RamoRepository,
    HistorialRepository,
    PreramosRepository
  ],
  exports: [
    PlanificationRepository,
    RamoRepository,
    HistorialRepository,
    PreramosRepository
  ],
})
export class PersistenceModule {}