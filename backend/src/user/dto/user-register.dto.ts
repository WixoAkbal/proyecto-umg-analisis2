import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class UserRegisterDto {
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
    @IsOptional()
    contrasenia: string;

    @IsNumber()
    @IsNotEmpty()
    rolId: number;

    @IsNumber()
    @IsNotEmpty()
    estadoId: number;

    @IsNumber()
    @IsNotEmpty()
    nivelAcademico: number;

    @IsString()
    @IsNotEmpty()
    institucionEducativa: string;

    @IsString()
    @IsNotEmpty()
    genero: string;

    @IsDateString()
    @IsNotEmpty()
    fechaNacimiento: string;
}