import { IsInt, IsOptional } from 'class-validator';

export class CreateSolicitudeDto {
  @IsInt()
  personaId: number;

  @IsInt()
  convocatoriaId: number;

  @IsInt()
  estadoSolicitudId: number;

  @IsInt()
  @IsOptional()
  comiteId?: number;
}