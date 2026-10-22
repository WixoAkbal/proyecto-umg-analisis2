import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Persona } from '../personas/entities/persona.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { Solicitud } from './entities/solicitude.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateSolicitudeDto } from './dto/create-solicitude.dto';
import { UpdateSolicitudeDto } from './dto/update-solicitude.dto';
import { HistorialEstadosService } from '../historial-estados/historial-estados.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

const ESTADO_PENDIENTE = 1;
const ESTADO_EN_EVALUACION = 2;
const ESTADO_CANCELADA = 5;

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
      where: { estado: { nombre: Not('eliminado') } },
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
      where: { id, estado: { nombre: Not('eliminado') } },
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
    private async personaDelUsuario(usuarioId: number) {
    const persona = await this.solicitudRepository.manager.findOne(Persona, {
      where: {
        usuario: { id: usuarioId },
        estado: { nombre: Not('eliminado') },
      },
    });
    if (!persona) {
      throw new NotFoundException(
        'Tu usuario no tiene un perfil de persona registrado',
      );
    }
    return persona;
  }

  async findByUsuario(usuarioId: number) {
    const persona = await this.personaDelUsuario(usuarioId);
    return this.solicitudRepository.find({
      where: {
        persona: { id: persona.id },
        estado: { nombre: Not('eliminado') },
      },
      relations: { convocatoria: true, estadoSolicitud: true },
      order: { id: 'DESC' },
    });
  }

  async crearPropia(convocatoriaId: number, usuarioId: number) {
    const persona = await this.personaDelUsuario(usuarioId);

    const convocatoria = await this.solicitudRepository.manager.findOne(
      Convocatoria,
      {
        where: { id: convocatoriaId, estado: { nombre: Not('eliminado') } },
        relations: { estadoConvocatoria: true },
      },
    );
    if (!convocatoria) {
      throw new NotFoundException(
        `No se encontro la convocatoria con id ${convocatoriaId}`,
      );
    }
    if (convocatoria.estadoConvocatoria?.nombre?.toLowerCase() !== 'activa') {
      throw new BadRequestException('La convocatoria no esta activa');
    }

    const yaExiste = await this.solicitudRepository.findOne({
      where: {
        persona: { id: persona.id },
        convocatoria: { id: convocatoriaId },
        estado: { nombre: Not('eliminado') },
        estadoSolicitud: { id: Not(ESTADO_CANCELADA) },
      },
    });
    if (yaExiste) {
      throw new BadRequestException(
        'Ya tienes una solicitud en esta convocatoria',
      );
    }

    return this.create(
      {
        personaId: persona.id,
        convocatoriaId,
        estadoSolicitudId: ESTADO_PENDIENTE,
      },
      usuarioId,
    );
  }

  async cancelarPropia(id: number, usuarioId: number) {
    const persona = await this.personaDelUsuario(usuarioId);
    const solicitud = await this.findOne(id);

    if (solicitud.persona?.id !== persona.id) {
      throw new ForbiddenException('Esta solicitud no te pertenece');
    }

    const estadoActual = solicitud.estadoSolicitud?.id;
    if (estadoActual !== ESTADO_PENDIENTE && estadoActual !== ESTADO_EN_EVALUACION) {
      throw new BadRequestException(
        'Solo se puede cancelar una solicitud pendiente o en evaluacion',
      );
    }

    return this.update(id, { estadoSolicitudId: ESTADO_CANCELADA }, usuarioId);
  }

    async resumen() {
    const solicitudes = await this.solicitudRepository.find({
      where: { estado: { nombre: Not('eliminado') } },
      relations: { convocatoria: true, estadoSolicitud: true, estado: true },
      select: {
        id: true,
        convocatoria: { id: true, nombre: true },
        estadoSolicitud: { id: true, nombre: true },
        estado: { id: true },
      },
    });

    const porEstado = new Map<
      number,
      { estadoId: number; estado: string; total: number }
    >();
    const porConvocatoria = new Map<
      number,
      {
        convocatoriaId: number;
        convocatoria: string;
        total: number;
        porEstado: Record<number, number>;
      }
    >();

    for (const s of solicitudes) {
      const estadoId = s.estadoSolicitud?.id;
      const convocatoriaId = s.convocatoria?.id;
      if (estadoId === undefined || convocatoriaId === undefined) continue;

      const e = porEstado.get(estadoId) ?? {
        estadoId,
        estado: s.estadoSolicitud.nombre,
        total: 0,
      };
      e.total += 1;
      porEstado.set(estadoId, e);

      const c = porConvocatoria.get(convocatoriaId) ?? {
        convocatoriaId,
        convocatoria: s.convocatoria.nombre,
        total: 0,
        porEstado: {} as Record<number, number>,
      };
      c.total += 1;
      c.porEstado[estadoId] = (c.porEstado[estadoId] ?? 0) + 1;
      porConvocatoria.set(convocatoriaId, c);
    }

    return {
      total: solicitudes.length,
      porEstado: [...porEstado.values()],
      porConvocatoria: [...porConvocatoria.values()],
    };
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
