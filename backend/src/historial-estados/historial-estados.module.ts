import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialEstadosService } from './historial-estados.service';
import { HistorialEstadosController } from './historial-estados.controller';
import { HistorialEstado } from './entities/historial-estado.entity';
import { Solicitud } from '../solicitudes/entities/solicitude.entity';
import { EstadosSolicitud } from '../estados-solicitudes/entities/estados-solicitude.entity';
import { User } from '../user/entity/user.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistorialEstado,
      Solicitud,
      EstadosSolicitud,
      User,
      EstadoRegistro,
    ]),
  ],
  controllers: [HistorialEstadosController],
  providers: [HistorialEstadosService],
  exports: [HistorialEstadosService],
})
export class HistorialEstadosModule {}