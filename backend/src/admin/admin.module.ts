import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllService } from 'src/get-all/get-all.service';
import { RamoRepository } from 'src/persistence/ramo.repository';
import { PersistenceModule } from 'src/persistence/persistence.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PersistenceModule
  ],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, GetAllService, RamoRepository],
  exports: [AdminService],
})
export class AdminModule {}
