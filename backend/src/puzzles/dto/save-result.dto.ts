import {IsString, IsNotEmpty} from "class-validator";


export class SaveResultDTO {
    @IsString()
    @IsNotEmpty()
    attemptToken!: string;
}