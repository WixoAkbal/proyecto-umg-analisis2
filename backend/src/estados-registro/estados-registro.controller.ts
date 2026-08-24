import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstadosRegistroService } from './estados-registro.service';
import { CreateEstadosRegistroDto } from './dto/create-estados-registro.dto';
import { UpdateEstadosRegistroDto } from './dto/update-estados-registro.dto';

@Controller('estados-registro')
export class EstadosRegistroController {
  constructor(private readonly estadosRegistroService: EstadosRegistroService) {}

  @Post()
  create(@Body() createEstadosRegistroDto: CreateEstadosRegistroDto) {
    return this.estadosRegistroService.create(createEstadosRegistroDto);
  }

  @Get()
  findAll() {
    return this.estadosRegistroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosRegistroService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstadosRegistroDto: UpdateEstadosRegistroDto) {
    return this.estadosRegistroService.update(+id, updateEstadosRegistroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estadosRegistroService.remove(+id);
  }
}
