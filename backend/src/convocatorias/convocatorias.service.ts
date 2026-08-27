import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Convocatoria } from './entities/convocatoria.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';

@Injectable()
export class ConvocatoriasService {
  constructor(
    @InjectRepository(Convocatoria)
    private readonly convocatoriaRepository: Repository<Convocatoria>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  async create(
    createConvocatoriaDto: CreateConvocatoriaDto,
    usuarioId: number,
  ) {
    const { tipoBecaId, estadoConvocatoriaId, ...datos } =
      createConvocatoriaDto;

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException(
        'No existe el estado "activo" en el catalogo',
      );
    }

    const nuevaConvocatoria = this.convocatoriaRepository.create({
      ...datos,
      tipoBeca: { id: tipoBecaId },
      estadoConvocatoria: { id: estadoConvocatoriaId },
      estado: estadoActivo,
      creadoPor: usuarioId,
    });
    return this.convocatoriaRepository.save(nuevaConvocatoria);
  }

  findAll() {
    return this.convocatoriaRepository.find({
      relations: {
        tipoBeca: true,
        estadoConvocatoria: true,
        estado: true,
      },
    });
  }

  async findOne(id: number) {
    const convocatoria = await this.convocatoriaRepository.findOne({
      where: { id },
      relations: {
        tipoBeca: true,
        estadoConvocatoria: true,
        estado: true,
      },
    });
    if (!convocatoria) {
      throw new NotFoundException(
        `No se encontro la convocatoria con id ${id}`,
      );
    }
    return convocatoria;
  }

  async update(
    id: number,
    updateConvocatoriaDto: UpdateConvocatoriaDto,
    usuarioId: number,
  ) {
    await this.findOne(id);
    const { tipoBecaId, estadoConvocatoriaId, ...datos } =
      updateConvocatoriaDto;

    const cambios: any = { ...datos, modificadoPor: usuarioId };
    if (tipoBecaId) cambios.tipoBeca = { id: tipoBecaId };
    if (estadoConvocatoriaId)
      cambios.estadoConvocatoria = { id: estadoConvocatoriaId };

    await this.convocatoriaRepository.save({ id, ...cambios });
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    const convocatoria = await this.findOne(id);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({
      nombre: 'eliminado',
    });
    if (!estadoEliminado) {
      throw new NotFoundException(
        'No existe el estado "eliminado" en el catalogo',
      );
    }

    const estadoAnteriorId = convocatoria.estado?.id ?? null;

    await this.convocatoriaRepository.update(id, {
      estadoAnterior: { id: estadoAnteriorId },
      estado: estadoEliminado,
      modificadoPor: usuarioId,
    });

    return { message: 'Borrado exitoso' };
  }
}
