import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateConvocatoriaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  fechaApertura: string;

  @IsDateString()
  fechaCierre: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  cuposDisponibles?: number;

  @IsInt()
  tipoBecaId: number;

  @IsInt()
  estadoConvocatoriaId: number;
}