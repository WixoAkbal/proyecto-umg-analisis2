import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateHistorialEstadoDto {
  @IsInt()
  solicitudId: number;

  @IsInt()
  @IsOptional()
  estadoAnteriorSolicitudId?: number;

  @IsInt()
  estadoNuevoSolicitudId: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  comentario?: string;
}