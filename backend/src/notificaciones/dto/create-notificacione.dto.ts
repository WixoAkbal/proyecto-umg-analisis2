import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNotificacioneDto {
  @IsInt()
  usuarioId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  mensaje: string;
}