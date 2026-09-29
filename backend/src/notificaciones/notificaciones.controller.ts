import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createNotificacioneDto: CreateNotificacioneDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.notificacionesService.create(createNotificacioneDto, usuarioId);
  }

  @Get()
  findMias(@Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.notificacionesService.findAllByUsuario(usuarioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificacionesService.findOne(+id);
  }

  @Patch(':id/leida')
  marcarLeida(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.notificacionesService.marcarLeida(+id, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.notificacionesService.remove(+id, usuarioId);
  }
}