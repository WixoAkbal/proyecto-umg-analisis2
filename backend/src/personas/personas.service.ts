import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { NivelesAcademico } from '../niveles-academicos/entities/niveles-academico.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
    @InjectRepository(NivelesAcademico)
    private readonly nivelAcademicoRepository: Repository<NivelesAcademico>,
  ) {}


  async create(createPersonaDto: CreatePersonaDto, usuarioIdCreador: number) {
    const { nivelAcademicoId, usuarioId, ...datos } = createPersonaDto;

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException(
        'No existe el estado "activo" en el catalogo',
      );
    }

    const nivel = await this.nivelAcademicoRepository.findOneBy({
      id: nivelAcademicoId,
    });
    if (!nivel) {
      throw new NotFoundException(
        `No existe el nivel academico con id ${nivelAcademicoId}`,
      );
    }

    const nuevaPersona = this.personaRepository.create({
      ...datos,
      nivelAcademico: nivel,
      usuario: { id: usuarioId },
      estado: estadoActivo,
      creadoPor: usuarioIdCreador,
    });
    return this.personaRepository.save(nuevaPersona);
  }

  findAll() {
    return this.personaRepository.find({
      relations: {
        nivelAcademico: true,
        usuario: true,
        estado: true,
      },
    });
  }

  async findOne(id: number) {
    const persona = await this.personaRepository.findOne({
      where: { id },
      relations: {
        nivelAcademico: true,
        usuario: true,
        estado: true,
      },
    });
    if (!persona) {
      throw new NotFoundException(`No se encontro la persona con id ${id}`);
    }
    return persona;
  }

  async update(
    id: number,
    updatePersonaDto: UpdatePersonaDto,
    usuarioId: number,
  ) {
    await this.findOne(id);
    const {
      nivelAcademicoId,
      usuarioId: nuevoUsuarioId,
      ...datos
    } = updatePersonaDto;

    const cambios: any = { ...datos, modificadoPor: usuarioId };

    if (nivelAcademicoId) {
      const nivel = await this.nivelAcademicoRepository.findOneBy({
        id: nivelAcademicoId,
      });
      if (!nivel) {
        throw new NotFoundException(
          `No existe el nivel academico con id ${nivelAcademicoId}`,
        );
      }
      cambios.nivelAcademico = nivel;
    }

    if (nuevoUsuarioId) {
      cambios.usuario = { id: nuevoUsuarioId };
    }

    await this.personaRepository.update(id, cambios);
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    const persona = await this.findOne(id);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({
      nombre: 'eliminado',
    });
    if (!estadoEliminado) {
      throw new NotFoundException(
        'No existe el estado "eliminado" en el catalogo',
      );
    }

    const estadoAnteriorId = persona.estado?.id ?? null;

    await this.personaRepository.update(id, {
      estadoAnterior: { id: estadoAnteriorId },
      estado: estadoEliminado,
      modificadoPor: usuarioId,
    });

    return { message: 'Borrado exitoso' };
  }
}
