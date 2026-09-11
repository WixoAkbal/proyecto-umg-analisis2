import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadosSolicitudeDto } from './create-estados-solicitude.dto';

export class UpdateEstadosSolicitudeDto extends PartialType(CreateEstadosSolicitudeDto) {}
