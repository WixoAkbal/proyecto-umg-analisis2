import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComitesService } from './comites.service';
import { ComitesController } from './comites.controller';
import { Comite } from './entities/comite.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comite, EstadoRegistro])],
  controllers: [ComitesController],
  providers: [ComitesService],
})
export class ComitesModule {}