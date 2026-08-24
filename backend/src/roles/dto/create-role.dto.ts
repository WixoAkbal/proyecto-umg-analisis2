import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @MaxLength(200)
  descripcion?: string;
}