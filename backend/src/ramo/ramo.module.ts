import { Module } from '@nestjs/common';
import { RamoService } from './ramo.service';
import { RamoController } from './ramo.controller';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { GetAllModule } from 'src/get-all/get-all.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PersistenceModule, GetAllModule, JwtModule],
  controllers: [RamoController],
  providers: [RamoService],
})
export class RamoModule {}
