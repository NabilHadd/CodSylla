// supabase.module.ts
import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [], // importa ConfigModule si no es global
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}