import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAttemptDto {

    @IsOptional()
    @IsString()
    userAnswer?: string;

    @IsNotEmpty()
    @IsBoolean()
    isCorrect: boolean;

    @IsOptional()
    @IsEnum(['conceptual', 'memoria', 'confusion', 'incompleto'])
    errorType?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    missingConcepts?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    incorrectConcepts?: string[];

    @IsOptional()
    @IsString()
    feedback?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    confidenceScore?: number;
}
