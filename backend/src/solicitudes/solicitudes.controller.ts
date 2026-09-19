import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudeDto } from './dto/create-solicitude.dto';
import { UpdateSolicitudeDto } from './dto/update-solicitude.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() createSolicitudeDto: CreateSolicitudeDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.create(createSolicitudeDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.solicitudesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSolicitudeDto: UpdateSolicitudeDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.update(+id, updateSolicitudeDto, usuarioId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.solicitudesService.remove(+id, usuarioId);
  }
}