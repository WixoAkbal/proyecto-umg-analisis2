import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { NivelesAcademicosService } from './niveles-academicos.service';
import { CreateNivelesAcademicoDto } from './dto/create-niveles-academico.dto';
import { UpdateNivelesAcademicoDto } from './dto/update-niveles-academico.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('niveles-academicos')
export class NivelesAcademicosController {
  constructor(private readonly nivelesAcademicosService: NivelesAcademicosService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createNivelesAcademicoDto: CreateNivelesAcademicoDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.nivelesAcademicosService.create(createNivelesAcademicoDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.nivelesAcademicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nivelesAcademicosService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNivelesAcademicoDto: UpdateNivelesAcademicoDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.nivelesAcademicosService.update(+id, updateNivelesAcademicoDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.nivelesAcademicosService.remove(+id, usuarioId);
  }
}