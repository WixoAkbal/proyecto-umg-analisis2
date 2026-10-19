import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly _usersService: UserService,
        private readonly _jwtService: JwtService
    ) { }

    async authenticateUser(loginRequestDto: LoginRequestDto): Promise<{ token: string }> {
        const user = await this._usersService.loadUserByUsername(loginRequestDto.username);
        
        const validatePassword = await bcrypt.compare(
            loginRequestDto.password,
            user!!.contrasenia,
        );

        if (!validatePassword) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { sub: user!!.id, username: user!!.correoElectronico, roles: user!!.roles.map((userRole) => userRole.rol.nombre)};
        
        return {
            token: await this._jwtService.signAsync(payload),
        };
    }
}
