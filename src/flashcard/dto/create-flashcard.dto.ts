import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import e from "express";

export class CreateFlashcardDto {

    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsString()
    answer: string;

    @IsOptional()
    @IsEnum(['open', 'multiple-choice'])
    type?: string;

    @IsArray()
    @ValidateNested({each: true})
    @IsOptional()
    options?: {correct: string, distractors: string[]}[];

    @IsArray()
    @IsString({each: true})
    conceptTags: string[]

}
