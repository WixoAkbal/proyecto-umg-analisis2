import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialEstado } from './entities/historial-estado.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateHistorialEstadoDto } from './dto/create-historial-estado.dto';

@Injectable()
export class HistorialEstadosService {
  constructor(
    @InjectRepository(HistorialEstado)
    private readonly historialRepository: Repository<HistorialEstado>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  async create(createHistorialEstadoDto: CreateHistorialEstadoDto, usuarioId: number) {
    const {
      solicitudId,
      estadoAnteriorSolicitudId,
      estadoNuevoSolicitudId,
      comentario,
    } = createHistorialEstadoDto;

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException('No existe el estado "activo" en el catalogo');
    }

    const nuevoRegistro = this.historialRepository.create({
      comentario,
      solicitud: { id: solicitudId },
      estadoAnteriorSolicitud: estadoAnteriorSolicitudId
        ? { id: estadoAnteriorSolicitudId }
        : undefined,
      estadoNuevoSolicitud: { id: estadoNuevoSolicitudId },
      usuario: { id: usuarioId },
      estado: estadoActivo,
      creadoPor: usuarioId,
    });
    return this.historialRepository.save(nuevoRegistro);
  }

  findBySolicitud(solicitudId: number) {
    return this.historialRepository.find({
      where: { solicitud: { id: solicitudId } },
      relations: {
        estadoAnteriorSolicitud: true,
        estadoNuevoSolicitud: true,
        estado: true,
      },
      order: { fechaHoraCreado: 'ASC' },
    });
  }

  async findOne(id: number) {
    const registro = await this.historialRepository.findOne({
      where: { id },
      relations: {
        solicitud: true,
        estadoAnteriorSolicitud: true,
        estadoNuevoSolicitud: true,
        estado: true,
      },
    });
    if (!registro) {
      throw new NotFoundException(`No se encontro el registro de historial con id ${id}`);
    }
    return registro;
  }
}