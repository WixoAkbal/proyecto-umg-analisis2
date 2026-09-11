import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from "@nestjs/common";
import { Roles } from "src/auth/auth.decorator";
import { Role } from "src/auth/roles/role.enum";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";

@Controller('user')
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

    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() userDto: UserDto, @Req() request: Request) {
        const subId = (request as any).user.sub;
        return this._userService.create(userDto, subId);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() userDto: UserDto, @Req() request: Request) {
        const subId = (request as any).user.sub;
        return this._userService.update(id, userDto, subId);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: number, @Req() request: Request) {
        const subId = (request as any).user.sub;
        return this._userService.remove(id, subId);
    }
}