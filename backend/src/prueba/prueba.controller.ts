import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { PruebaDto } from './dto/prueba.dto';
import type { Response } from 'express';
import { PruebaService } from './prueba.service';

@Controller('prueba')
export class PruebaController {

    constructor(
        private readonly _pruebaService: PruebaService
    ) { }

    @Get()
    prueba(): string {
        return 'Esto es una prueba!!!';
    }

    @Get('hola-mundo')
    holaMundo(): string {
        return 'Hola mundo.';
    }

    @Get('param/:id')
    param(@Param('id') id: number): string {
        return `El numero ingresado es ${id}.`
    } 

    @Get('body')
    body(@Body() pruebaDto: PruebaDto): string {
        return `Hola ${pruebaDto.nombre}, tu edad es de ${pruebaDto.edad}, gracias!`;
    }

    @Get('query')
    query(@Query('nombre') nombre: string, @Query('edad') edad: number): string {
        return `Hola ${nombre}, tu edad es de ${edad}, gracias!`;
    }

    @Get('res')
    res(@Res() res: Response) {
        let prueba = new PruebaDto;

        prueba.nombre = "Prueba";
        prueba.edad = 18;

        res.status(HttpStatus.OK).json(prueba);
    }

    @Post('crear')
    async crear(@Body() pruebaBody: PruebaDto) {
        this._pruebaService.agregar(pruebaBody);
    }

    @Get('buscar')
    async buscar(): Promise<PruebaDto[]> {
        return this._pruebaService.buscar();
    }

}
