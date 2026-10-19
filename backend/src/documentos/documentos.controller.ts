import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../auth/roles/role.enum';

const TIPOS_PERMITIDOS = ['pdf', 'png', 'jpg', 'jpeg'];

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Roles(Role.ADMIN, Role.ESTUDIANTE)
  @Post()
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const ext = file.originalname.split('.').pop()?.toLowerCase() ?? '';
        if (!TIPOS_PERMITIDOS.includes(ext)) {
          return cb(
            new BadRequestException('Solo se permiten archivos PDF, JPG o PNG'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createDocumentoDto: CreateDocumentoDto,
    @UploadedFile() archivo: Express.Multer.File,
    @Req() request: Request,
  ) {
    if (!archivo) {
      throw new BadRequestException('Debe adjuntar un archivo');
    }
    const usuario = (request as any).user;
    return this.documentosService.create(createDocumentoDto, archivo, usuario);
  }

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Get()
  findAll() {
    return this.documentosService.findAll();
  }

  @Get('solicitud/:solicitudId')
  findBySolicitud(
    @Param('solicitudId', ParseIntPipe) solicitudId: number,
    @Req() request: Request,
  ) {
    const usuario = (request as any).user;
    return this.documentosService.findBySolicitud(solicitudId, usuario);
  }

  @Get(':id/archivo')
  async descargar(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const usuario = (request as any).user;
    const { nombre, mime, archivo } =
      await this.documentosService.obtenerArchivo(id, usuario);

    res.set({
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(nombre)}`,
    });
    return new StreamableFile(archivo);
  }

  @Roles(Role.ADMIN, Role.EVALUADOR)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.ESTUDIANTE)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const usuario = (request as any).user;
    return this.documentosService.remove(id, usuario);
  }
}