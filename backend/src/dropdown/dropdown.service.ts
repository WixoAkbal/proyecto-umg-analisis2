import { Injectable } from '@nestjs/common';
import { NivelesAcademicosService } from 'src/niveles-academicos/niveles-academicos.service';
import { DropdownDto } from './dto/dropdown.dto';

@Injectable()
export class DropdownServices {
    
    constructor(
        private readonly _nivelesAcademicosService: NivelesAcademicosService
    ) { }

    async nivelesAcademicos(): Promise<DropdownDto[]> {
        return this._nivelesAcademicosService.findForDropdown();
    }
}
