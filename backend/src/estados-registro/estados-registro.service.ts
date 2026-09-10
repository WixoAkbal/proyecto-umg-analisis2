import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstadosRegistroDto } from './dto/create-estados-registro.dto';
import { UpdateEstadosRegistroDto } from './dto/update-estados-registro.dto';
import { EstadoRegistro } from './entities/estados-registro.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EstadosRegistroService {

	constructor(
		@InjectRepository(EstadoRegistro)
		private readonly estadoRegistroRepository: Repository<EstadoRegistro>,
	) { }

	create(createEstadosRegistroDto: CreateEstadosRegistroDto) {
		return 'This action adds a new estadosRegistro';
	}

	findAll() {
		return `This action returns all estadosRegistro`;
	}

	async findOne(id: number) {
		const estadoRegistro = await this.estadoRegistroRepository.findOneBy({ id, estado: true });
		
		if (!estadoRegistro) {
			throw new NotFoundException('No se ha encontrado el estado.');
		}
		
		return estadoRegistro;
	}

	update(id: number, updateEstadosRegistroDto: UpdateEstadosRegistroDto) {
		return `This action updates a #${id} estadosRegistro`;
	}

	remove(id: number) {
		return `This action removes a #${id} estadosRegistro`;
	}
}
