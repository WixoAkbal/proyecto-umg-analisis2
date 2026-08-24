import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadosRegistroDto } from './create-estados-registro.dto';

export class UpdateEstadosRegistroDto extends PartialType(CreateEstadosRegistroDto) {}
