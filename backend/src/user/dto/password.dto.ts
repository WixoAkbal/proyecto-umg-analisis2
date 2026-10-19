import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class PasswordDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    contraseniaActual: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    contraseniaNueva: string;    
}