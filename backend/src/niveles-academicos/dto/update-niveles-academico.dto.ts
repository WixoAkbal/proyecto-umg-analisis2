import { PartialType } from '@nestjs/mapped-types';
import { CreateNivelesAcademicoDto } from './create-niveles-academico.dto';

export class UpdateNivelesAcademicoDto extends PartialType(CreateNivelesAcademicoDto) {}
