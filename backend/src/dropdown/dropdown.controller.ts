import { Controller, Get } from "@nestjs/common";
import { Public } from "src/auth/auth.decorator";
import { DropdownServices } from "./dropdown.service";

@Controller('dropdown')
export class DropdownController {

    constructor(
        private readonly _dropdownService: DropdownServices
    ) { }

    @Public()
    @Get('test')
    async test() {
        return "test";
    }

    @Public()
    @Get('niveles-academicos')
    async nivelesAcademicos() {
        return this._dropdownService.nivelesAcademicos();
    }
}