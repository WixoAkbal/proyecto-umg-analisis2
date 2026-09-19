import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentoDto {
  @Type(() => Number)
  @IsInt()
  solicitudId: number;

  @Type(() => Number)
  @IsInt()
  tipoDocumentoId: number;
}