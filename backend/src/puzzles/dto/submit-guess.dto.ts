import {IsInt, IsNotEmpty, IsString} from "class-validator";

export class SubmitGuessDTO {
    @IsInt()
    itemId!: number; 

    @IsString()
    @IsNotEmpty()
    attemptToken?: string;
}