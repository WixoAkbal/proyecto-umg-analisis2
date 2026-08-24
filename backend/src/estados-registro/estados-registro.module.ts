import { Module } from '@nestjs/common';
import { EstadosRegistroService } from './estados-registro.service';
import { EstadosRegistroController } from './estados-registro.controller';

@Module({
  controllers: [EstadosRegistroController],
  providers: [EstadosRegistroService],
})
export class EstadosRegistroModule {}
