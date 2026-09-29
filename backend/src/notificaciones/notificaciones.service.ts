import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacione.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  async create(createNotificacioneDto: CreateNotificacioneDto, usuarioId: number) {
    const { usuarioId: destinatarioId, mensaje } = createNotificacioneDto;

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException('No existe el estado "activo" en el catalogo');
    }

    const nuevaNotificacion = this.notificacionRepository.create({
      mensaje,
      usuario: { id: destinatarioId },
      estado: estadoActivo,
      creadoPor: usuarioId,
    });
    return this.notificacionRepository.save(nuevaNotificacion);
  }

  findAllByUsuario(usuarioId: number) {
    return this.notificacionRepository.find({
      where: { usuario: { id: usuarioId }, estado: { id: 1 } },
      relations: { estado: true },
    });
  }

  async findOne(id: number) {
    const notificacion = await this.notificacionRepository.findOne({
      where: { id },
      relations: { estado: true },
    });
    if (!notificacion) {
      throw new NotFoundException(`No se encontro la notificación con id ${id}`);
    }
    return notificacion;
  }

  async marcarLeida(id: number, usuarioId: number) {
    await this.findOne(id);
    await this.notificacionRepository.update(id, {
      leida: true,
      modificadoPor: usuarioId,
    });
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    const notificacion = await this.findOne(id);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({
      nombre: 'eliminado',
    });
    if (!estadoEliminado) {
      throw new NotFoundException('No existe el estado "eliminado" en el catalogo');
    }

    const estadoAnteriorId = notificacion.estado?.id ?? null;

    await this.notificacionRepository.update(id, {
      estadoAnterior: { id: estadoAnteriorId },
      estado: estadoEliminado,
      modificadoPor: usuarioId,
    });

    return { message: 'Borrado exitoso' };
  }
}