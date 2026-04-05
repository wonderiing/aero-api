import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateStudyDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    description: string;

}
