import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposBecasService } from './tipos-becas.service';
import { TiposBecasController } from './tipos-becas.controller';
import { TiposBeca } from './entities/tipos-beca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiposBeca])],
  controllers: [TiposBecasController],
  providers: [TiposBecasService],
})
export class TiposBecasModule {}