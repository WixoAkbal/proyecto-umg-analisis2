import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Solicitud } from '../solicitudes/entities/solicitude.entity';
import { CreateDocumentoDto } from './dto/create-documento.dto';

export interface UsuarioToken {
  sub: number;
  roles?: string[];
}

const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  private async verificarAcceso(solicitudId: number, usuario: UsuarioToken) {
    const roles = (usuario.roles ?? []).map((r) => r.toUpperCase());
    if (roles.includes('ADMIN') || roles.includes('EVALUADOR')) return;

    const persona = await this.documentoRepository.manager.findOne(Persona, {
      where: {
        usuario: { id: usuario.sub },
        estado: { nombre: Not('eliminado') },
      },
    });
    const solicitud = await this.documentoRepository.manager.findOne(Solicitud, {
      where: { id: solicitudId, estado: { nombre: Not('eliminado') } },
      relations: { persona: true },
    });
    if (!persona || !solicitud || solicitud.persona?.id !== persona.id) {
      throw new ForbiddenException(
        'No tienes acceso a los documentos de esta solicitud',
      );
    }
  }

  async create(
    createDocumentoDto: CreateDocumentoDto,
    archivo: Express.Multer.File,
    usuario: UsuarioToken,
  ) {
    const { solicitudId, tipoDocumentoId } = createDocumentoDto;

    await this.verificarAcceso(solicitudId, usuario);

    const solicitud = await this.documentoRepository.manager.findOne(Solicitud, {
      where: { id: solicitudId, estado: { nombre: Not('eliminado') } },
    });
    if (!solicitud) {
      throw new NotFoundException(`No se encontro la solicitud con id ${solicitudId}`);
    }

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException('No existe el estado "activo" en el catalogo');
    }

    const tipoArchivo =
      archivo.originalname.split('.').pop()?.toLowerCase() ?? 'desconocido';

    const nuevoDocumento = this.documentoRepository.create({
      solicitud: { id: solicitudId },
      tipoDocumento: { id: tipoDocumentoId },
      nombre: archivo.originalname,
      tipoArchivo,
      archivo: archivo.buffer,
      estado: estadoActivo,
      creadoPor: usuario.sub,
    });

    const guardado = await this.documentoRepository.save(nuevoDocumento);
    const { archivo: _, ...respuestaSinArchivo } = guardado;
    return respuestaSinArchivo;
  }

  findAll() {
    return this.documentoRepository.find({
      where: { estado: { nombre: Not('eliminado') } },
      select: {
        id: true,
        nombre: true,
        tipoArchivo: true,
        comentarioRevision: true,
      },
      relations: { solicitud: true, tipoDocumento: true, estado: true },
    });
  }

  async findBySolicitud(solicitudId: number, usuario: UsuarioToken) {
    await this.verificarAcceso(solicitudId, usuario);
    return this.documentoRepository.find({
      where: {
        solicitud: { id: solicitudId },
        estado: { nombre: Not('eliminado') },
      },
      select: {
        id: true,
        nombre: true,
        tipoArchivo: true,
        comentarioRevision: true,
        fechaHoraCreado: true,
      },
      relations: { tipoDocumento: true, estado: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const documento = await this.documentoRepository.findOne({
      where: { id, estado: { nombre: Not('eliminado') } },
      select: {
        id: true,
        nombre: true,
        tipoArchivo: true,
        comentarioRevision: true,
      },
      relations: { solicitud: true, tipoDocumento: true, estado: true },
    });
    if (!documento) {
      throw new NotFoundException(`No se encontro el documento con id ${id}`);
    }
    return documento;
  }

  async obtenerArchivo(id: number, usuario: UsuarioToken) {
    const documento = await this.documentoRepository.findOne({
      where: { id, estado: { nombre: Not('eliminado') } },
      select: { id: true, nombre: true, tipoArchivo: true, archivo: true },
      relations: { solicitud: true },
    });
    if (!documento) {
      throw new NotFoundException(`No se encontro el documento con id ${id}`);
    }
    await this.verificarAcceso(documento.solicitud.id, usuario);

    return {
      nombre: documento.nombre,
      mime: MIME[documento.tipoArchivo] ?? 'application/octet-stream',
      archivo: documento.archivo,
    };
  }

  async remove(id: number, usuario: UsuarioToken) {
    const documento = await this.findOne(id);
    await this.verificarAcceso(documento.solicitud.id, usuario);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({
      nombre: 'eliminado',
    });
    if (!estadoEliminado) {
      throw new NotFoundException('No existe el estado "eliminado" en el catalogo');
    }

    const estadoAnteriorId = documento.estado?.id ?? null;

    await this.documentoRepository.update(id, {
      estadoAnterior: { id: estadoAnteriorId },
      estado: estadoEliminado,
      modificadoPor: usuario.sub,
    });

    return { message: 'Borrado exitoso' };
  }
}