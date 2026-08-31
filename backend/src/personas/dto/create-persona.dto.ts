import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsIn,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreatePersonaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  primerNombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  segundoNombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  tercerNombre?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  primerApellido: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  segundoApellido?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellidoCasada?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dpi: string;

  @IsInt()
  nivelAcademicoId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  institucionEducativa: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string;

  @IsIn(['masculino', 'femenino'])
  genero: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsInt()
  usuarioId: number;
}