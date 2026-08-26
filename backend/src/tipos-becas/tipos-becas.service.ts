import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiposBeca } from './entities/tipos-beca.entity';
import { CreateTiposBecaDto } from './dto/create-tipos-beca.dto';
import { UpdateTiposBecaDto } from './dto/update-tipos-beca.dto';

@Injectable()
export class TiposBecasService {
  constructor(
    @InjectRepository(TiposBeca)
    private readonly tiposBecaRepository: Repository<TiposBeca>,
  ) {}

  create(createTiposBecaDto: CreateTiposBecaDto, usuarioId: number) {
    const nuevoTipoBeca = this.tiposBecaRepository.create({
      ...createTiposBecaDto,
      creadoPor: usuarioId,
    });
    return this.tiposBecaRepository.save(nuevoTipoBeca);
  }

  findAll() {
    return this.tiposBecaRepository.find({ where: { estado: true } });
  }

  async findOne(id: number) {
    const tipoBeca = await this.tiposBecaRepository.findOneBy({
      id,
      estado: true,
    });
    if (!tipoBeca) {
      throw new NotFoundException(`No se encontro el tipo de beca con id ${id}`);
    }
    return tipoBeca;
  }

  async update(id: number, updateTiposBecaDto: UpdateTiposBecaDto, usuarioId: number) {
    await this.findOne(id);
    await this.tiposBecaRepository.update(id, {
      ...updateTiposBecaDto,
      modificadoPor: usuarioId,
    });
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id);
    await this.tiposBecaRepository.update(id, {
      estado: false,
      modificadoPor: usuarioId,
    });
    return { message: 'Borrado exitoso' };
  }
}