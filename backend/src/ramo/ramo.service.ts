import { Injectable } from '@nestjs/common';
import { GetAllService } from 'src/get-all/get-all.service';
import { HistorialRepository } from 'src/persistence/historial.repository';
import { RamoRepository } from 'src/persistence/ramo.repository';

@Injectable()
export class RamoService {
    constructor(
        private readonly ramoRepo: RamoRepository,
        private readonly histoRepo: HistorialRepository,
        private readonly getAll: GetAllService
    ){}


    async getRamosActuales(rut_alumno: string){
        const semestre_actual = this.getAll.getSemestreActual();
        return this.ramoRepo.findRamosActuales(rut_alumno, String(semestre_actual));
    }


    async getRamosPendientes(body: {rut: any, carrera: {codigo_syll: any, catalogo: any}}){
        const {rut, carrera} = body;

        const ramos = await this.ramoRepo.findAllRamos(carrera.codigo_syll, carrera.catalogo);
        
        const aprobados = await this.histoRepo.findAprobados(rut);
        const historial = aprobados.map(x => x.codigo_ramo);
        const pendientes = ramos.filter(r => !historial.includes(r.codigo_ramo));
        const ramosConNombre = await Promise.all(
            pendientes.map(async (x) => ({
                nombre: await this.ramoRepo.findNombreRamo(x.codigo_ramo),
                codigo: x.codigo_ramo,
            }))
        );

        return ramosConNombre;
    }
    
}
