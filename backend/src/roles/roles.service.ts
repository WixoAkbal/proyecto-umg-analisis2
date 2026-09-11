import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
	) { }

	create(createRoleDto: CreateRoleDto, usuarioId: number) {
		const nuevoRol = this.roleRepository.create({
			...createRoleDto,
			creadoPor: usuarioId,
		});
		return this.roleRepository.save(nuevoRol);
	}

	findAll() {
		return this.roleRepository.find({ where: { estado: true } });
	}

	async findOne(id: number) {
		const rol = await this.roleRepository.findOneBy({ id, estado: true });
		
		if (!rol) {
			throw new NotFoundException('No se ha encontrado el rol.');
		}
		
		return rol;
	}

	async update(id: number, updateRoleDto: UpdateRoleDto, usuarioId: number) {
		await this.findOne(id);
		await this.roleRepository.update(id, {
			...updateRoleDto,
			modificadoPor: usuarioId,
		});
		return this.findOne(id);
	}

	async remove(id: number, usuarioId: number) {
		await this.findOne(id);
		await this.roleRepository.update(id, {
			estado: false,
			modificadoPor: usuarioId,
		});
		return { message: 'Borrado exitoso' };
	}
}