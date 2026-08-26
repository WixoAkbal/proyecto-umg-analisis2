import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposBecaDto } from './create-tipos-beca.dto';

export class UpdateTiposBecaDto extends PartialType(CreateTiposBecaDto) {}
