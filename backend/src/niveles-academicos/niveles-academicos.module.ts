import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelesAcademicosService } from './niveles-academicos.service';
import { NivelesAcademicosController } from './niveles-academicos.controller';
import { NivelesAcademico } from './entities/niveles-academico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NivelesAcademico])],
  controllers: [NivelesAcademicosController],
  providers: [NivelesAcademicosService],
})
export class NivelesAcademicosModule {}