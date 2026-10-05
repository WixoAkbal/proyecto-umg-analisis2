import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './entities/solicitude.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateSolicitudeDto } from './dto/create-solicitude.dto';
import { UpdateSolicitudeDto } from './dto/update-solicitude.dto';
import { HistorialEstadosService } from '../historial-estados/historial-estados.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
    private readonly historialEstadosService: HistorialEstadosService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async create(createSolicitudeDto: CreateSolicitudeDto, usuarioId: number) {
    const { personaId, convocatoriaId, comiteId, estadoSolicitudId } =
      createSolicitudeDto;

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException(
        'No existe el estado "activo" en el catalogo',
      );
    }

    const nuevaSolicitud = this.solicitudRepository.create({
      persona: { id: personaId },
      convocatoria: { id: convocatoriaId },
      estadoSolicitud: { id: estadoSolicitudId },
      comite: comiteId ? { id: comiteId } : undefined,
      estado: estadoActivo,
      creadoPor: usuarioId,
    });
    return this.solicitudRepository.save(nuevaSolicitud);
  }

  findAll() {
    return this.solicitudRepository.find({
      relations: {
        persona: true,
        convocatoria: true,
        comite: true,
        estadoSolicitud: true,
        estado: true,
      },
    });
  }

  async findOne(id: number) {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id },
      relations: {
        persona: true,
        convocatoria: true,
        comite: true,
        estadoSolicitud: true,
        estado: true,
      },
    });
    if (!solicitud) {
      throw new NotFoundException(`No se encontro la solicitud con id ${id}`);
    }
    return solicitud;
  }

  async update(
    id: number,
    updateSolicitudeDto: UpdateSolicitudeDto,
    usuarioId: number,
  ) {
    const solicitudActual = await this.findOne(id);
    const estadoAnteriorId = solicitudActual.estadoSolicitud?.id;
    const { personaId, convocatoriaId, comiteId, estadoSolicitudId } =
      updateSolicitudeDto;

    const cambios: any = { modificadoPor: usuarioId };
    if (personaId) cambios.persona = { id: personaId };
    if (convocatoriaId) cambios.convocatoria = { id: convocatoriaId };
    if (comiteId) cambios.comite = { id: comiteId };
    if (estadoSolicitudId) cambios.estadoSolicitud = { id: estadoSolicitudId };

    await this.solicitudRepository.update(id, cambios);

    const solicitudActualizada = await this.findOne(id);

    if (estadoSolicitudId && estadoSolicitudId !== estadoAnteriorId) {
      await this.historialEstadosService.create(
        {
          solicitudId: id,
          estadoAnteriorSolicitudId: estadoAnteriorId,
          estadoNuevoSolicitudId: estadoSolicitudId,
          comentario: 'Cambio de estado registrado automáticamente',
        },
        usuarioId,
      );

      const conUsuario = await this.solicitudRepository.findOne({
        where: { id },
        relations: { persona: { usuario: true } },
        select: { id: true, persona: { id: true, usuario: { id: true } } },
      });
      const destinatarioId = conUsuario?.persona?.usuario?.id;

      if (destinatarioId) {
        await this.notificacionesService.create(
          {
            usuarioId: destinatarioId,
            mensaje: `Tu solicitud cambió a estado: ${solicitudActualizada.estadoSolicitud.nombre}`,
          },
          usuarioId,
        );
      }
    }

    return solicitudActualizada;
  }

  async remove(id: number, usuarioId: number) {
    const solicitud = await this.findOne(id);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({
      nombre: 'eliminado',
    });
    if (!estadoEliminado) {
      throw new NotFoundException(
        'No existe el estado "eliminado" en el catalogo',
      );
    }

    const estadoAnteriorId = solicitud.estado?.id ?? null;

    await this.solicitudRepository.update(id, {
      estadoAnterior: { id: estadoAnteriorId },
      estado: estadoEliminado,
      modificadoPor: usuarioId,
    });

    return { message: 'Borrado exitoso' };
  }
}
