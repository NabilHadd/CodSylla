import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SyllabusModule } from './syllabus/syllabus.module';
import { AdvanceModule } from './advance/advance.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './admin/admin.module';
import { PlanificationModule } from './planification/planification.module';
import { GetAllModule } from './get-all/get-all.module';
import { HistorialModule } from './historial/historial.module';
import { RamoModule } from './ramo/ramo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    SyllabusModule,
    AdvanceModule,
    UsersModule,
    AdminModule,
    PlanificationModule,
    GetAllModule,
    HistorialModule,
    RamoModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
