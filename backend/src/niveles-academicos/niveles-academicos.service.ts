import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NivelesAcademico } from './entities/niveles-academico.entity';
import { CreateNivelesAcademicoDto } from './dto/create-niveles-academico.dto';
import { UpdateNivelesAcademicoDto } from './dto/update-niveles-academico.dto';

@Injectable()
export class NivelesAcademicosService {
  constructor(
    @InjectRepository(NivelesAcademico)
    private readonly nivelesAcademicoRepository: Repository<NivelesAcademico>,
  ) {}

  create(createNivelesAcademicoDto: CreateNivelesAcademicoDto, usuarioId: number) {
    const nuevoNivel = this.nivelesAcademicoRepository.create({
      ...createNivelesAcademicoDto,
      creadoPor: usuarioId,
    });
    return this.nivelesAcademicoRepository.save(nuevoNivel);
  }

  findAll() {
    return this.nivelesAcademicoRepository.find({ where: { estado: true } });
  }

  async findOne(id: number) {
    const nivel = await this.nivelesAcademicoRepository.findOneBy({
      id,
      estado: true,
    });
    if (!nivel) {
      throw new NotFoundException(`No se encontro el nivel academico con id ${id}`);
    }
    return nivel;
  }

  async update(id: number, updateNivelesAcademicoDto: UpdateNivelesAcademicoDto, usuarioId: number) {
    await this.findOne(id);
    await this.nivelesAcademicoRepository.update(id, {
      ...updateNivelesAcademicoDto,
      modificadoPor: usuarioId,
    });
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id);
    await this.nivelesAcademicoRepository.update(id, {
      estado: false,
      modificadoPor: usuarioId,
    });
    return { message: 'Borrado exitoso' };
  }
}