import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadosConvocatoria } from './entities/estados-convocatoria.entity';
import { CreateEstadosConvocatoriaDto } from './dto/create-estados-convocatoria.dto';
import { UpdateEstadosConvocatoriaDto } from './dto/update-estados-convocatoria.dto';

@Injectable()
export class EstadosConvocatoriasService {
  constructor(
    @InjectRepository(EstadosConvocatoria)
    private readonly estadosConvocatoriaRepository: Repository<EstadosConvocatoria>,
  ) {}

  create(createEstadosConvocatoriaDto: CreateEstadosConvocatoriaDto, usuarioId: number) {
    const nuevoEstado = this.estadosConvocatoriaRepository.create({
      ...createEstadosConvocatoriaDto,
      creadoPor: usuarioId,
    });
    return this.estadosConvocatoriaRepository.save(nuevoEstado);
  }

  findAll() {
    return this.estadosConvocatoriaRepository.find({ where: { estado: true } });
  }

  async findOne(id: number) {
    const estado = await this.estadosConvocatoriaRepository.findOneBy({
      id,
      estado: true,
    });
    if (!estado) {
      throw new NotFoundException(`No se encontró el estado de convocatoria con id ${id}`);
    }
    return estado;
  }

  async update(id: number, updateEstadosConvocatoriaDto: UpdateEstadosConvocatoriaDto, usuarioId: number) {
    await this.findOne(id);
    await this.estadosConvocatoriaRepository.update(id, {
      ...updateEstadosConvocatoriaDto,
      modificadoPor: usuarioId,
    });
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id);
    await this.estadosConvocatoriaRepository.update(id, {
      estado: false,
      modificadoPor: usuarioId,
    });
    return { message: 'Borrado exitoso' };
  }
}