import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  create(
    @Body() createDocumentoDto: CreateDocumentoDto,
    @UploadedFile() archivo: Express.Multer.File,
    @Req() request: Request,
  ) {
    if (!archivo) {
      throw new BadRequestException('Debe adjuntar un archivo');
    }
    const usuarioId = (request as any).user.sub;
    return this.documentosService.create(createDocumentoDto, archivo, usuarioId);
  }

  @Get()
  findAll() {
    return this.documentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentosService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuarioId = (request as any).user.sub;
    return this.documentosService.remove(+id, usuarioId);
  }
}