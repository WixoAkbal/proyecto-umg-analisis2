import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    apellido: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    correoElectronico: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    contrasenia: string;

    @IsNumber()
    @IsNotEmpty()
    rolId: number;

    @IsNumber()
    @IsNotEmpty()
    estadoId: number;
}