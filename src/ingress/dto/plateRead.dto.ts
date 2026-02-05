import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsOptional,
    IsString,
    IsUUID
} from 'class-validator';


export class PlateReadDto {
    @ApiProperty({ example: 'ABC 123', description: 'License plate number' })
    @IsString()
    plate: string;

    @ApiProperty({ example: 'uuid-string', description: 'ID of the camera' })
    @IsUUID()
    cameraId: string;

    @ApiProperty({ required: false, example: '2023-10-01T12:00:00Z' })
    @IsOptional()
    @IsString()
    timestamp?: string;

    @ApiProperty({ required: false, example: 95.5 })
    @IsOptional()
    @IsNumber()
    confidence?: number;

    @ApiProperty({ required: false, description: 'URL to the snapshot image' })
    @IsOptional()
    @IsString()
    snapshotUrl?: string;
}
