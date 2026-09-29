import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionesService } from './evaluaciones.service';
import { EvaluacionesController } from './evaluaciones.controller';
import { Evaluacion } from './entities/evaluacione.entity';
import { Solicitud } from '../solicitudes/entities/solicitude.entity';
import { Comite } from '../comites/entities/comite.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluacion, Solicitud, Comite, EstadoRegistro]),
  ],
  controllers: [EvaluacionesController],
  providers: [EvaluacionesService],
})
export class EvaluacionesModule {}