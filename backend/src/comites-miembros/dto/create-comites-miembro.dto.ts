import { IsInt } from 'class-validator';

export class CreateComitesMiembroDto {
  @IsInt()
  comiteId: number;

  @IsInt()
  evaluadorId: number;
}