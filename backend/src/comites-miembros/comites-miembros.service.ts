import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComitesMiembro } from './entities/comites-miembro.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateComitesMiembroDto } from './dto/create-comites-miembro.dto';

@Injectable()
export class ComitesMiembrosService {
  constructor(
    @InjectRepository(ComitesMiembro)
    private readonly comitesMiembroRepository: Repository<ComitesMiembro>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  async create(createComitesMiembroDto: CreateComitesMiembroDto, usuarioId: number) {
    const { comiteId, evaluadorId } = createComitesMiembroDto;

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException('No existe el estado "activo" en el catalogo');
    }

    const nuevoMiembro = this.comitesMiembroRepository.create({
      comiteId,
      evaluadorId,
      estado: estadoActivo,
      creadoPor: usuarioId,
    });
    return this.comitesMiembroRepository.save(nuevoMiembro);
  }

  findAll() {
    return this.comitesMiembroRepository.find({
      relations: { comite: true, evaluador: true, estado: true },
    });
  }

  async findOne(comiteId: number, evaluadorId: number) {
    const miembro = await this.comitesMiembroRepository.findOne({
      where: { comiteId, evaluadorId },
      relations: { comite: true, evaluador: true, estado: true },
    });
    if (!miembro) {
      throw new NotFoundException(
        `No se encontró el miembro (comité ${comiteId}, evaluador ${evaluadorId})`,
      );
    }
    return miembro;
  }

  async remove(comiteId: number, evaluadorId: number, usuarioId: number) {
    const miembro = await this.findOne(comiteId, evaluadorId);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({
      nombre: 'eliminado',
    });
    if (!estadoEliminado) {
      throw new NotFoundException('No existe el estado "eliminado" en el catalogo');
    }

    const estadoAnteriorId = miembro.estado?.id ?? null;

    await this.comitesMiembroRepository.update(
      { comiteId, evaluadorId },
      {
        estadoAnterior: { id: estadoAnteriorId },
        estado: estadoEliminado,
        modificadoPor: usuarioId,
      },
    );

    return { message: 'Borrado exitoso' };
  }
}