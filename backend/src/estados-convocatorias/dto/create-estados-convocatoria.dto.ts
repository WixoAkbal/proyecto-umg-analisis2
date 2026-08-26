import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateEstadosConvocatoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @MaxLength(200)
  descripcion?: string;
}