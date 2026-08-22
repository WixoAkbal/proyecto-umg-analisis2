import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>
    ) { }

    async loadUserByUsername(username: string): Promise<User | undefined> {
        const user = await this._userRepository.findOne({
            where: { correoElectronico: username },
            relations: {
                roles: { rol: true }
            }
        });

        if (!user) {
            throw new NotFoundException('El usuario, no se encuentra registrado.');
        }

        return user;
    }
}
