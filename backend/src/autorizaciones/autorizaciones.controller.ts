import {
  Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseInterceptors,
} from '@nestjs/common';
import { AutorizacionesService } from './autorizaciones.service';
import { CreateAutorizacionDto } from './dto/create-autorizacion.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('autorizaciones')
@UseInterceptors(ClassSerializerInterceptor)
export class AutorizacionesController {
  constructor(private readonly autorizacionesService: AutorizacionesService) {}

  @Roles(Role.EVALUADOR)
  @Post()
  create(@Body() dto: CreateAutorizacionDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.autorizacionesService.create(dto, usuarioId);
  }

  @Roles(Role.ADMIN, Role.EVALUADOR, Role.AUTORIZADOR)
  @Get()
  findAll() {
    return this.autorizacionesService.findAll();
  }

  @Roles(Role.ADMIN, Role.EVALUADOR, Role.AUTORIZADOR)
  @Get('pendientes')
  findPendientes() {
    return this.autorizacionesService.findPendientes();
  }

  @Roles(Role.ADMIN, Role.EVALUADOR, Role.AUTORIZADOR)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.autorizacionesService.findOne(id);
  }

  @Roles(Role.AUTORIZADOR)
  @Patch(':id/confirmar')
  confirmar(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.autorizacionesService.confirmar(id, usuarioId);
  }

  @Roles(Role.AUTORIZADOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.autorizacionesService.remove(id, usuarioId);
  }
}