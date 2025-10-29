import { Module } from '@nestjs/common';
import { GetAllService } from './get-all.service';
import { GetAllController } from './get-all.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule
  ],
  controllers: [GetAllController],
  providers: [
    GetAllService,
    PrismaService
  ],
  exports: [
    GetAllService
  ]
})
export class GetAllModule {}
