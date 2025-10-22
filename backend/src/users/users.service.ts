import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AdvanceService } from 'src/advance/advance.service';
import { SyllabusService } from 'src/syllabus/syllabus.service';

@Injectable()
export class UsersService {

  constructor(private readonly supabaseService: SupabaseService,
    private readonly advanceService: AdvanceService,
    private readonly syllabusService: SyllabusService
  ) {}

  async findAll() {
    const { data, error } = await this.supabaseService.client.from('usuario').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(rut: string) {
      const { data, error } = await this.supabaseService.client
          .from('usuario')
          .select('*')
          .eq('rut', rut)
          .single();

      if (error) {
          if (error.code === 'PGRST116') { // no se encontró
          return null;
          }
          throw new Error(error.message); // otros errores
      }

      return data;
  }
async create(body: { 
  user: { rut: string; email: string; rol: string; }; 
  carrera: { codigo: string; catalogo: string; nombre: string; } 
}) {
  const { user, carrera } = body;

  if (user.rol == 'alumno') { 
    //comprobación de que el usuario sea de tipo alumno, si no no hay que agregar nada de lo siguiente.
    //aunque, debido a que los admin seran hardcodeados en la base de datos, no tiene sentido hacer la comprobación.
    //ya que esta función solo es llamada si el usuario no existe, y un admin siempre existira,
    //la dejaremos por si acaso, pero no tiene demasiado sentido.
    
    const alumno_carrera = {
    rut_alumno: user.rut,
    codigo_carrera: carrera.codigo,
    catalogo: carrera.catalogo
  } 

  // Insertar usuario
  const { data: userData, error: userError } = await this.supabaseService.client
    .from('usuario')
    .insert(user)
    .select();

  if (userError) throw new Error(userError.message);

  // --- Comprobación antes de agregar la carrera ---
  const { data: existingCarrera, error: checkError } = await this.supabaseService.client
    .from('carrera')
    .select('*')
    .eq('codigo', carrera.codigo)
    .single(); // si existe solo devuelve uno

  if (checkError && checkError.code !== 'PGRST116') throw new Error(checkError.message);


  let carreraData;
  if (!existingCarrera) {

    const root_advance = await this.advanceService.getAdvance(user.rut, carrera.codigo)
    const root_syll = await this.syllabusService.getSyllabus(carrera.codigo, carrera.catalogo) //recordar que aca te esta retornando toda la malla.
    
    const ramos = root_syll[1]
    const avance = root_advance[1]
    // ramos sera :  [{ramo: {nombre, codigo, creditos, nivel} prerequisitos: [codigos] }]

    //aca agregar que inserte:
    //ramos
    //ramos_syllabus
    //prerequisitos
    //syllabus se ingresa por el trigger
    // Solo insertar si no existe
    const { data: newCarrera, error: carreraError } = await this.supabaseService.client
      .from('carrera')
      .insert(carrera)
      .select();

    if (carreraError) throw new Error(carreraError.message);

    //for para agregar todos los ramos y prerequisitos de cada ramo.
    for (let i = 0; i < ramos.length; i++) {
      const prereq = (ramos[i].prereq || '').split(',').filter(p => p.trim() !== '');
      const ramo = {
        codigo: ramos[i].codigo,
        nombre: ramos[i].asignatura,
        creditos: ramos[i].creditos,
        nivel: ramos[i].nivel
      }

      const { data: exists } = await this.supabaseService.client
        .from('ramo')
        .select('codigo')
        .eq('codigo', ramo.codigo)
        .maybeSingle();

      if (!exists) {
        const { error: ramoError } = await this.supabaseService.client
          .from('ramo')
          .insert(ramo);
        if (ramoError) throw new Error(ramoError.message);
      }

    }


    //En este for se hace algo un poco "malo" estamos ignorando todos esos codigos raros de prerequisitos (preguntar al profe sobre esos codigos)
    //preguntar al profe sobre ramos genericos como "formacion valorica" o los ramos de minor, pq esos dependen de cada alumno y la malla es generica, no especifica.
    for (let i = 0; i < ramos.length; i++) {

      const ramo_syllabus = {
        codigo_ramo: ramos[i].codigo,
        codigo_syll: carrera.codigo,
        catalogo: carrera.catalogo
      }

      const { data: newRamoSyll, error: ramoSyllError } = await this.supabaseService.client
        .from('ramos_syllabus')
        .insert(ramo_syllabus)
        .select();
      
      if (ramoSyllError) throw new Error(ramoSyllError.message);

      const prereq = (ramos[i].prereq || '').split(',').filter(p => p.trim() !== '');
      
      for (let j = 0; j < prereq.length; j++) {
        const codigoPreramo = prereq[j].trim();

        // Comprobar si el preramo existe
        const { data: exists, error: checkError } = await this.supabaseService.client
          .from('ramo')
          .select('codigo')
          .eq('codigo', codigoPreramo)
          .maybeSingle();

        if (checkError) { 
          console.error(`Error verificando prerrequisito ${codigoPreramo}:`, checkError);
          continue; // saltar este preramo
        }

        if (!exists) {
          console.warn(`Prerrequisito ${codigoPreramo} no existe, se ignora.`);
          continue; // no existe, lo ignoramos
        }

        const preramo = {
          codigo_ramo: ramos[i].codigo,
          codigo_preramo: codigoPreramo
        };

        const { error: preramoError } = await this.supabaseService.client
          .from('prerequisitos')
          .insert(preramo);

        if (preramoError) {
          console.error(`Error insertando prerrequisito para ramo ${ramos[i].codigo}:`, preramoError);
          // Opcional: seguir con los demás prerrequisitos en vez de lanzar
          continue;
        }
      }
    }


    //para agregar el historial:
    for (let i = 0; i < avance.length; i++) {
      const historial = {
        rut_alumno: user.rut,
        codigo_ramo: avance[i].course,
        sem_cursado: avance[i].period,
        estado: avance[i].status
      };

      const { data: newRamoSyll, error: ramoSyllError } = await this.supabaseService.client
        .from('historial_academico')
        .insert(historial)
        .select();

      if (ramoSyllError) {
        // Buscar nombre del ramo en el array ramos
        const ramoEncontrado = ramos.find(r => r.codigo === avance[i].course);
        const nombreRamo = ramoEncontrado ? ramoEncontrado.asignatura : avance[i].course;

        console.error(`Error insertando el ramo ${nombreRamo}: ${ramoSyllError.message}`);
        continue; // seguimos con los demás ramos
      }
    }
              
    

    carreraData = newCarrera;
  } else {
    carreraData = existingCarrera;
  }

  // Insertar alumno_carrera
  const { data: alumno_carreraData, error: alumno_carreraError } = await this.supabaseService.client
    .from('alumno_carrera')
    .insert(alumno_carrera)
    .select();

  if (alumno_carreraError) throw new Error(alumno_carreraError.message);

  return { user: userData, carrera: carreraData, alumno_carrera: alumno_carreraData };

  }
}




  async update(id: string, user: any) {
    const { data, error } = await this.supabaseService.client
      .from('usuario')
      .update(user)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService.client
      .from('usuario')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    return data;
  }

  procesarUsuario(){

  }
}
