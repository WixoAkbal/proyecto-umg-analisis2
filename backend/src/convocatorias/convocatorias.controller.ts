import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ConvocatoriasService } from './convocatorias.service';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('convocatorias')
export class ConvocatoriasController {
  constructor(private readonly convocatoriasService: ConvocatoriasService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createConvocatoriaDto: CreateConvocatoriaDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.convocatoriasService.create(createConvocatoriaDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.convocatoriasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.convocatoriasService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConvocatoriaDto: UpdateConvocatoriaDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.convocatoriasService.update(+id, updateConvocatoriaDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.convocatoriasService.remove(+id, usuarioId);
  }
}