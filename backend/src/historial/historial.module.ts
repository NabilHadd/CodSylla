import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { HistorialRepository } from 'src/persistence/historial.repository';
import { GetAllService } from 'src/get-all/get-all.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PersistenceModule, JwtModule],
  controllers: [HistorialController],
  providers: [
    HistorialService,
    HistorialRepository,
    GetAllService,
    PrismaService
  ],
})
export class HistorialModule {}
