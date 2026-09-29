import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { CreateEvaluacioneDto } from './dto/create-evaluacione.dto';
import { UpdateEvaluacioneDto } from './dto/update-evaluacione.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('evaluaciones')
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) {}

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Post()
  create(@Body() createEvaluacioneDto: CreateEvaluacioneDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.evaluacionesService.create(createEvaluacioneDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.evaluacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluacionesService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEvaluacioneDto: UpdateEvaluacioneDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.evaluacionesService.update(+id, updateEvaluacioneDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.evaluacionesService.remove(+id, usuarioId);
  }
}