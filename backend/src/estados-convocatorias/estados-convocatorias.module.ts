import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosConvocatoriasService } from './estados-convocatorias.service';
import { EstadosConvocatoriasController } from './estados-convocatorias.controller';
import { EstadosConvocatoria } from './entities/estados-convocatoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstadosConvocatoria])],
  controllers: [EstadosConvocatoriasController],
  providers: [EstadosConvocatoriasService],
})
export class EstadosConvocatoriasModule {}