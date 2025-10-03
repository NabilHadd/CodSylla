// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SupabaseModule } from '../supabase/supabase.module'; // importa el módulo
import { SyllabusModule } from 'src/syllabus/syllabus.module';
import { AdvanceModule } from 'src/advance/advance.module';

@Module({
  imports: [
    SupabaseModule,
    SyllabusModule,
    AdvanceModule
  ], // <-- importante
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}