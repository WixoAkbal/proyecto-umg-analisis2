import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { Public, Roles } from './auth.decorator';
import { Role } from './roles/role.enum';

@Controller('auth')
export class AuthController {

    constructor(private readonly _authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginRequestDto: LoginRequestDto) {
        return this._authService.authenticateUser(loginRequestDto);
    }

    @Get('test-guard')
    @Roles(Role.ADMIN)
    testGuard(): string {
        return 'Si la valido';
    }
}
