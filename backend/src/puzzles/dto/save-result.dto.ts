import {IsString, IsNotEmpty, IsOptional} from "class-validator";


export class SaveResultDTO {
    @IsString()
    @IsNotEmpty()
    attemptToken!: string;
}