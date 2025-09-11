import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SyllabusModule } from './syllabus/syllabus.module';
import { AdvanceModule } from './advance/advance.module';

@Module({
  imports: [AuthModule, SyllabusModule, AdvanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
