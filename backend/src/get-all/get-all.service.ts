import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GetAllService {

    //y aca se maneja la logica haciendo uso de rut, debido a que ya sea desde local storage o desde auth, se obtendra
    constructor(
        private readonly prisma: PrismaService
        ) {}

async getRamos(body: { rut: string; carrera: { codigo: string; catalogo: string }}) {
    const { rut, carrera } = body;

    // Todos los ramos del syllabus de la carrera
    const ramos = await this.prisma.ramos_syllabus.findMany({
        where: {
            codigo_syll: carrera.codigo,
            catalogo: carrera.catalogo,
        },
    });

        // Obtenemos los códigos de ramos ya aprobados o inscritos
        const historial = await this.getPendientes(rut); // devuelve los NO pendientes
        // historial = [codigos de ramos aprobados o inscritos]

        // Filtramos los ramos pendientes (los que NO están en historial)
        const pendientes = ramos.filter(r => !historial.includes(r.codigo_ramo));

        // Agregamos el nombre
        const ramosConNombre = await Promise.all(
            pendientes.map(async (x) => ({
                nombre: await this.getNombreRamo(x.codigo_ramo),
                codigo: x.codigo_ramo,
            }))
        );

        return ramosConNombre;
    }


    async getNombreRamo(codigo: string) {
        const ramo = await this.prisma.ramo.findFirst({
            where: { codigo },
        });

        return ramo?.nombre || "";
    }

    async getPendientes(rut: string): Promise<string[]> {
        const filtro = await this.prisma.historial_academico.findMany({
            where: {
                rut_alumno: rut,
                estado: { in: ['APROBADO', 'INSCRITO'] },
            },
        });

        return filtro.map(x => x.codigo_ramo);
    }

}