import { Module } from '@nestjs/common';
import { GetAllService } from './get-all.service';
import { GetAllController } from './get-all.controller';
import { JwtModule } from '@nestjs/jwt';
import { PreramosRepository } from 'src/persistence/preramos.repository';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RamoService } from 'src/ramo/ramo.service';

@Module({
  imports: [
    JwtModule,
    PersistenceModule
  ],
  controllers: [GetAllController],
  providers: [
    GetAllService,
    PreramosRepository,
    PrismaService,
    RamoService
  ],
  exports: [
    GetAllService
  ]
})
export class GetAllModule {}
