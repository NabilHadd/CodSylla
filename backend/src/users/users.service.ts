import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {

  constructor(private readonly supabaseService: SupabaseService) {}
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

    const alumno_carrera = {
      rut_alumno: user.rut,
      codigo_carrera: carrera.codigo,
      catalogo: carrera.catalogo
    } 

    const { data: userData, error: userError } = await this.supabaseService.client
      .from('usuario')
      .insert(user)
      .select();

    if (userError) throw new Error(userError.message);

    const { data: carreraData, error: carreraError } = await this.supabaseService.client
      .from('carrera')
      .insert(carrera)
      .select();

    if (carreraError) throw new Error(carreraError.message);

    const { data: alumno_carreraData, error: alumno_carreraError } = await this.supabaseService.client
      .from('alumno_carrera')
      .insert(alumno_carrera)
      .select();

    if (alumno_carreraError) throw new Error(alumno_carreraError.message);

    return { user: userData, carrera: carreraData, alumno_carrera: alumno_carreraData };
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
