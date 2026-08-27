import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TiposBecasService } from './tipos-becas.service';
import { CreateTiposBecaDto } from './dto/create-tipos-beca.dto';
import { UpdateTiposBecaDto } from './dto/update-tipos-beca.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('tipos-becas')
export class TiposBecasController {
  constructor(private readonly tiposBecasService: TiposBecasService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createTiposBecaDto: CreateTiposBecaDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.tiposBecasService.create(createTiposBecaDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.tiposBecasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposBecasService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTiposBecaDto: UpdateTiposBecaDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.tiposBecasService.update(+id, updateTiposBecaDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.tiposBecasService.remove(+id, usuarioId);
  }
}