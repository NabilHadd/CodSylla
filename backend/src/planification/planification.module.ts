import { Module } from '@nestjs/common';
import { PlanificationService } from './planification.service';
import { PlanificationController } from './planification.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
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
