import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvocatoriasService } from './convocatorias.service';
import { ConvocatoriasController } from './convocatorias.controller';
import { Convocatoria } from './entities/convocatoria.entity';
import { TiposBeca } from '../tipos-becas/entities/tipos-beca.entity';
import { EstadosConvocatoria } from '../estados-convocatorias/entities/estados-convocatoria.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Convocatoria,
      TiposBeca,
      EstadosConvocatoria,
      EstadoRegistro,
    ]),
  ],
  controllers: [ConvocatoriasController],
  providers: [ConvocatoriasService],
})
export class ConvocatoriasModule {}