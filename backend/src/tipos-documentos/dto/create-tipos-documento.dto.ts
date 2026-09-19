import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTiposDocumentoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @MaxLength(200)
  descripcion?: string;
}