import { Injectable } from '@nestjs/common';
import { GetAllService } from 'src/get-all/get-all.service';
import { HistorialRepository } from 'src/persistence/historial.repository';

@Injectable()
export class HistorialService {
    constructor(
        private readonly histoRepo: HistorialRepository,
        private readonly getAll: GetAllService,
    ){}

    async updateManyEstados(rut_alumno: string, ramos: any[]){
        const semestre = this.getAll.getSemestreActual();
        this.histoRepo.updateEstadoRamo(rut_alumno, ramos, String(semestre));
    }

}
