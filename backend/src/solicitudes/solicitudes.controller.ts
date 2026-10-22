import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudeDto } from './dto/create-solicitude.dto';
import { UpdateSolicitudeDto } from './dto/update-solicitude.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Roles(Role.ESTUDIANTE)
  @Get('mias')
  findMias(@Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.findByUsuario(usuarioId);
  }
  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Get('resumen')
  resumen() {
    return this.solicitudesService.resumen();
  }

  @Roles(Role.ESTUDIANTE)
  @Post('propia')
  createPropia(
    @Body('convocatoriaId', ParseIntPipe) convocatoriaId: number,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.crearPropia(convocatoriaId, usuarioId);
  }

  @Roles(Role.ESTUDIANTE)
  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.cancelarPropia(id, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(
    @Body() createSolicitudeDto: CreateSolicitudeDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.create(createSolicitudeDto, usuarioId);
  }

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Get()
  findAll() {
    return this.solicitudesService.findAll();
  }

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSolicitudeDto: UpdateSolicitudeDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.update(+id, updateSolicitudeDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.remove(+id, usuarioId);
  }
}
