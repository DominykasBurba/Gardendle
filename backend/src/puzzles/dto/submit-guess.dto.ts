import {IsInt, IsNotEmpty, IsString, IsOptional} from "class-validator";

export class SubmitGuessDTO {
    @IsInt()
    itemId!: number; 

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    attemptToken?: string;
}