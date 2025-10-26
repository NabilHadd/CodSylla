import { Injectable } from '@nestjs/common';
import { AdvanceService } from 'src/advance/advance.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SyllabusService } from 'src/syllabus/syllabus.service';

@Injectable()
export class PlanificationService {

      constructor(
        private readonly advanceService: AdvanceService,
        private readonly syllabusService: SyllabusService,
        private readonly prisma: PrismaService
      ) {}

      generarPlanificacion(rut: string){
        
      }

      disponibles(ramosPendientes, ramosAprobados){

      }

      


}
