import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseInterceptors } from "@nestjs/common";
import { Roles } from "src/auth/auth.decorator";
import { Role } from "src/auth/roles/role.enum";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { PasswordDto } from "./dto/password.dto";
import { UserPartialDto } from "./dto/user-partial.dto";

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

    constructor(private readonly _userService: UserService) { }

    @Roles(Role.ADMIN)
    @Get(['', '/'])
    async findAll() {
        return this._userService.findAll();
    }

    @Roles(Role.ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this._userService.findById(id);
    }

    @Roles(Role.ADMIN, Role.ESTUDIANTE)
    @Post()
    async create(@Body() userDto: UserDto, @Req() request: Request) {
        const subId = (request as any).user.sub;
        return this._userService.create(userDto, subId);
    }

    @Roles(Role.ADMIN, Role.ESTUDIANTE)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() userDto: UserPartialDto, @Req() request: Request) {
        const subId = (request as any).user.sub;
        return this._userService.update(id, userDto, subId);
    }

    @Roles(Role.ADMIN, Role.ESTUDIANTE)
    @Delete(':id')
    async remove(@Param('id') id: number, @Req() request: Request) {
        const subId = (request as any).user.sub;
        return this._userService.remove(id, subId);
    }

    @Roles(Role.ADMIN, Role.ESTUDIANTE)
    @Patch('/change-password/:id')
    async changePassword(@Param('id') id: number, @Body() passwordDto: PasswordDto, @Req() request: Request) {
        const subId = (request as any).user.sub;
        return this._userService.changePassword(id, passwordDto, subId);
    }
}