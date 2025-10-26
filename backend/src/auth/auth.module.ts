import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProcesadorModule } from './auth.procesador.module';
import { SyllabusModule } from '../syllabus/syllabus.module';
import { AdvanceModule } from '../advance/advance.module';
import { UsersModule } from 'src/users/users.module';
import { AdminModule } from 'src/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { PlanificationModule } from 'src/planification/planification.module';

@Module({
  imports: [
    HttpModule,
    ProcesadorModule,
    SyllabusModule, 
    AdvanceModule,
    UsersModule,
    AdminModule,
    PlanificationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // aquí pones tu clave secreta
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
