import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateDocumentoDto } from './dto/create-documento.dto';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  async create(
    createDocumentoDto: CreateDocumentoDto,
    archivo: Express.Multer.File,
    usuarioId: number,
  ) {
    const { solicitudId, tipoDocumentoId } = createDocumentoDto;

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException('No existe el estado "activo" en el catalogo');
    }

    const tipoArchivo = archivo.originalname.split('.').pop() ?? 'desconocido';

    const nuevoDocumento = this.documentoRepository.create({
      solicitud: { id: solicitudId },
      tipoDocumento: { id: tipoDocumentoId },
      nombre: archivo.originalname,
      tipoArchivo,
      archivo: archivo.buffer,
      estado: estadoActivo,
      creadoPor: usuarioId,
    });

    const guardado = await this.documentoRepository.save(nuevoDocumento);
    const { archivo: _, ...respuestaSinArchivo } = guardado;
    return respuestaSinArchivo;
  }

  findAll() {
    return this.documentoRepository.find({
      select: {
        id: true,
        nombre: true,
        tipoArchivo: true,
        comentarioRevision: true,
      },
      relations: { solicitud: true, tipoDocumento: true, estado: true },
    });
  }

  async findOne(id: number) {
    const documento = await this.documentoRepository.findOne({
      where: { id },
      relations: { solicitud: true, tipoDocumento: true, estado: true },
    });
    if (!documento) {
      throw new NotFoundException(`No se encontro el documento con id ${id}`);
    }
    return documento;
  }

  async remove(id: number, usuarioId: number) {
    const documento = await this.findOne(id);

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
      modificadoPor: usuarioId,
    });

    return { message: 'Borrado exitoso' };
  }
}