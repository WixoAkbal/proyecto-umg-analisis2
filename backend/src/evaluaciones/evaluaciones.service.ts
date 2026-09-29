import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from './entities/evaluacione.entity';
import { EstadoRegistro } from '../estados-registro/entities/estados-registro.entity';
import { CreateEvaluacioneDto } from './dto/create-evaluacione.dto';
import { UpdateEvaluacioneDto } from './dto/update-evaluacione.dto';

@Injectable()
export class EvaluacionesService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepository: Repository<Evaluacion>,
    @InjectRepository(EstadoRegistro)
    private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
  ) {}

  async create(createEvaluacioneDto: CreateEvaluacioneDto, usuarioId: number) {
    const { solicitudId, comiteId, ...datos } = createEvaluacioneDto;

    const estadoActivo = await this.estadoRegistroRepository.findOneBy({
      nombre: 'activo',
    });
    if (!estadoActivo) {
      throw new NotFoundException('No existe el estado "activo" en el catalogo');
    }

    const nuevaEvaluacion = this.evaluacionRepository.create({
      ...datos,
      solicitud: { id: solicitudId },
      comite: { id: comiteId },
      estado: estadoActivo,
      creadoPor: usuarioId,
    });
    return this.evaluacionRepository.save(nuevaEvaluacion);
  }

  findAll() {
    return this.evaluacionRepository.find({
      relations: { solicitud: true, comite: true, estado: true },
    });
  }

  async findOne(id: number) {
    const evaluacion = await this.evaluacionRepository.findOne({
      where: { id },
      relations: { solicitud: true, comite: true, estado: true },
    });
    if (!evaluacion) {
      throw new NotFoundException(`No se encontró la evaluacion con id ${id}`);
    }
    return evaluacion;
  }

  async update(id: number, updateEvaluacioneDto: UpdateEvaluacioneDto, usuarioId: number) {
    await this.findOne(id);
    const { solicitudId, comiteId, ...datos } = updateEvaluacioneDto;

    const cambios: any = { ...datos, modificadoPor: usuarioId };
    if (solicitudId) cambios.solicitud = { id: solicitudId };
    if (comiteId) cambios.comite = { id: comiteId };

    await this.evaluacionRepository.update(id, cambios);
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    const evaluacion = await this.findOne(id);

    const estadoEliminado = await this.estadoRegistroRepository.findOneBy({
      nombre: 'eliminado',
    });
    if (!estadoEliminado) {
      throw new NotFoundException('No existe el estado "eliminado" en el catalogo');
    }

    const estadoAnteriorId = evaluacion.estado?.id ?? null;

    await this.evaluacionRepository.update(id, {
      estadoAnterior: { id: estadoAnteriorId },
      estado: estadoEliminado,
      modificadoPor: usuarioId,
    });

    return { message: 'Borrado exitoso' };
  }
}