import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComitesMiembrosService } from './comites-miembros.service';
import { ComitesMiembrosController } from './comites-miembros.controller';
import { ComitesMiembro } from './entities/comites-miembro.entity';
import { Comite } from '../comites/entities/comite.entity';
import { User } from '../user/entity/user.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComitesMiembro, Comite, User, EstadoRegistro]),
  ],
  controllers: [ComitesMiembrosController],
  providers: [ComitesMiembrosService],
})
export class ComitesMiembrosModule {}