import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ComitesService } from './comites.service';
import { CreateComiteDto } from './dto/create-comite.dto';
import { UpdateComiteDto } from './dto/update-comite.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('comites')
export class ComitesController {
  constructor(private readonly comitesService: ComitesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createComiteDto: CreateComiteDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.comitesService.create(createComiteDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.comitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comitesService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComiteDto: UpdateComiteDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.comitesService.update(+id, updateComiteDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.comitesService.remove(+id, usuarioId);
  }
}