import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadosConvocatoriaDto } from './create-estados-convocatoria.dto';

export class UpdateEstadosConvocatoriaDto extends PartialType(CreateEstadosConvocatoriaDto) {}
