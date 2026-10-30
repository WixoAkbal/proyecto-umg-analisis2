import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Autorizacion } from './entities/autorizacion.entity';
import { CreateAutorizacionDto } from './dto/create-autorizacion.dto';
import { Solicitud } from '../solicitudes/entities/solicitude.entity';
import { User } from '../user/entity/user.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';

export const LIMITE_SEGUNDA_APROBACION = 10000;

@Injectable()
export class AutorizacionesService {
  constructor(
    @InjectRepository(Autorizacion)
    private readonly autorizacionRepository: Repository<Autorizacion>,
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  private conEstado(a: Autorizacion) {
    const pendiente = a.requiereConfirmacion && !a.confirmadoPor;
    return { ...a, estadoAutorizacion: pendiente ? 'PENDIENTE_CONFIRMACION' : 'AUTORIZADA' };
  }

  async create(dto: CreateAutorizacionDto, usuarioId: number) {
    const solicitud = await this.solicitudRepository.findOneBy({ id: dto.solicitudId });
    if (!solicitud) {
      throw new NotFoundException(`No existe la solicitud ${dto.solicitudId}`);
    }

    const yaExiste = await this.autorizacionRepository.findOne({
      where: { solicitud: { id: dto.solicitudId }, estado: { nombre: Not('eliminado') } },
    });
    if (yaExiste) {
      throw new ConflictException('Esa solicitud ya tiene una autorización');
    }

    const usuario = await this.userRepository.findOneBy({ id: usuarioId });
    if (!usuario) {
      throw new NotFoundException('No se encontró al usuario que autoriza');
    }

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({ nombre: 'activo' });
    if (!estadoActivo) {
      throw new NotFoundException('No existe el estado "activo" en el catálogo');
    }

    const nueva = this.autorizacionRepository.create({
      solicitud,
      monto: dto.monto,
      requiereConfirmacion: dto.monto > LIMITE_SEGUNDA_APROBACION,
      autorizadoPor: usuario,
      comentario: dto.comentario ?? null,
      estado: estadoActivo,
      creadoPor: usuarioId,
    });
    const guardada = await this.autorizacionRepository.save(nueva);
    return this.conEstado(guardada);
  }

  async findAll() {
    const lista = await this.autorizacionRepository.find({
      where: { estado: { nombre: Not('eliminado') } },
      relations: { solicitud: true, autorizadoPor: true, confirmadoPor: true, estado: true },
      order: { id: 'DESC' },
    });
    return lista.map((a) => this.conEstado(a));
  }

  async findPendientes() {
    const lista = await this.autorizacionRepository.find({
      where: {
        requiereConfirmacion: true,
        confirmadoPor: IsNull(),
        estado: { nombre: Not('eliminado') },
      },
      relations: { solicitud: true, autorizadoPor: true, estado: true },
      order: { id: 'ASC' },
    });
    return lista.map((a) => this.conEstado(a));
  }

  async findOne(id: number) {
    const autorizacion = await this.autorizacionRepository.findOne({
      where: { id, estado: { nombre: Not('eliminado') } },
      relations: { solicitud: true, autorizadoPor: true, confirmadoPor: true, estado: true },
    });
    if (!autorizacion) {
      throw new NotFoundException(`No se encontró la autorización ${id}`);
    }
    return autorizacion;
  }

  async confirmar(id: number, usuarioId: number) {
    const autorizacion = await this.findOne(id);

    if (!autorizacion.requiereConfirmacion) {
      throw new BadRequestException('Esta autorización no necesita segunda aprobación');
    }
    if (autorizacion.confirmadoPor) {
      throw new BadRequestException('Esta autorización ya fue confirmada');
    }
    if (autorizacion.autorizadoPor.id === usuarioId) {
      throw new ForbiddenException('La segunda aprobación la debe hacer otra persona');
    }

    const usuario = await this.userRepository.findOneBy({ id: usuarioId });
    if (!usuario) {
      throw new NotFoundException('No se encontró al usuario que confirma');
    }

    autorizacion.confirmadoPor = usuario;
    autorizacion.fechaConfirmacion = new Date();
    autorizacion.modificadoPor = usuarioId;
    const guardada = await this.autorizacionRepository.save(autorizacion);
    return this.conEstado(guardada);
  }

  async remove(id: number, usuarioId: number) {
    const autorizacion = await this.findOne(id);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({ nombre: 'eliminado' });
    if (!estadoEliminado) {
      throw new NotFoundException('No existe el estado "eliminado" en el catalogo');
    }

    await this.autorizacionRepository.update(id, {
      estadoAnterior: { id: autorizacion.estado?.id ?? null } as EstadoRegistro,
      estado: estadoEliminado,
      modificadoPor: usuarioId,
    });
    return { message: 'Borrado exitoso' };
  }
}