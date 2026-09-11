import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { EstadosSolicitudesService } from './estados-solicitudes.service';
import { CreateEstadosSolicitudeDto } from './dto/create-estados-solicitude.dto';
import { UpdateEstadosSolicitudeDto } from './dto/update-estados-solicitude.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('estados-solicitudes')
export class EstadosSolicitudesController {
  constructor(private readonly estadosSolicitudesService: EstadosSolicitudesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createEstadosSolicitudeDto: CreateEstadosSolicitudeDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.estadosSolicitudesService.create(createEstadosSolicitudeDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.estadosSolicitudesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosSolicitudesService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstadosSolicitudeDto: UpdateEstadosSolicitudeDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.estadosSolicitudesService.update(+id, updateEstadosSolicitudeDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.estadosSolicitudesService.remove(+id, usuarioId);
  }
}