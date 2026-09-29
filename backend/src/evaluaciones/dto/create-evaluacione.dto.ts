import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateEvaluacioneDto {
  @IsInt()
  solicitudId: number;

  @IsInt()
  comiteId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999.99)
  puntaje: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}