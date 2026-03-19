import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVipDto {
    @ApiProperty({ example: 'ABC 123', description: 'License plate number' })
    @IsString()
    @IsNotEmpty()
    plate: string;

    @ApiPropertyOptional({ required: false, example: 'John Doe', description: 'Name of the VIP' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ required: false, example: 'Acme Inc.', description: 'VIP company' })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiPropertyOptional({ required: false, example: 'B', description: 'Protocol level' })
    @IsOptional()
    @IsString()
    protocolLevel?: string;

    @ApiPropertyOptional({ required: false, example: 'Notes about the VIP', description: 'VIP notes' })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({ required: false, example: 'https://example.com/photo.jpg', description: 'VIP photo URL' })
    @IsOptional()
    @IsString()
    photoUrl?: string;

    // Frontend sends both `plate` (singular) and `plateNumbers` (array).
    // We only use `plate` on the backend (single plate relation),
    // but we accept `plateNumbers` to pass validation.
    @ApiPropertyOptional({ required: false, example: ['ABC 123'], description: 'Plate numbers array (optional)' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    plateNumbers?: string[];
}

