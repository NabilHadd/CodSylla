import { Module } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { PlanificationController } from './planification.controller';
import { AdvanceModule } from 'src/advance/advance.module';
import { SyllabusModule } from 'src/syllabus/syllabus.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AdvanceModule,
    SyllabusModule,
    JwtModule
  ],
  controllers: [PlanificationController],
  providers: [
    PlanificationService,
    PrismaService

  ],
  exports: [
    PlanificationService
  ]
})
export class PlanificationModule {}
