import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comite } from './entities/comite.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateComiteDto } from './dto/create-comite.dto';
import { UpdateComiteDto } from './dto/update-comite.dto';

@Injectable()
export class ComitesService {
  constructor(
    @InjectRepository(Comite)
    private readonly comiteRepository: Repository<Comite>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  async create(createComiteDto: CreateComiteDto, usuarioId: number) {
    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException('No existe el estado "activo" en el catalogo');
    }

    const nuevoComite = this.comiteRepository.create({
      ...createComiteDto,
      estado: estadoActivo,
      creadoPor: usuarioId,
    });
    return this.comiteRepository.save(nuevoComite);
  }

  findAll() {
    return this.comiteRepository.find({
      relations: { estado: true },
    });
  }

  async findOne(id: number) {
    const comite = await this.comiteRepository.findOne({
      where: { id },
      relations: { estado: true },
    });
    if (!comite) {
      throw new NotFoundException(`No se encontro el comite con id ${id}`);
    }
    return comite;
  }

  async update(id: number, updateComiteDto: UpdateComiteDto, usuarioId: number) {
    await this.findOne(id);
    await this.comiteRepository.update(id, {
      ...updateComiteDto,
      modificadoPor: usuarioId,
    });
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    const comite = await this.findOne(id);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({
      nombre: 'eliminado',
    });
    if (!estadoEliminado) {
      throw new NotFoundException('No existe el estado "eliminado" en el catalogo');
    }

    const estadoAnteriorId = comite.estado?.id ?? null;

    await this.comiteRepository.update(id, {
      estadoAnterior: { id: estadoAnteriorId },
      estado: estadoEliminado,
      modificadoPor: usuarioId,
    });

    return { message: 'Borrado exitoso' };
  }
}