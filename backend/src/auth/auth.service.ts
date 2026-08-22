import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly _usersService: UserService,
        private readonly _jwtService: JwtService
    ) { }

    async authenticateUser(loginRequestDto: LoginRequestDto): Promise<{ token: string }> {
        const user = await this._usersService.loadUserByUsername(loginRequestDto.username);
        
        if (user?.contrasenia !== loginRequestDto.password) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.correoElectronico, roles: user.roles.map((userRole) => userRole.rol.nombre)};
        
        return {
            token: await this._jwtService.signAsync(payload),
        };
    }
}
