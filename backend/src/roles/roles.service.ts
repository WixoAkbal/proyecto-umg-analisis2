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
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const nuevoRol = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(nuevoRol);
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: number) {
    const rol = await this.roleRepository.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`No se encontró el rol con id ${id}`);
    }
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRoleDto);
    return this.roleRepository.save(rol);
  }

  async remove(id: number) {
    const rol = await this.findOne(id);
    return this.roleRepository.remove(rol);
  }
}