import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TiposDocumentosService } from './tipos-documentos.service';
import { CreateTiposDocumentoDto } from './dto/create-tipos-documento.dto';
import { UpdateTiposDocumentoDto } from './dto/update-tipos-documento.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('tipos-documentos')
export class TiposDocumentosController {
  constructor(private readonly tiposDocumentosService: TiposDocumentosService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createTiposDocumentoDto: CreateTiposDocumentoDto, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.tiposDocumentosService.create(createTiposDocumentoDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.tiposDocumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposDocumentosService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTiposDocumentoDto: UpdateTiposDocumentoDto,
    @Req() request: Request,
  ) {
    const usuarioId = (request as any).user.sub;
    return this.tiposDocumentosService.update(+id, updateTiposDocumentoDto, usuarioId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.tiposDocumentosService.remove(+id, usuarioId);
  }
}