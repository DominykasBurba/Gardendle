import {IsNotEmpty, IsString} from 'class-validator';

export class AuthInputDTO {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    password!: string
}