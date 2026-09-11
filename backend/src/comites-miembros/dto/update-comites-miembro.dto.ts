import { PartialType } from '@nestjs/mapped-types';
import { CreateComitesMiembroDto } from './create-comites-miembro.dto';

export class UpdateComitesMiembroDto extends PartialType(CreateComitesMiembroDto) {}
