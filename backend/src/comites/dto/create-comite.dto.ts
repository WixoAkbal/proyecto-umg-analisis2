import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateComiteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;
}