import { Controller, Get, Post, Body, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { ComitesMiembrosService } from './comites-miembros.service';
import { CreateComitesMiembroDto } from './dto/create-comites-miembro.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('comites-miembros')
export class ComitesMiembrosController {
  constructor(private readonly comitesMiembrosService: ComitesMiembrosService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createComitesMiembroDto: CreateComitesMiembroDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.comitesMiembrosService.create(createComitesMiembroDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Get('evaluadores')
  findEvaluadores() {
    return this.comitesMiembrosService.findEvaluadores();
  }

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Get()
  findAll() {
    return this.comitesMiembrosService.findAll();
  }

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Get(':comiteId/:evaluadorId')
  findOne(
    @Param('comiteId', ParseIntPipe) comiteId: number,
    @Param('evaluadorId', ParseIntPipe) evaluadorId: number,
  ) {
    return this.comitesMiembrosService.findOne(comiteId, evaluadorId);
  }

  @Roles(Role.ADMIN)
  @Delete(':comiteId/:evaluadorId')
  remove(
    @Param('comiteId', ParseIntPipe) comiteId: number,
    @Param('evaluadorId', ParseIntPipe) evaluadorId: number,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.comitesMiembrosService.remove(comiteId, evaluadorId, usuarioId);
  }
}