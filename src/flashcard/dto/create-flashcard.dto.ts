import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

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

    @ValidateNested()
    @IsOptional()
    options?: { correct: string, distractors: string[] } | null;

    @IsArray()
    @IsString({ each: true })
    conceptTags: string[]

    @IsUUID()
    resourceId: string;

}
