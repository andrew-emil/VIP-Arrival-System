import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsDateString()
    startTime: Date;

    @IsNotEmpty()
    @IsDateString()
    endTime: Date;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsOptional()
    @IsInt()
    window?: number;
}
