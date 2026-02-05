import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVipDto {
    @ApiProperty({ example: 'ABC 123', description: 'License plate number' })
    @IsString()
    plate: string;

    @ApiProperty({ required: false, example: 'John Doe', description: 'Name of the VIP' })
    @IsOptional()
    @IsString()
    name?: string;
}
