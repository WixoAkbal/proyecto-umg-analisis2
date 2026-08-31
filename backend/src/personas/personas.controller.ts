import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createPersonaDto: CreatePersonaDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.personasService.create(createPersonaDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.personasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personasService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonaDto: UpdatePersonaDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.personasService.update(+id, updatePersonaDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.personasService.remove(+id, usuarioId);
  }
}