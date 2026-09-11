import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadosSolicitud } from './entities/estados-solicitude.entity';
import { CreateEstadosSolicitudeDto } from './dto/create-estados-solicitude.dto';
import { UpdateEstadosSolicitudeDto } from './dto/update-estados-solicitude.dto';

@Injectable()
export class EstadosSolicitudesService {
  constructor(
    @InjectRepository(EstadosSolicitud)
    private readonly estadosSolicitudRepository: Repository<EstadosSolicitud>,
  ) {}

  create(createEstadosSolicitudeDto: CreateEstadosSolicitudeDto, usuarioId: number) {
    const nuevoEstado = this.estadosSolicitudRepository.create({
      ...createEstadosSolicitudeDto,
      creadoPor: usuarioId,
    });
    return this.estadosSolicitudRepository.save(nuevoEstado);
  }

  findAll() {
    return this.estadosSolicitudRepository.find({ where: { estado: true } });
  }

  async findOne(id: number) {
    const estado = await this.estadosSolicitudRepository.findOneBy({
      id,
      estado: true,
    });
    if (!estado) {
      throw new NotFoundException(`No se encontro el estado de solicitud con id ${id}`);
    }
    return estado;
  }

  async update(id: number, updateEstadosSolicitudeDto: UpdateEstadosSolicitudeDto, usuarioId: number) {
    await this.findOne(id);
    await this.estadosSolicitudRepository.update(id, {
      ...updateEstadosSolicitudeDto,
      modificadoPor: usuarioId,
    });
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id);
    await this.estadosSolicitudRepository.update(id, {
      estado: false,
      modificadoPor: usuarioId,
    });
    return { message: 'Borrado exitoso' };
  }
}