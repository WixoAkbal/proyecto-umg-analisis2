import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { HistorialEstadosService } from './historial-estados.service';
import { CreateHistorialEstadoDto } from './dto/create-historial-estado.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('historial-estados')
export class HistorialEstadosController {
  constructor(private readonly historialEstadosService: HistorialEstadosService) {}

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Post()
  create(@Body() createHistorialEstadoDto: CreateHistorialEstadoDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.historialEstadosService.create(createHistorialEstadoDto, usuarioId);
  }

  @Get('solicitud/:solicitudId')
  findBySolicitud(@Param('solicitudId') solicitudId: string) {
    return this.historialEstadosService.findBySolicitud(+solicitudId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialEstadosService.findOne(+id);
  }
}