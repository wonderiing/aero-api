import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit?: number;
}