// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SyllabusModule } from 'src/syllabus/syllabus.module';
import { AdvanceModule } from 'src/advance/advance.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    SyllabusModule,
    AdvanceModule
  ], // <-- importante
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService
  ],
  exports: [UsersService]
})
export class UsersModule {}