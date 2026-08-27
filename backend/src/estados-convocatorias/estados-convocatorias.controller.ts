import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { EstadosConvocatoriasService } from './estados-convocatorias.service';
import { CreateEstadosConvocatoriaDto } from './dto/create-estados-convocatoria.dto';
import { UpdateEstadosConvocatoriaDto } from './dto/update-estados-convocatoria.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('estados-convocatorias')
export class EstadosConvocatoriasController {
  constructor(
    private readonly estadosConvocatoriasService: EstadosConvocatoriasService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  create(
    @Body() createEstadosConvocatoriaDto: CreateEstadosConvocatoriaDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.estadosConvocatoriasService.create(
      createEstadosConvocatoriaDto,
      usuarioId,
    );
  }

  @Get()
  findAll() {
    return this.estadosConvocatoriasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosConvocatoriasService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstadosConvocatoriaDto: UpdateEstadosConvocatoriaDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.estadosConvocatoriasService.update(
      +id,
      updateEstadosConvocatoriaDto,
      usuarioId,
    );
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.estadosConvocatoriasService.remove(+id, usuarioId);
  }
}