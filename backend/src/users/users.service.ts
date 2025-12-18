import { Injectable } from '@nestjs/common';
import { AdvanceService } from 'src/advance/advance.service';
import { SyllabusService } from 'src/syllabus/syllabus.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly advanceService: AdvanceService,
    private readonly syllabusService: SyllabusService,
    private readonly prisma: PrismaService
  ) {}



  async findAll() {
    try {
      return await this.prisma.usuario.findMany();
    } catch (error) {
      throw new Error(error.message);
    }
  }



  async findOne(rut: string) {
      const usuario =  await this.prisma.usuario.findUnique({
        where:{
          rut: rut,
        },
      })

      if(!usuario) throw new Error('Usuario no encotrado');
      return usuario
  }




  
  async create(body: { 
                  user: { rut: string; email: string; rol: string; }; 
                  carrera: { codigo: string; catalogo: string; nombre: string; } 
              }) 
    {



    const { user, carrera } = body;

    const root_advance = await this.advanceService.getAdvance(user.rut, carrera.codigo);
    const root_syll = await this.syllabusService.getSyllabus(carrera.codigo, carrera.catalogo);

    const ramos = root_syll[1];
    const avance = root_advance[1];


    if (user.rol !== 'alumno') return null; // solo alumnos



    const alumnoCarreraData = {
      rut_alumno: user.rut,
      codigo_carrera: carrera.codigo,
      catalogo: carrera.catalogo,
    };



    // --- Insertar usuario ---
    let userData;
    try {
      userData = await this.prisma.usuario.create({
        data: user,
      });
    } catch (error) {
      throw new Error(`Error insertando usuario: ${error.message}`);
    }

    console.log('se agrego a la tabla usuario')

    // --- Comprobar existencia de la carrera ---
    let existingCarrera = await this.prisma.carrera.findUnique({
      where: {
        codigo_catalogo: {
          codigo: carrera.codigo,
          catalogo: carrera.catalogo,
        },
      },
    });



    let carreraData;
    if (!existingCarrera) {
      // Obtener ramos y avance desde servicios externos

      // Insertar carrera
      try {
        carreraData = await this.prisma.carrera.create({
          data: carrera,
        });
      } catch (error) {
        throw new Error(`Error insertando carrera: ${error.message}`);
      }

      console.log('se agrego a la tabla carrera')


      // Insertar ramos y prerrequisitos
      for (let i = 0; i < ramos.length; i++) {
        
        const ramoData = {
          codigo: ramos[i].codigo,
          nombre: ramos[i].asignatura,
          creditos: ramos[i].creditos,
          nivel: String(ramos[i].nivel),
        };

        // Upsert ramo (insertar si no existe)
        try {
          await this.prisma.ramo.upsert({
          where: { codigo: ramoData.codigo },
          update: {},
          create: ramoData,
        });
        } catch(error){
          throw new Error(error.message);
        
        }


        // Insertar ramos_syllabus
        try{
          await this.prisma.ramos_syllabus.create({
            data: {
              codigo_ramo: ramos[i].codigo,
              codigo_syll: carrera.codigo,
              catalogo: carrera.catalogo,
            },
          });
        } catch(error){
          throw new Error(error.message)
        }




        // Insertar prerrequisitos
        const prereq = (ramos[i].prereq || '').split(',').map(p => p.trim()).filter(Boolean);

        for (const codigoPreramo of prereq) {
          // Comprobar si existe el preramo
          const exists = await this.prisma.ramo.findUnique({ where: { codigo: codigoPreramo } });
          if (!exists) continue; // ignorar si no existe

          
          try {
            await this.prisma.prerequisitos.upsert({
              where: {
                codigo_ramo_codigo_preramo: {
                  codigo_ramo: ramos[i].codigo,
                  codigo_preramo: codigoPreramo,
                },
              },
              update: {},
              create: {
                codigo_ramo: ramos[i].codigo,
                codigo_preramo: codigoPreramo,
              },
            });
          } catch (error) {
             throw new Error(error.message)
          }

        }
      }

      console.log('ramos')

    } else {
      carreraData = existingCarrera;
    }



      // Insertar historial académico
      // Insertar historial académico
    for (let i = 0; i < avance.length; i++) {
      const historial = {
        rut_alumno: user.rut,
        codigo_ramo: avance[i].course,
        sem_cursado: avance[i].period,
        estado: avance[i].status,
      };

      try {
        await this.prisma.historial_academico.create({ data: historial });
      } catch (error) {
        // Solo ignoramos errores de FK o de inserción, logueamos el resto
        console.warn(
          `No se pudo insertar historial del ramo ${avance[i].course} para ${user.rut}:`,
          error.message
        );
        continue; // sigue con el siguiente historial
      }
    }

    console.log('historial')
    
    // Insertar alumno_carrera
    const alumnoCarrera = await this.prisma.alumno_carrera.create({ data: alumnoCarreraData });
    
    return { user: userData, carrera: carreraData, alumno_carrera: alumnoCarrera };
  }








  async update(rut: string, user: any) {
    try {
      const updatedUser = await this.prisma.usuario.update({
        where: {
          rut: rut,
        },
        data : user
      });
      return updatedUser
    }catch(error){
      throw new Error(error.message)
    }
  }


  async remove(rut: string) {
    try {
      const deleteUser = await this.prisma.usuario.delete({
        where: {
          rut: rut,
        },
      });
      return deleteUser
    } catch (error) {
      throw new Error(error.message)
    }
  }

  findByEmail(email: string){
    const user = this.prisma.usuario.findFirst({
      where: {
        email: email,
      },
    });

    if(!user) return null;

    return user;
  }


}
