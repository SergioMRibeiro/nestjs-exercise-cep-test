import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(11)
    cpf: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    cep: string;

    @IsString()
    @IsNotEmpty()
    houseNumber: string;
}
