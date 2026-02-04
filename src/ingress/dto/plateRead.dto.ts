import {
    IsNumber,
    IsOptional,
    IsString,
    IsUUID
} from 'class-validator';


export class PlateReadDto {
    @IsString()
    plate: string;

    @IsUUID()
    cameraId: string;

    @IsOptional()
    @IsString()
    timestamp?: string;

    @IsOptional()
    @IsNumber()
    confidence?: number;

    @IsOptional()
    @IsString()
    snapshotUrl?: string;
}
