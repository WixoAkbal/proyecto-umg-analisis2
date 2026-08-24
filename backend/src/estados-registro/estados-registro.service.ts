import { Injectable } from '@nestjs/common';
import { CreateEstadosRegistroDto } from './dto/create-estados-registro.dto';
import { UpdateEstadosRegistroDto } from './dto/update-estados-registro.dto';

@Injectable()
export class EstadosRegistroService {
  create(createEstadosRegistroDto: CreateEstadosRegistroDto) {
    return 'This action adds a new estadosRegistro';
  }

  findAll() {
    return `This action returns all estadosRegistro`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estadosRegistro`;
  }

  update(id: number, updateEstadosRegistroDto: UpdateEstadosRegistroDto) {
    return `This action updates a #${id} estadosRegistro`;
  }

  remove(id: number) {
    return `This action removes a #${id} estadosRegistro`;
  }
}
