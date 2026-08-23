import { Injectable } from '@nestjs/common';
import { PruebaDto } from './dto/prueba.dto';

@Injectable()
export class PruebaService {

    private readonly test: PruebaDto[] = [];

    agregar(prueba: PruebaDto) {
        this.test.push(prueba);
    }

    buscar(): PruebaDto[] {
        return this.test;
    }
}
