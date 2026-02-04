import {
    IsString,
    IsOptional,
    IsNumber,
    IsISO8601,
    IsNotEmpty,
} from 'class-validator';


export class PlateReadDto {
    @IsString()
    @IsNotEmpty()
    plate: string;

    @IsOptional()
    @IsISO8601()
    timestamp?: string;

    @IsOptional()
    @IsString()
    cameraId?: string;

    @IsOptional()
    @IsNumber()
    lat?: number;

    @IsOptional()
    @IsNumber()
    lng?: number;
}
