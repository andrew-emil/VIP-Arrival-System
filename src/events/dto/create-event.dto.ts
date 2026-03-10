import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
    @ApiProperty({ example: 'Global Tech Summit 2026' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '2026-03-09T08:00:00Z' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @ApiProperty({ example: '2026-03-10T20:00:00Z' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endTime: Date;

    @ApiProperty({ example: 'ACTIVE' })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({ example: 480, required: false })
    @IsOptional()
    @IsInt()
    window?: number;
}
