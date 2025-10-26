import { Module } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { PlanificationController } from './planification.controller';
import { AdvanceModule } from 'src/advance/advance.module';
import { SyllabusModule } from 'src/syllabus/syllabus.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    AdvanceModule,
    SyllabusModule
  ],
  controllers: [PlanificationController],
  providers: [
    PlanificationService,
    PrismaService

  ],
  exports: [
    PrismaService
  ]
})
export class PlanificationModule {}
