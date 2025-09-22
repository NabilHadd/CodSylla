import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProcesadorModule } from './syllabus.procesador.module';

@Module({
  imports: [HttpModule, AuthModule, ProcesadorModule],
  controllers: [SyllabusController],
  providers: [SyllabusService],
})
export class SyllabusModule {}
