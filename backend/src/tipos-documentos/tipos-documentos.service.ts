import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiposDocumento } from './entities/tipos-documento.entity';
import { CreateTiposDocumentoDto } from './dto/create-tipos-documento.dto';
import { UpdateTiposDocumentoDto } from './dto/update-tipos-documento.dto';

@Injectable()
export class TiposDocumentosService {
  constructor(
    @InjectRepository(TiposDocumento)
    private readonly tiposDocumentoRepository: Repository<TiposDocumento>,
  ) {}

  create(createTiposDocumentoDto: CreateTiposDocumentoDto, usuarioId: number) {
    const nuevoTipo = this.tiposDocumentoRepository.create({
      ...createTiposDocumentoDto,
      creadoPor: usuarioId,
    });
    return this.tiposDocumentoRepository.save(nuevoTipo);
  }

  findAll() {
    return this.tiposDocumentoRepository.find({ where: { estado: true } });
  }

  async findOne(id: number) {
    const tipo = await this.tiposDocumentoRepository.findOneBy({
      id,
      estado: true,
    });
    if (!tipo) {
      throw new NotFoundException(`No se encontró el tipo de documento con id ${id}`);
    }
    return tipo;
  }

  async update(id: number, updateTiposDocumentoDto: UpdateTiposDocumentoDto, usuarioId: number) {
    await this.findOne(id);
    await this.tiposDocumentoRepository.update(id, {
      ...updateTiposDocumentoDto,
      modificadoPor: usuarioId,
    });
    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id);
    await this.tiposDocumentoRepository.update(id, {
      estado: false,
      modificadoPor: usuarioId,
    });
    return { message: 'Borrado exitoso' };
  }
}