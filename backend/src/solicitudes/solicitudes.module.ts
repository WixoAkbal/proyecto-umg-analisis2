import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { Solicitud } from './entities/solicitude.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { Comite } from '../comites/entities/comite.entity';
import { EstadosSolicitud } from '../estados-solicitudes/entities/estados-solicitude.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Solicitud,
      Persona,
      Convocatoria,
      Comite,
      EstadosSolicitud,
      EstadoRegistro,
    ]),
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}