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

    async create(user: { rut: string; email: string; rol: string}) {
        const { data, error } = await this.supabaseService.client
            .from('usuario')
            .insert(user)
            .select();
        if (error) throw new Error(error.message);
        return data;
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
}
