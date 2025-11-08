import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllService } from 'src/get-all/get-all.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, GetAllService],
  exports: [AdminService],
})
export class AdminModule {}
