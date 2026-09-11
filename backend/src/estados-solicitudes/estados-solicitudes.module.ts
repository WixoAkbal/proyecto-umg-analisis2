import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosSolicitudesService } from './estados-solicitudes.service';
import { EstadosSolicitudesController } from './estados-solicitudes.controller';
import { EstadosSolicitud } from './entities/estados-solicitude.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstadosSolicitud])],
  controllers: [EstadosSolicitudesController],
  providers: [EstadosSolicitudesService],
})
export class EstadosSolicitudesModule {}