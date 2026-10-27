import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorizacionesService } from './autorizaciones.service';
import { AutorizacionesController } from './autorizaciones.controller';
import { Autorizacion } from './entities/autorizacion.entity';
import { Solicitud } from '../solicitudes/entities/solicitude.entity';
import { User } from '../user/entity/user.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Autorizacion, Solicitud, User, EstadoRegistro])],
  controllers: [AutorizacionesController],
  providers: [AutorizacionesService],
})
export class AutorizacionesModule {}