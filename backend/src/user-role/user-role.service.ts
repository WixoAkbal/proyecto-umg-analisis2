import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entity/user-role.entity';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { EstadoRegistro } from 'src/estados-registro/entities/estados-registro.entity';

@Injectable()
export class UserRoleService {
    
    constructor(
        @InjectRepository(UserRole)
        private readonly _userRoleRepository: Repository<UserRole>
    ) { }

    async create(user: User, role: Role, status: EstadoRegistro, subId: number) {
        try {
            const addUserRole = this._userRoleRepository.create({
                usuario: user,
                rol: role,
                estado: status,
                creadoPor: subId
            });

            return await this._userRoleRepository.save(addUserRole);
        } catch(error) {
            throw new InternalServerErrorException('Ha ocurrido un error al intentar guardar el rol del usuario.');
        }
    }

    async update(userRole: UserRole, role: Role, subId: number) {
        try {
            Object.assign(userRole, {
                ...(role && { rol: role }),
                modificadoPor: subId
            });

            return await this._userRoleRepository.save(userRole);
        } catch(error) {
            throw new InternalServerErrorException('Ha ocurrido un error al intentar actualizar el rol del usuario.');
        }
    }
}
