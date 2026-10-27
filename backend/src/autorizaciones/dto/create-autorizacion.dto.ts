import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';

export class CreateAutorizacionDto {
  @IsInt()
  solicitudId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(9999999999)
  monto: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;
}