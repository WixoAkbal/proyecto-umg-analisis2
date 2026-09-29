import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { Notificacion } from './entities/notificacione.entity';
import { User } from '../user/entity/user.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion, User, EstadoRegistro])],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
})
export class NotificacionesModule {}