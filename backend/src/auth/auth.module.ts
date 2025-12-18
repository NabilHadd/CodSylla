import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SyllabusModule } from '../syllabus/syllabus.module';
import { AdvanceModule } from '../advance/advance.module';
import { UsersModule } from 'src/users/users.module';
import { AdminModule } from 'src/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { PlanificationModule } from 'src/planification/planification.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    HttpModule,
    SyllabusModule, 
    AdvanceModule,
    UsersModule,
    AdminModule,
    PlanificationModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule]
})
export class AuthModule {}
