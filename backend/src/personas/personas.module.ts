import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasService } from './personas.service';
import { PersonasController } from './personas.controller';
import { Persona } from './entities/persona.entity';
import { User } from '../user/entity/user.entity';
import { NivelesAcademico } from '../niveles-academicos/entities/niveles-academico.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona, User, NivelesAcademico, EstadoRegistro]),
  ],
  controllers: [PersonasController],
  providers: [PersonasService],
})
export class PersonasModule {}