import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTiposBecaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @MaxLength(255)
  descripcion: string;
}