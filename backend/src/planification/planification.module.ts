import { Module } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { PlanificationController } from './planification.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { GetAllService } from 'src/get-all/get-all.service';
import { PlanificationRepository } from 'src/persistence/planification.repository';
import { RamoRepository } from 'src/persistence/ramo.repository';
import { HistorialRepository } from 'src/persistence/historial.repository';
import { PersistenceModule } from 'src/persistence/persistence.module';

@Module({
  imports: [
    JwtModule,
    PersistenceModule
  ],
  controllers: [PlanificationController],
  providers: [
    PlanificationService,
    PlanificationRepository,
    RamoRepository,
    HistorialRepository,
    PrismaService,
    GetAllService

  ],
  exports: [
    PlanificationService
  ]
})
export class PlanificationModule {}
